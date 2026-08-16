const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema(
  {
    // =====================================================
    // CITIZEN DETAILS
    // =====================================================

    // =====================================================
    // PERMANENT CITIZEN ID
    // Format: swl001, swl002, swl003...
    // =====================================================

    citizenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      match: /^swl\d{3}$/,
    },

    // =====================================================
    // NUMBER OF REPORTS SUBMITTED BY CITIZEN
    // =====================================================

    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // BASIC CITIZEN DETAILS
    // =====================================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // VERIFIED EMAIL
    // =====================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // =====================================================
    // AGE CONFIRMATION
    // ONLY FOR CONFIRMATION — NOT AN ELIGIBILITY CHECK
    // =====================================================

    isAbove18: {
      type: Boolean,
      default: null,
    },

    // =====================================================
    // CITIZEN LOCATION
    // =====================================================

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    stateCode: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    districtCode: {
      type: String,
      default: "",
      trim: true,
    },

    block: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    blockCode: {
      type: String,
      default: "",
      trim: true,
    },

    villageLocality: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    villageCode: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // OPTIONAL COORDINATES
    // =====================================================

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // =====================================================
    // LOCATION STATUS
    // =====================================================

    locationSubmitted: {
      type: Boolean,
      default: false,
      index: true,
    },

    locationSubmittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================
// LOCATION INDEX
// =========================================================

citizenSchema.index({
  country: 1,
  state: 1,
  district: 1,
  block: 1,
  villageLocality: 1,
});

// =========================================================
// EXPORT
// =========================================================

module.exports = mongoose.model("Citizen", citizenSchema);