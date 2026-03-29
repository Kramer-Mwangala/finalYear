import express from "express";
import {
  Booking,
  Transaction,
  SMSLog,
  User,
  PharmacyOrder,
} from "../config/database.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure user is admin
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// GET dashboard summary
router.get("/summary", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's statistics
    const todaysBookings = await Booking.countDocuments({
      appointment_date: { $gte: today, $lt: tomorrow },
    });

    const todaysRevenue = await Transaction.aggregate([
      {
        $match: {
          created_at: { $gte: today, $lt: tomorrow },
          status: "success",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const totalUsers = await User.countDocuments({ role: "patient" });

    const totalDermatologists = await User.countDocuments({
      role: "dermatologist",
    });

    const smsDeliveryRate = await SMSLog.aggregate([
      {
        $match: {
          created_at: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$delivery_status", "delivered"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      summary: {
        todaysBookings,
        todaysRevenue: todaysRevenue[0]?.total || 0,
        pendingBookings,
        totalUsers,
        totalDermatologists,
        smsDeliveryRate:
          smsDeliveryRate[0]?.total > 0
            ? (
                (smsDeliveryRate[0].delivered / smsDeliveryRate[0].total) *
                100
              ).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all users (admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
      .sort({ created_at: -1 })
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all bookings (admin only)
router.get("/bookings", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("user_id", "first_name last_name email")
      .populate("dermatologist_id", "first_name last_name")
      .sort({ appointment_date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBookings: total,
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET transaction reports
router.get(
  "/transactions",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter = { status: "success" };

      if (startDate) {
        filter.created_at = { $gte: new Date(startDate) };
      }
      if (endDate) {
        if (!filter.created_at) filter.created_at = {};
        filter.created_at.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter)
        .populate("user_id", "first_name last_name email")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Transaction.countDocuments(filter);
      const totalRevenue = await Transaction.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      res.json({
        transactions,
        totalRevenue: totalRevenue[0]?.total || 0,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalTransactions: total,
        },
      });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// PUT deactivate user
router.put(
  "/users/:userId/deactivate",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        { role: "inactive" },
        { new: true },
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deactivated successfully", user });
    } catch (error) {
      console.error("Deactivate user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
