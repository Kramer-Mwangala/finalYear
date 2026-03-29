import express from "express";
import { Booking, Image, Prescription, User } from "../config/database.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure user is dermatologist
const requireDermatologist = (req, res, next) => {
  if (req.user?.role !== "dermatologist") {
    return res
      .status(403)
      .json({ error: "Only dermatologists can access this endpoint" });
  }
  next();
};

// GET today's schedule
router.get(
  "/schedule/today",
  authenticateToken,
  requireDermatologist,
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await Booking.find({
        dermatologist_id: userId,
        appointment_date: { $gte: today, $lt: tomorrow },
        status: { $in: ["confirmed", "pending"] },
      })
        .populate("user_id")
        .populate("booking_id")
        .sort({ appointment_date: 1 });

      // Group by urgent and routine
      const urgent = appointments.filter((a) => a.is_urgent_slot);
      const routine = appointments.filter((a) => !a.is_urgent_slot);

      res.json({
        today: new Date().toLocaleDateString(),
        urgent,
        routine,
        summary: {
          urgent_count: urgent.length,
          routine_count: routine.length,
          total: appointments.length,
        },
      });
    } catch (error) {
      console.error("Get today's schedule error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET appointments for a specific date
router.get(
  "/schedule/:date",
  authenticateToken,
  requireDermatologist,
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { date } = req.params;

      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const appointments = await Booking.find({
        dermatologist_id: userId,
        appointment_date: { $gte: startDate, $lt: endDate },
      })
        .populate("user_id")
        .sort({ appointment_date: 1 });

      res.json({ appointments, count: appointments.length });
    } catch (error) {
      console.error("Get schedule error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET patient images for review
router.get(
  "/patient-images/:patientId",
  authenticateToken,
  requireDermatologist,
  async (req, res) => {
    try {
      const { patientId } = req.params;

      const images = await Image.find({ user_id: patientId })
        .sort({ created_at: -1 })
        .lean();

      const transformedImages = images.map((img) => ({
        ...img,
        analysis_result:
          typeof img.analysis_result === "string"
            ? JSON.parse(img.analysis_result)
            : img.analysis_result,
      }));

      res.json({ images: transformedImages });
    } catch (error) {
      console.error("Get patient images error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// POST prescription
router.post(
  "/prescription/create",
  authenticateToken,
  requireDermatologist,
  async (req, res) => {
    try {
      const { bookingId, medicationName, dosage, duration, notes } = req.body;
      const dermatologistId = req.user?.id;

      if (!bookingId || !medicationName || !dosage || !duration) {
        return res
          .status(400)
          .json({ error: "Missing required prescription fields" });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const prescription = await Prescription.create({
        booking_id: bookingId,
        medication_name: medicationName,
        dosage,
        duration,
        notes,
        created_by: dermatologistId,
      });

      res.status(201).json({
        message: "Prescription created successfully",
        prescription,
      });
    } catch (error) {
      console.error("Create prescription error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
