const mongoose = require("mongoose");

// =========================================================
// SWACHHLENS RESPONSE REQUEST SCHEMA
// =========================================================

const responseRequestSchema =
  new mongoose.Schema(
    {
      // =====================================================
      // ORIGINAL REPORT LINK
      // =====================================================

      reportId: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      // =====================================================
      // CITIZEN LINK
      // =====================================================

      citizenId: {
        type: String,
        trim: true,
        default: "",
      },

      citizenEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      // =====================================================
      // SELECTED ORGANIZATION
      // =====================================================

      organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
      },

      organizationName: {
        type: String,
        required: true,
        trim: true,
      },

      organizationLocation: {
        state: {
          type: String,
          trim: true,
          default: "",
        },

        district: {
          type: String,
          trim: true,
          default: "",
        },

        city: {
          type: String,
          trim: true,
          default: "",
        },
      },

      // =====================================================
      // REPORT SNAPSHOT
      // Keeps the response request tied to the report data
      // at the time of final submission.
      // =====================================================

      reportSnapshot: {
        wasteType: {
          type: String,
          trim: true,
          default: "",
        },

        visibleSeverity: {
          type: String,
          trim: true,
          default: "",
        },

        riskScore: {
          type: Number,
          default: null,
        },

        hazardDetected: {
          type: Boolean,
          default: false,
        },

        roadBlockage: {
          type: Boolean,
          default: false,
        },

        location: {
          state: {
            type: String,
            trim: true,
            default: "",
          },

          district: {
            type: String,
            trim: true,
            default: "",
          },

          city: {
            type: String,
            trim: true,
            default: "",
          },

          locality: {
            type: String,
            trim: true,
            default: "",
          },
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        imageUrl: {
          type: String,
          trim: true,
          default: "",
        },
      },

      // =====================================================
      // USER FEEDBACK
      // =====================================================

      feedback: {
        reason: {
          type: String,
          trim: true,
          default: "",
        },

        additionalFeedback: {
          type: String,
          trim: true,
          default: "",
        },
      },

      // =====================================================
      // APPOINTMENT
      // =====================================================

      appointment: {
        requested: {
          type: Boolean,
          default: false,
        },

        date: {
          type: String,
          trim: true,
          default: "",
        },

        time: {
          type: String,
          trim: true,
          default: "",
        },

        note: {
          type: String,
          trim: true,
          default: "",
        },

        status: {
          type: String,
          enum: [
            "not_requested",
            "pending",
            "accepted",
            "rejected",
            "completed",
          ],
          default: "not_requested",
        },
      },

      // =====================================================
      // REQUEST STATUS
      // =====================================================

      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "sent",
          "accepted",
          "rejected",
          "completed",
        ],
        default: "pending",
        index: true,
      },

      // =====================================================
      // ORGANIZATION COMMUNICATION
      // =====================================================

      organizationNotificationStatus: {
        type: String,
        enum: [
          "pending",
          "sending",
          "sent",
          "failed",
        ],
        default: "pending",
      },

      organizationNotificationSentAt: {
        type: Date,
        default: null,
      },

      organizationNotificationError: {
        type: String,
        trim: true,
        default: "",
      },

      // =====================================================
      // ADMIN NOTES
      // =====================================================

      adminNote: {
        type: String,
        trim: true,
        default: "",
      },

      // =====================================================
      // SUBMISSION TIME
      // =====================================================

      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },

    {
      timestamps: true,
      collection: "responseRequests",
    }
  );


// =========================================================
// MODEL
// =========================================================

const ResponseRequest =
  mongoose.models.ResponseRequest ||
  mongoose.model(
    "ResponseRequest",
    responseRequestSchema
  );

module.exports = ResponseRequest;