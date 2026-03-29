import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AfricasTalking from "africastalking";
import { User } from "../config/database.js";

const router = express.Router();

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send OTP (using Africa's Talking SDK)
async function sendOTPSMS(phoneNumber, otp) {
  try {
    const apiKey = process.env.AT_API_KEY;
    const username = process.env.AT_USERNAME;

    if (!apiKey || !username) {
      console.error("Africa's Talking API credentials missing");
      return false;
    }

    // Initialize Africa's Talking SDK
    const africastalking = AfricasTalking({
      apiKey: apiKey,
      username: username,
    });
    const sms = africastalking.SMS;

    // Sanitize phone number - remove spaces and non-digit characters
    let sanitizedPhone = phoneNumber.replace(/\D/g, "");
    // Convert local Kenya format (0XXXXXXXXX) to international (254XXXXXXXXX)
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "254" + sanitizedPhone.substring(1);
    }

    const message = `Your NSC-AI Assistant verification code is: ${otp}. This code expires in 10 minutes.`;

    const options = {
      to: [`+${sanitizedPhone}`],
      message: message,
      from: process.env.AT_SENDER_ID || "AFTKNG",
    };

    console.log(`[OTP SMS] Sending to: +${sanitizedPhone}, OTP: ${otp}`);

    const result = await sms.send(options);

    // Parse Africa's Talking SDK response format
    const recipients = result?.SMSMessageData?.Recipients || [];

    if (recipients && recipients.length > 0) {
      const recipient = recipients[0];
      console.log(`[OTP SMS SENT] Status Code: 200`, {
        messageId: recipient.messageId,
        cost: recipient.cost,
        status: recipient.status,
        statusCode: recipient.statusCode,
      });
      // Return true if SMS was sent (not blacklisted or rejected)
      return recipient.status === "Success" || recipient.statusCode === 200;
    }

    console.error("[OTP SMS ERROR] No recipients in response");
    return false;
  } catch (error) {
    console.error("Failed to send OTP SMS:", error.message);
    console.error(`[OTP SMS ERROR]`, error);
    return false;
  }
}

// Signup - Generate OTP
router.post("/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role = "patient",
    } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate password (minimum 8 characters, 1 uppercase, 1 number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters with one uppercase letter and one number",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP (not yet verified)
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      role,
      phone_verified: false,
      otp,
      otp_expires: otpExpires,
    });

    // Send OTP via SMS
    const smsSent = await sendOTPSMS(phoneNumber, otp);
    if (!smsSent) {
      return res.status(500).json({ error: "Failed to send verification SMS" });
    }

    res.status(201).json({
      message: "Account created. Verification SMS sent to your phone.",
      email: user.email,
      requiresOTP: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: "Phone number and OTP required" });
    }

    // Sanitize phone number to match format used when storing
    let sanitizedPhone = phoneNumber.replace(/\D/g, "");
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "254" + sanitizedPhone.substring(1);
    }

    const user = await User.findOne({ phone_number: sanitizedPhone });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if OTP is expired
    if (!user.otp_expires || user.otp_expires < new Date()) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please sign up again." });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark phone as verified and clear OTP
    user.phone_verified = true;
    user.otp = undefined;
    user.otp_expires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Phone verified successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
      },
      token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number required" });
    }

    // Sanitize phone number
    let sanitizedPhone = phoneNumber.replace(/\D/g, "");
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "254" + sanitizedPhone.substring(1);
    }

    const user = await User.findOne({ phone_number: sanitizedPhone });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.phone_verified) {
      return res.status(400).json({ error: "Phone already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otp_expires = otpExpires;
    await user.save();

    // Send OTP via SMS
    const smsSent = await sendOTPSMS(user.phone_number || "", otp);
    if (!smsSent) {
      return res.status(500).json({ error: "Failed to send verification SMS" });
    }

    res.json({ message: "Verification SMS resent" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if phone is verified
    if (!user.phone_verified) {
      return res.status(403).json({
        error: "Phone not verified. Please verify your account first.",
        email: user.email,
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify token
router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
