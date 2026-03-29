import express from "express";
import {
  PharmacyOrder,
  Prescription,
  User,
  Transaction,
} from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET patient's prescriptions
router.get("/my-prescriptions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const prescriptions = await Prescription.find()
      .populate({
        path: "booking_id",
        match: { user_id: userId },
      })
      .populate("created_by", "first_name last_name");

    // Filter out prescriptions where booking wasn't found
    const userPrescriptions = prescriptions.filter(
      (p) => p.booking_id !== null,
    );

    res.json({ prescriptions: userPrescriptions });
  } catch (error) {
    console.error("Get my prescriptions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET prescription details
router.get("/:prescriptionId", authenticateToken, async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user?.id;

    const prescription = await Prescription.findById(prescriptionId)
      .populate("booking_id")
      .populate("created_by", "first_name last_name");

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Verify user access
    const booking = prescription.booking_id;
    if (booking.user_id.toString() !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ prescription });
  } catch (error) {
    console.error("Get prescription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create pharmacy order
router.post("/order/create", authenticateToken, async (req, res) => {
  try {
    const { prescriptionId, deliveryMethod, deliveryAddress } = req.body;
    const userId = req.user?.id;

    if (!prescriptionId || !deliveryMethod) {
      return res
        .status(400)
        .json({ error: "Prescription ID and delivery method required" });
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Mock total amount - in production, sum actual medication prices
    const totalAmount = 1500;

    const order = await PharmacyOrder.create({
      user_id: userId,
      prescription_id: prescriptionId,
      delivery_method: deliveryMethod,
      delivery_address: deliveryAddress || "",
      total_amount: totalAmount,
      payment_status: "pending",
      order_status: "received",
    });

    res.status(201).json({
      message: "Pharmacy order created successfully",
      order,
      totalAmount,
    });
  } catch (error) {
    console.error("Create pharmacy order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET user's orders
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const orders = await PharmacyOrder.find({ user_id: userId })
      .populate("prescription_id")
      .sort({ created_at: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
