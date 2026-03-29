import express from "express";
import { User } from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.patch("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        updated_at: new Date(),
      },
      { new: true },
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone_number: updatedUser.phone_number,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const users = await User.find()
      .sort({ created_at: -1 })
      .select("-password")
      .lean();

    const transformedUsers = users.map((user) => ({
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      role: user.role,
      created_at: user.created_at,
    }));

    res.json({ users: transformedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
