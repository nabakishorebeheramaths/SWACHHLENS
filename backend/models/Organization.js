const mongoose = require("mongoose");

// =========================================================
// SWACHHLENS ORGANIZATION SCHEMA
// =========================================================

const organizationSchema =
  new mongoose.Schema(
    {
      organizationName: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        state: {
          type: String,
          required: true,
          trim: true,
        },

        district: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },
      },

      wasteTypes: {
        type: [String],
        default: [],
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      serviceArea: {
        type: [String],
        default: [],
      },

      prioritySupport: {
        type: Boolean,
        default: false,
      },

      active: {
        type: Boolean,
        default: true,
      },

      rating: {
        type: Number,
        default: null,
        min: 0,
        max: 5,
      },
    },

    {
      timestamps: true,
      collection: "organizations",
    }
  );

// =========================================================
// PREVENT MODEL OVERWRITE
// =========================================================

const Organization =
  mongoose.models.Organization ||
  mongoose.model(
    "Organization",
    organizationSchema
  );

module.exports = Organization;