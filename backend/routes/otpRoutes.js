
const express = require("express");

const {
  sendEmailOTP,
  verifyEmailOTP,
} = require("../utils/emailOtp");

const Citizen = require("../models/Citizen");

const router = express.Router();

// ============================================
// SEND EMAIL OTP
// POST /api/otp/send
// ============================================

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // --------------------------------------------
    // CHECK PREVIOUSLY VERIFIED CITIZEN
    // --------------------------------------------

    const existingCitizen = await Citizen.findOne({
      email: normalizedEmail,
      emailVerified: true,
    });

    if (existingCitizen) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        emailVerified: true,
        message:
          "This email is already verified with SWACHHLENS.",
      });
    }

    // --------------------------------------------
    // NEW EMAIL → SEND OTP
    // --------------------------------------------

    await sendEmailOTP(normalizedEmail);

    return res.status(200).json({
      success: true,
      alreadyVerified: false,
      emailVerified: false,
      message: "OTP sent successfully to your email.",
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
});

// ============================================
// VERIFY EMAIL OTP
// POST /api/otp/verify
// ============================================

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOTP = String(otp).trim();

    if (!/^\d{6}$/.test(normalizedOTP)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be exactly 6 digits.",
      });
    }

    // --------------------------------------------
    // VERIFY OTP
    // --------------------------------------------

    const result = verifyEmailOTP(
      normalizedEmail,
      normalizedOTP
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // --------------------------------------------
    // EXISTING CITIZEN
    // --------------------------------------------

    const existingCitizen = await Citizen.findOne({
      email: normalizedEmail,
    });

    if (existingCitizen) {
      existingCitizen.emailVerified = true;

      await existingCitizen.save();

      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        emailVerified: true,
        citizenId: existingCitizen._id,
        message: "Email verified successfully.",
      });
    }

    // --------------------------------------------
    // NEW EMAIL
    // Citizen record will be created later
    // after Citizen Details are submitted.
    // --------------------------------------------

    return res.status(200).json({
      success: true,
      alreadyVerified: false,
      emailVerified: true,
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
});

module.exports = router;
