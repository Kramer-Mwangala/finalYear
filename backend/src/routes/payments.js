import express from "express";
import { Booking, Transaction, User } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Helper function to initiate M-Pesa STK Push
async function initiateMPesaSTKPush(phoneNumber, amount, accountReference) {
  try {
    console.log(
      `[MOCK M-PESA] STK Push for ${phoneNumber}, Amount: KES ${amount}, Reference: ${accountReference}`,
    );
    return {
      success: true,
      transactionCode: `NSC${Date.now()}`,
    };
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);
    return {
      success: false,
      error: "Failed to initiate payment",
    };
  }
}

// Helper function to verify M-Pesa transaction
async function verifyMPesaTransaction(transactionCode) {
  return { success: true, status: "completed" };
}

// Initiate M-Pesa payment for booking
router.post(
  "/initiate-booking-payment",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookingId, phoneNumber } = req.body;
      const userId = req.user?.id;

      if (!bookingId || !phoneNumber) {
        return res
          .status(400)
          .json({ error: "Booking ID and phone number required" });
      }

      // Verify booking exists and belongs to user
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (booking.user_id.toString() !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to pay for this booking" });
      }

      if (booking.payment_status !== "unpaid") {
        return res
          .status(400)
          .json({ error: "Booking already paid or refunded" });
      }

      // Consultation fee
      const amount = 4000;

      // Create transaction record
      const transaction = await Transaction.create({
        user_id: userId,
        booking_id: bookingId,
        amount,
        transaction_type: "booking",
        payment_method: "m-pesa",
        status: "pending",
      });

      // Initiate STK Push
      const stkResult = await initiateMPesaSTKPush(
        phoneNumber,
        amount,
        `BOOKING${booking._id}`,
      );

      if (!stkResult.success) {
        // Delete transaction if STK failed
        await Transaction.deleteOne({ _id: transaction._id });
        return res
          .status(500)
          .json({ error: "Failed to initiate payment. Try again." });
      }

      // Update transaction with code
      transaction.mpesa_transaction_code = stkResult.transactionCode;
      await transaction.save();

      res.json({
        message: "M-Pesa prompt sent to your phone",
        transactionId: transaction._id,
        transactionCode: stkResult.transactionCode,
        amount,
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Verify and complete payment
router.post("/complete-payment", authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.body;
    const userId = req.user?.id;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID required" });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.user_id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to transaction" });
    }

    // Verify M-Pesa transaction
    const verifyResult = await verifyMPesaTransaction(
      transaction.mpesa_transaction_code || "",
    );

    if (!verifyResult.success) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Update transaction status
    transaction.status = "success";
    await transaction.save();

    // Update booking payment status
    if (transaction.booking_id) {
      await Booking.findByIdAndUpdate(
        transaction.booking_id,
        { payment_status: "paid", status: "confirmed" },
        { new: true },
      );
    }

    res.json({
      message: "Payment successful. Booking confirmed.",
      transaction: transaction,
    });
  } catch (error) {
    console.error("Payment completion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const transactions = await Transaction.find({ user_id: userId })
      .populate("booking_id")
      .sort({ created_at: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error("Payment history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get transaction details
router.get("/:transactionId", authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    const transaction =
      await Transaction.findById(transactionId).populate("booking_id");

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (
      transaction.user_id.toString() !== userId &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to transaction" });
    }

    res.json({ transaction });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// M-Pesa Callback endpoint
router.post("/mpesa-callback", async (req, res) => {
  try {
    const { Body } = req.body;

    if (Body && Body.stkCallback) {
      const { ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

      console.log("M-Pesa Callback:", { ResultCode, ResultDesc });

      if (ResultCode === 0 && CallbackMetadata) {
        // Payment successful
        const amount =
          CallbackMetadata.Item.find((item) => item.Name === "Amount")?.Value ||
          0;
        const transactionCode = CallbackMetadata.Item.find(
          (item) => item.Name === "MpesaReceiptNumber",
        )?.Value;

        console.log(
          `Payment received: KES ${amount}, Receipt: ${transactionCode}`,
        );
      } else {
        console.log("M-Pesa payment failed:", ResultDesc);
      }
    }

    // Acknowledge to M-Pesa
    res.json({});
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(500).json({ error: "Callback processing failed" });
  }
});

export default router;
