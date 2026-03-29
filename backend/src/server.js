import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import { initializeDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import aiRoutes from "./routes/ai.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/payments.js";
import smsRoutes from "./routes/sms.js";
import dermatologistRoutes from "./routes/dermatologist.js";
import pharmacyRoutes from "./routes/pharmacy.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Initialize Clerk middleware
app.use(clerkMiddleware());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/dermatologist", dermatologistRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Database connected successfully`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

export default app;
