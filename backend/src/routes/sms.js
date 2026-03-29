import express from "express";
import AfricasTalking from "africastalking";
import { Booking, SMSLog, User } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Helper function to send SMS via Africa's Talking SDK
async function sendSMS(recipientPhone, message) {
  try {
    const apiKey = process.env.AT_API_KEY;
    const username = process.env.AT_USERNAME;

    if (!apiKey || !username) {
      console.error("Africa's Talking API credentials missing");
      return { success: false };
    }

    // Initialize Africa's Talking SDK
    const africastalking = AfricasTalking({
      apiKey: apiKey,
      username: username,
    });
    const sms = africastalking.SMS;

    // Sanitize phone number - remove spaces and non-digit characters
    let sanitizedPhone = recipientPhone.replace(/\D/g, "");
    // Convert local Kenya format (0XXXXXXXXX) to international (254XXXXXXXXX)
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "254" + sanitizedPhone.substring(1);
    }

    console.log(
      `[SMS] Sending to: +${sanitizedPhone}, Message: ${message.substring(0, 50)}...`,
    );

    const options = {
      to: [`+${sanitizedPhone}`],
      message: message,
      from: process.env.AT_SENDER_ID || "AFTKNG",
    };

    const result = await sms.send(options);

    // Parse Africa's Talking SDK response format
    const recipients = result?.SMSMessageData?.Recipients || [];

    if (recipients && recipients.length > 0) {
      const recipient = recipients[0];
      const transactionId = recipient.messageId || `SMS${Date.now()}`;

      console.log(`[SMS SENT] Status Code: 200, Phone: +${sanitizedPhone}`, {
        messageId: transactionId,
        cost: recipient.cost,
        status: recipient.status,
      });

      return {
        success: recipient.status === "Success" || recipient.statusCode === 200,
        transactionId,
      };
    }

    console.error("[SMS ERROR] No recipients in response");
    return { success: false };
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
    console.error(`[SMS ERROR]`, error);
    return { success: false };
  }
}

// Send appointment reminder SMS
async function sendAppointmentReminder(bookingId, reminderType) {
  try {
    const booking = await Booking.findById(bookingId).populate("user_id");
    if (!booking || !booking.user_id) return false;

    const user = booking.user_id;
    const appointmentDate = new Date(
      booking.appointment_date,
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const appointmentTime = new Date(
      booking.appointment_date,
    ).toLocaleTimeString();

    const message = `Dear ${user.first_name}, this is a reminder that you have an appointment with Nairobi Skin Centre on ${appointmentDate} at ${appointmentTime}. Location: Fortis suites. To reschedule or cancel, call 070342519. – NSC-AI Assistant`;

    const smsResult = await sendSMS(user.phone_number, message);

    if (smsResult.success) {
      // Log the SMS
      await SMSLog.create({
        recipient_phone: user.phone_number,
        message_content: message,
        booking_id: bookingId,
        reminder_type:
          reminderType === "48h" ? "appointment-48h" : "appointment-24h",
        status: "sent",
        delivery_status: "pending",
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Send appointment reminder error:", error);
    return false;
  }
}

// Schedule reminders for a booking (called after booking is confirmed)
router.post(
  "/schedule-reminders/:bookingId",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const appointmentDate = new Date(booking.appointment_date);
      const now = new Date();

      // Calculate reminder times
      const reminder48h = new Date(
        appointmentDate.getTime() - 48 * 60 * 60 * 1000,
      );
      const reminder24h = new Date(
        appointmentDate.getTime() - 24 * 60 * 60 * 1000,
      );

      // TODO: Use a job scheduler (e.g., node-cron or Bull) to queue these reminders
      // For now, return the scheduled times
      res.json({
        message: "Reminders scheduled",
        bookingId,
        reminders: [
          { type: "48h", scheduledFor: reminder48h },
          { type: "24h", scheduledFor: reminder24h },
        ],
      });
    } catch (error) {
      console.error("Schedule reminders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Send SMS reminder manually (admin/trigger)
router.post("/send-reminder/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reminderType } = req.body;

    if (!reminderType || !["48h", "24h"].includes(reminderType)) {
      return res.status(400).json({ error: "Invalid reminder type" });
    }

    const success = await sendAppointmentReminder(bookingId, reminderType);

    if (!success) {
      return res.status(500).json({ error: "Failed to send reminder SMS" });
    }

    res.json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Send reminder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send confirmation SMS after booking
router.post("/send-confirmation/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("user_id");
    if (!booking || !booking.user_id) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const user = booking.user_id;
    const appointmentDate = new Date(
      booking.appointment_date,
    ).toLocaleDateString();
    const appointmentTime = new Date(
      booking.appointment_date,
    ).toLocaleTimeString();

    const message = `Your appointment at Nairobi Skin Centre is confirmed for ${appointmentDate} at ${appointmentTime}. Ref: ${booking._id}. For changes, call 0703425197.`;

    const smsResult = await sendSMS(user.phone_number, message);

    if (!smsResult.success) {
      return res.status(500).json({ error: "Failed to send confirmation SMS" });
    }

    // Log the SMS
    await SMSLog.create({
      recipient_phone: user.phone_number,
      message_content: message,
      booking_id: bookingId,
      reminder_type: "confirmation",
      status: "sent",
      delivery_status: "pending",
    });

    res.json({ message: "Confirmation SMS sent" });
  } catch (error) {
    console.error("Send confirmation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get SMS logs
router.get("/logs", authenticateToken, async (req, res) => {
  try {
    const { status, deliveryStatus, startDate, endDate } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (deliveryStatus) filter.delivery_status = deliveryStatus;

    if (startDate || endDate) {
      filter.sent_at = {};
      if (startDate) filter.sent_at.$gte = new Date(startDate);
      if (endDate) filter.sent_at.$lte = new Date(endDate);
    }

    const logs = await SMSLog.find(filter)
      .populate("booking_id")
      .sort({ sent_at: -1 })
      .limit(100);

    res.json({ logs, count: logs.length });
  } catch (error) {
    console.error("Get SMS logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get SMS logs for a specific booking
router.get("/booking/:bookingId", authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const logs = await SMSLog.find({ booking_id: bookingId }).sort({
      sent_at: -1,
    });

    res.json({ logs });
  } catch (error) {
    console.error("Get booking SMS logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Resend failed SMS
router.post("/resend/:smsLogId", async (req, res) => {
  try {
    const { smsLogId } = req.params;

    const log = await SMSLog.findById(smsLogId);
    if (!log) {
      return res.status(404).json({ error: "SMS log not found" });
    }

    const smsResult = await sendSMS(log.recipient_phone, log.message_content);

    if (!smsResult.success) {
      return res.status(500).json({ error: "Failed to resend SMS" });
    }

    // Update log
    log.status = "sent";
    log.delivery_status = "pending";
    await log.save();

    res.json({ message: "SMS resent successfully" });
  } catch (error) {
    console.error("Resend SMS error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Africa's Talking SMS callback (delivery status update)
router.post("/africastalking-callback", async (req, res) => {
  try {
    const { id, status } = req.body;

    // Update SMS log with delivery status
    const deliveryStatus =
      status === "Success"
        ? "delivered"
        : status === "Failed"
          ? "failed"
          : "pending";

    // This is a mock - in production, you'd have the actual transaction ID
    console.log(`SMS Delivery Status: ${id} - ${deliveryStatus}`);

    res.json({ success: true });
  } catch (error) {
    console.error("Africa's Talking callback error:", error);
    res.status(500).json({ error: "Callback processing failed" });
  }
});

export default router;
