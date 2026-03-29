import express from "express";
import multer from "multer";
import { Image, Booking } from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Analyze skin image and return severity score (1-10)
router.post(
  "/analyze-image",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Simulate AI analysis - in production, this would call TensorFlow/PyTorch model
      const severityScore = Math.floor(Math.random() * 10) + 1; // Random 1-10 for demo
      const analysisResult = {
        severityScore,
        condition:
          severityScore <= 3
            ? "Mild"
            : severityScore <= 6
              ? "Moderate"
              : "Severe",
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2), // 70-100% confidence
        recommendations: getRecommendations(severityScore),
        timestamp: new Date(),
      };

      // Store image analysis in database
      const image = await Image.create({
        user_id: new mongoose.Types.ObjectId(userId),
        booking_id: bookingId
          ? new mongoose.Types.ObjectId(bookingId)
          : undefined,
        analysis_result: JSON.stringify(analysisResult),
        severity_score: severityScore,
      });

      // Update booking severity if bookingId provided
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          severity_score: severityScore,
        });
      }

      res.status(201).json({
        message: "Image analyzed successfully",
        analysis: analysisResult,
        imageId: image._id,
      });
    } catch (error) {
      console.error("Image analysis error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get all images for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const images = await Image.find({ user_id: userId })
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
    console.error("Get images error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get image by ID
router.get("/:imageId", verifyToken, async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findById(imageId).lean();

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Check permissions
    const userIdString = image.user_id.toString();
    if (
      req.user?.id !== userIdString &&
      req.user?.role !== "admin" &&
      req.user?.role !== "dermatologist"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const analysis_result =
      typeof image.analysis_result === "string"
        ? JSON.parse(image.analysis_result)
        : image.analysis_result;

    res.json({ image: { ...image, analysis_result } });
  } catch (error) {
    console.error("Get image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function getRecommendations(score) {
  if (score <= 2) {
    return [
      "Maintain regular skincare routine",
      "Use sunscreen daily",
      "Stay hydrated",
    ];
  } else if (score <= 4) {
    return [
      "Consider topical treatments",
      "Consult with dermatologist",
      "Avoid harsh products",
    ];
  } else if (score <= 6) {
    return [
      "Schedule dermatology appointment",
      "May require prescription treatment",
      "Avoid sun exposure",
    ];
  } else if (score <= 8) {
    return [
      "Urgent appointment needed",
      "Professional medical treatment recommended",
      "Possible systemic therapy",
    ];
  } else {
    return [
      "Immediate medical attention required",
      "Possible hospital referral",
      "Specialist treatment needed",
    ];
  }
}

export default router;
