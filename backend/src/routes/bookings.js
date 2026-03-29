import express from "express";
import { Booking, User } from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all bookings for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const bookings = await Booking.find({ user_id: userId })
      .populate("user_id", "first_name last_name email")
      .sort({ appointment_date: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all bookings (admin/dermatologist only)
router.get("/all", verifyToken, async (req, res) => {
  try {
    if (req.user?.role !== "dermatologist" && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const bookings = await Booking.find()
      .populate("user_id", "first_name last_name email phone_number")
      .sort({ appointment_date: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { appointmentDate, notes, dermatologistId } = req.body;

    if (!appointmentDate) {
      return res.status(400).json({ error: "Appointment date is required" });
    }

    const appointmentDateTime = new Date(appointmentDate);

    // Check for double booking: user shouldn't have more than one booking within a 2-hour window
    const twoHoursBefore = new Date(
      appointmentDateTime.getTime() - 2 * 60 * 60 * 1000,
    );
    const twoHoursAfter = new Date(
      appointmentDateTime.getTime() + 2 * 60 * 60 * 1000,
    );

    const existingUserBooking = await Booking.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      appointment_date: {
        $gte: twoHoursBefore,
        $lte: twoHoursAfter,
      },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingUserBooking) {
      return res.status(409).json({
        error:
          "Double booking detected. You already have a booking within 2 hours of this time slot.",
        existingBooking: existingUserBooking,
      });
    }

    // Check for dermatologist availability if dermatologist is specified
    if (dermatologistId) {
      const existingDermatologistBooking = await Booking.findOne({
        dermatologist_id: new mongoose.Types.ObjectId(dermatologistId),
        appointment_date: {
          $gte: twoHoursBefore,
          $lte: twoHoursAfter,
        },
        status: { $in: ["pending", "confirmed"] },
      });

      if (existingDermatologistBooking) {
        return res.status(409).json({
          error:
            "Dermatologist is not available at this time. Please choose another time slot.",
          existingBooking: existingDermatologistBooking,
        });
      }
    }

    // Check for urgent slots (severity 8-10)
    const appointmentDay = new Date(appointmentDateTime);
    appointmentDay.setHours(0, 0, 0, 0);
    const dayStart = new Date(appointmentDay);
    const dayEnd = new Date(appointmentDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const urgentBookings = await Booking.countDocuments({
      severity_score: { $gte: 8 },
      appointment_date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["pending", "confirmed"] },
    });

    let status = "pending";
    if (urgentBookings >= 2) {
      status = "waiting-list";
    }

    const booking = await Booking.create({
      user_id: new mongoose.Types.ObjectId(userId),
      dermatologist_id: dermatologistId
        ? new mongoose.Types.ObjectId(dermatologistId)
        : undefined,
      appointment_date: appointmentDateTime,
      status,
      notes,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update booking status
router.patch("/:bookingId", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, severityScore } = req.body;

    if (req.user?.role !== "dermatologist" && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: status || "pending",
        severity_score: severityScore || null,
      },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get booking by ID
router.get("/:bookingId", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "user_id",
      "first_name last_name email",
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user has permission
    const userIdString =
      booking.user_id instanceof mongoose.Document
        ? booking.user_id._id.toString()
        : booking.user_id.toString();

    if (
      req.user?.id !== userIdString &&
      req.user?.role !== "admin" &&
      req.user?.role !== "dermatologist"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
