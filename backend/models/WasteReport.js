const mongoose = require("mongoose");

// =========================================================
// WASTE REPORT SCHEMA
// =========================================================

const wasteReportSchema = new mongoose.Schema(
  {
    // =====================================================
    // CITIZEN LINK
    // =====================================================

    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // =====================================================
    // REPORT ID
    // =====================================================

    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // =====================================================
    // CITIZEN SNAPSHOT
    //
    // IMPORTANT:
    // Citizen model ka current data alag rahega.
    // Yahan report submit hone ke time ka exact snapshot
    // save hoga.
    // =====================================================

    citizen: {
      // ---------------------------------------------------
      // CITIZEN ID
      // ---------------------------------------------------

      citizenId: {
        type: String,
        default: "",
        trim: true,
      },

      // ---------------------------------------------------
      // Citizen eligibility
      // ---------------------------------------------------

      isIndianCitizen: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      // ---------------------------------------------------
      // Basic citizen details
      // ---------------------------------------------------

      fullName: {
        type: String,
        default: "",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        lowercase: true,
        trim: true,
      },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      // ---------------------------------------------------
      // Age related fields
      // ---------------------------------------------------

      age: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      ageStatus: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      isAbove18: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      // ---------------------------------------------------
      // Other possible citizen details
      // ---------------------------------------------------

      gender: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      // ---------------------------------------------------
      // Future / additional Citizen Details fields
      // ---------------------------------------------------

      otherDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // CITIZEN LOCATION
    //
    // IMPORTANT:
    // THIS IS CITIZEN PROFILE LOCATION.
    // IT IS COMPLETELY SEPARATE FROM WASTE LOCATION.
    // =====================================================

    citizenLocation: {
      country: {
        type: String,
        default: "India",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      district: {
        type: String,
        default: "",
        trim: true,
      },

      block: {
        type: String,
        default: "",
        trim: true,
      },

      villageLocality: {
        type: String,
        default: "",
        trim: true,
      },

      // ---------------------------------------------------
      // Any additional citizen-location information
      // ---------------------------------------------------

      otherFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // WASTE IMAGE
    // =====================================================

    imageUrl: {
      type: String,
      default: "",
    },

    // -----------------------------------------------------
    // COMPLETE IMAGE INFORMATION
    // -----------------------------------------------------

    image: {
      url: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      filename: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    // =====================================================
    // WASTE INFORMATION
    //
    // EXISTING FIELDS PRESERVED
    // =====================================================

    wasteType: {
      type: String,
      enum: [
        "Mixed Waste",
        "Plastic Waste",
        "Organic Waste",
        "Construction Waste",
        "Electronic Waste",
        "Hazardous Waste",
        "Other",
      ],
      required: true,
      trim: true,
    },

    visibleSeverity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // WASTE OBJECT
    //
    // Keeps a clean structured copy of waste information.
    // Existing top-level fields above are NOT removed.
    // =====================================================

    waste: {
      wasteType: {
        type: String,
        default: "",
      },

      visibleSeverity: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Future waste fields
      // ---------------------------------------------------

      otherDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // WASTE / INCIDENT LOCATION
    //
    // IMPORTANT:
    // THIS IS THE WASTE INCIDENT LOCATION.
    // IT IS NOT THE CITIZEN'S PERSONAL LOCATION.
    //
    // IMPORTANT COMPATIBILITY:
    // Route accepts GPS/reverse-geocoded locations where
    // state/district/locality may not always be available.
    // Therefore these fields are NOT required at schema level.
    // Route itself performs the final location validation.
    // =====================================================

    location: {
      country: {
        type: String,
        default: "India",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      district: {
        type: String,
        default: "",
        trim: true,
      },

      // ===================================================
      // BLOCK
      //
      // IMPORTANT:
      // Block may not be available when the incident
      // location comes from GPS/reverse geocoding.
      //
      // Therefore it is NOT required.
      // Existing field is preserved.
      // ===================================================

      block: {
        type: String,
        default: "",
        trim: true,
      },

      locality: {
        type: String,
        default: "",
        trim: true,
      },

      // ===================================================
      // LOCATION TYPE
      //
      // manual / current
      // ===================================================

      locationType: {
        type: String,
        enum: [
          "manual",
          "current",
          "",
        ],
        default: "",
      },

      // ===================================================
      // GPS COORDINATES
      // ===================================================

      coordinates: {
        latitude: {
          type: Number,
          default: null,
        },

        longitude: {
          type: Number,
          default: null,
        },

        accuracy: {
          type: Number,
          default: null,
        },
      },

      // ===================================================
      // DIRECT ACCURACY
      //
      // Existing backend compatibility
      // ===================================================

      accuracy: {
        type: Number,
        default: null,
      },

      // ===================================================
      // GPS INFORMATION
      // ===================================================

      gpsDetected: {
        type: Boolean,
        default: false,
      },

      gpsPlaceName: {
        type: String,
        default: "",
      },

      gpsDistrict: {
        type: String,
        default: "",
      },

      gpsState: {
        type: String,
        default: "",
      },

      fullAddress: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Future location fields
      // ---------------------------------------------------

      otherFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // WASTE LOCATION ALIAS / STRUCTURED COPY
    //
    // Existing location above remains untouched.
    // This provides the explicit wasteLocation structure.
    // =====================================================

    wasteLocation: {
      country: {
        type: String,
        default: "India",
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      district: {
        type: String,
        default: "",
        trim: true,
      },

      block: {
        type: String,
        default: "",
        trim: true,
      },

      locality: {
        type: String,
        default: "",
        trim: true,
      },

      village: {
        type: String,
        default: "",
        trim: true,
      },

      locationType: {
        type: String,
        enum: [
          "manual",
          "current",
          "",
        ],
        default: "",
      },

      coordinates: {
        latitude: {
          type: Number,
          default: null,
        },

        longitude: {
          type: Number,
          default: null,
        },
      },

      accuracy: {
        type: Number,
        default: null,
      },

      gpsDetected: {
        type: Boolean,
        default: false,
      },

      gpsPlaceName: {
        type: String,
        default: "",
      },

      gpsDistrict: {
        type: String,
        default: "",
      },

      gpsState: {
        type: String,
        default: "",
      },

      fullAddress: {
        type: String,
        default: "",
      },

      otherFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // CITIZEN SITUATION
    // =====================================================

    citizenSituation: {
      nearWasteLocation: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      affectingDailyLife: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      blockingPublicSpace: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      sanitationProblem: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      longTermProblem: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      urgentAttention: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      canProvideInformation: {
        type: String,
        enum: ["Yes", "No", ""],
        default: "",
      },

      // ---------------------------------------------------
      // Future questions
      // ---------------------------------------------------

      additionalAnswers: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // AI-GENERATED INTELLIGENCE
    // =====================================================

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Low",
    },

    // =====================================================
    // AI ANALYSIS
    //
    // EXISTING AI FIELDS PRESERVED
    // =====================================================

    aiAnalysis: {
      // ---------------------------------------------------
      // COMPLETE AI RAW RESPONSE
      // ---------------------------------------------------

      completeResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      // ---------------------------------------------------
      // AI STATUS
      // ---------------------------------------------------

      analysisStatus: {
        type: String,
        default: "Completed",
      },

      analyzedAt: {
        type: Date,
        default: null,
      },

      // ---------------------------------------------------
      // WASTE CLASSIFICATION
      // ---------------------------------------------------

      wasteClassification: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // ESTIMATED QUANTITY
      // ---------------------------------------------------

      estimatedQuantity: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // HAZARD DETECTION
      // ---------------------------------------------------

      hazardDetected: {
        type: Boolean,
        default: false,
      },

      // ---------------------------------------------------
      // ROAD BLOCKAGE
      // ---------------------------------------------------

      roadBlockage: {
        type: Boolean,
        default: false,
      },

      // ---------------------------------------------------
      // PREDICTION
      // ---------------------------------------------------

      prediction: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // RECOMMENDED ACTION
      // ---------------------------------------------------

      recommendedAction: {
        type: String,
        default: "",
      },

      // ===================================================
      // AI IMAGE VERIFICATION
      // ===================================================

      verification: {
        // -------------------------------------------------
        // IS THIS ACTUALLY WASTE?
        // -------------------------------------------------

        isWaste: {
          type: Boolean,
          default: false,
        },

        // -------------------------------------------------
        // AI CONFIDENCE
        // -------------------------------------------------

        confidence: {
          type: Number,
          min: 0,
          max: 1,
          default: 0,
        },

        // -------------------------------------------------
        // AI DETECTED CATEGORY
        // -------------------------------------------------

        category: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI REASON
        // -------------------------------------------------

        reason: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI DETECTED SEVERITY
        // -------------------------------------------------

        visibleSeverity: {
          type: String,
          enum: [
            "Low",
            "Medium",
            "High",
            "Critical",
            "",
          ],
          default: "",
        },

        // -------------------------------------------------
        // AI GENERATED DESCRIPTION
        // -------------------------------------------------

        description: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI QUANTITY
        // -------------------------------------------------

        estimatedQuantity: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI HAZARD
        // -------------------------------------------------

        hazardDetected: {
          type: Boolean,
          default: false,
        },

        // -------------------------------------------------
        // AI ROAD BLOCKAGE
        // -------------------------------------------------

        roadBlockage: {
          type: Boolean,
          default: false,
        },

        // -------------------------------------------------
        // AI PREDICTION
        // -------------------------------------------------

        prediction: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI RECOMMENDED ACTION
        // -------------------------------------------------

        recommendedAction: {
          type: String,
          default: "",
        },

        // -------------------------------------------------
        // AI CALCULATED RISK
        // -------------------------------------------------

        riskScore: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },

        // -------------------------------------------------
        // AI CALCULATED PRIORITY
        // -------------------------------------------------

        priority: {
          type: String,
          enum: [
            "Low",
            "Medium",
            "High",
            "Critical",
            "",
          ],
          default: "",
        },

        // -------------------------------------------------
        // FUTURE AI FIELDS
        // -------------------------------------------------

        additionalAnalysis: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    },

    // =====================================================
    // DECISION SUPPORT
    //
    // Future autonomous-response layer
    // =====================================================

    decisionSupport: {
      // ---------------------------------------------------
      // CURRENT AI DECISION VALUES
      // ---------------------------------------------------

      riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      priority: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
          "Critical",
          "",
        ],
        default: "",
      },

      recommendedAction: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // FUTURE RESPONSE PLANNING
      // ---------------------------------------------------

      recommendedTeam: {
        type: String,
        default: "",
      },

      vehicleRequirement: {
        type: String,
        default: "",
      },

      estimatedResponseTime: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Future decision-support information
      // ---------------------------------------------------

      assignmentStatus: {
        type: String,
        default: "",
      },

      assignedTeamId: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      assignedVehicleId: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      routeRecommendation: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      responseNotes: {
        type: String,
        default: "",
      },

      additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // CLEANUP VERIFICATION
    // =====================================================

    cleanupVerification: {
      // ---------------------------------------------------
      // Verification status
      // ---------------------------------------------------

      status: {
        type: String,
        enum: [
          "",
          "Pending",
          "Required",
          "In Progress",
          "Verified",
          "Failed",
        ],
        default: "",
      },

      // ---------------------------------------------------
      // Before / after evidence
      // ---------------------------------------------------

      beforeImageUrl: {
        type: String,
        default: "",
      },

      afterImageUrl: {
        type: String,
        default: "",
      },

      verificationImageUrl: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Verification result
      // ---------------------------------------------------

      isCleaned: {
        type: Boolean,
        default: false,
      },

      verifiedBy: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },

      verificationNotes: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Future cleanup AI analysis
      // ---------------------------------------------------

      aiVerification: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // RESOLUTION
    // =====================================================

    resolution: {
      // ---------------------------------------------------
      // Final resolution
      // ---------------------------------------------------

      status: {
        type: String,
        enum: [
          "",
          "Pending",
          "Resolved",
          "Partially Resolved",
          "Unresolved",
          "Rejected",
        ],
        default: "",
      },

      resolved: {
        type: Boolean,
        default: false,
      },

      resolvedAt: {
        type: Date,
        default: null,
      },

      resolvedBy: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },

      resolutionDescription: {
        type: String,
        default: "",
      },

      resolutionNotes: {
        type: String,
        default: "",
      },

      // ---------------------------------------------------
      // Future resolution information
      // ---------------------------------------------------

      cleanupSummary: {
        type: String,
        default: "",
      },

      finalAction: {
        type: String,
        default: "",
      },

      additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =====================================================
    // REPORT STATUS
    //
    // EXISTING STATUS PRESERVED
    // =====================================================

    status: {
      type: String,
      enum: [
        "Reported",
        "Analyzing",
        "Assigned",
        "In Progress",
        "Resolved",
        "Verification Failed",
        "Verified",
      ],
      default: "Reported",
    },

    // =====================================================
    // SYSTEM INFORMATION
    // =====================================================

    system: {
      // ---------------------------------------------------
      // Creation / update
      //
      // timestamps:true below will ALSO maintain the
      // standard createdAt / updatedAt fields.
      // ---------------------------------------------------

      createdAt: {
        type: Date,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },

      // ---------------------------------------------------
      // Image upload
      // ---------------------------------------------------

      imageUploadedAt: {
        type: Date,
        default: null,
      },

      // ---------------------------------------------------
      // AI processing
      // ---------------------------------------------------

      aiAnalysisStatus: {
        type: String,
        enum: [
          "",
          "Pending",
          "Processing",
          "Completed",
          "Failed",
        ],
        default: "",
      },

      aiAnalysisStartedAt: {
        type: Date,
        default: null,
      },

      aiAnalysisCompletedAt: {
        type: Date,
        default: null,
      },

      // ---------------------------------------------------
      // Submission
      // ---------------------------------------------------

      submissionStatus: {
        type: String,
        enum: [
          "",
          "Draft",
          "Submitted",
          "Processing",
          "Completed",
          "Failed",
        ],
        default: "Submitted",
      },

      // ---------------------------------------------------
      // Version
      // ---------------------------------------------------

      reportVersion: {
        type: Number,
        default: 1,
      },

      // ---------------------------------------------------
      // Useful system metadata
      // ---------------------------------------------------

      source: {
        type: String,
        default: "SWACHHLENS",
      },

      platform: {
        type: String,
        default: "",
      },

      userAgent: {
        type: String,
        default: "",
      },

      ipAddress: {
        type: String,
        default: "",
      },

      additionalMetadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  },

  // =======================================================
  // AUTOMATIC TIMESTAMPS
  // =======================================================

  {
    timestamps: true,
  }
);

// =========================================================
// INDEXES
// =========================================================

// ---------------------------------------------------------
// Citizen → Reports
// ---------------------------------------------------------

wasteReportSchema.index({
  citizenId: 1,
  createdAt: -1,
});

// ---------------------------------------------------------
// Email → Reports
// ---------------------------------------------------------

wasteReportSchema.index({
  email: 1,
  createdAt: -1,
});

// ---------------------------------------------------------
// Incident Location
// ---------------------------------------------------------

wasteReportSchema.index({
  "location.country": 1,
  "location.state": 1,
  "location.district": 1,
  "location.block": 1,
  "location.locality": 1,
});

// ---------------------------------------------------------
// Explicit Waste Location
// ---------------------------------------------------------

wasteReportSchema.index({
  "wasteLocation.country": 1,
  "wasteLocation.state": 1,
  "wasteLocation.district": 1,
  "wasteLocation.block": 1,
  "wasteLocation.locality": 1,
});

// ---------------------------------------------------------
// Report Status
// ---------------------------------------------------------

wasteReportSchema.index({
  status: 1,
  createdAt: -1,
});

// ---------------------------------------------------------
// Priority
// ---------------------------------------------------------

wasteReportSchema.index({
  priority: 1,
  createdAt: -1,
});

// ---------------------------------------------------------
// AI Waste Classification
// ---------------------------------------------------------

wasteReportSchema.index({
  "aiAnalysis.wasteClassification": 1,
});

// ---------------------------------------------------------
// AI Hazard Detection
// ---------------------------------------------------------

wasteReportSchema.index({
  "aiAnalysis.hazardDetected": 1,
});

// ---------------------------------------------------------
// AI Road Blockage
// ---------------------------------------------------------

wasteReportSchema.index({
  "aiAnalysis.roadBlockage": 1,
});

// ---------------------------------------------------------
// AI Analysis Status
// ---------------------------------------------------------

wasteReportSchema.index({
  "aiAnalysis.analysisStatus": 1,
});

// ---------------------------------------------------------
// Decision Support Priority
// ---------------------------------------------------------

wasteReportSchema.index({
  "decisionSupport.priority": 1,
});

// ---------------------------------------------------------
// Cleanup Verification
// ---------------------------------------------------------

wasteReportSchema.index({
  "cleanupVerification.status": 1,
});

// ---------------------------------------------------------
// Resolution
// ---------------------------------------------------------

wasteReportSchema.index({
  "resolution.status": 1,
});

// ---------------------------------------------------------
// Citizen Location
// ---------------------------------------------------------

wasteReportSchema.index({
  "citizenLocation.country": 1,
  "citizenLocation.state": 1,
  "citizenLocation.district": 1,
});

// =========================================================
// AUTOMATIC CITIZEN ID + REPORT ID GENERATION
//
// FORMAT:
//
// Citizen 1  -> swl001
// Report 1   -> swl0011
// Report 2   -> swl0012
// Report 3   -> swl0013
//
// Citizen 2  -> swl002
// Report 1   -> swl0021
// Report 2   -> swl0022
// =========================================================

wasteReportSchema.pre("validate", async function () {
  try {
    // -----------------------------------------------------
    // Only generate report ID for a NEW report
    // -----------------------------------------------------

    if (!this.isNew || this.reportId) {
      return;
    }

    // -----------------------------------------------------
    // Citizen model
    // -----------------------------------------------------

    const Citizen = mongoose.model("Citizen");

    // -----------------------------------------------------
    // Find citizen using MongoDB citizenId
    // -----------------------------------------------------

    const citizen = await Citizen.findById(
      this.citizenId
    ).select("citizenId email");

    if (!citizen) {
      throw new Error(
        "Citizen not found. Cannot generate reportId."
      );
    }

    // -----------------------------------------------------
    // Citizen custom ID
    //
    // Example:
    // swl001
    // swl002
    // swl003
    // -----------------------------------------------------

    const customCitizenId = String(
      citizen.citizenId || ""
    )
      .trim()
      .toLowerCase();

    if (!customCitizenId) {
      throw new Error(
        "Citizen custom ID is missing. Expected format like swl001."
      );
    }

    // -----------------------------------------------------
    // Validate citizen ID format
    // -----------------------------------------------------

    const citizenMatch =
      customCitizenId.match(/^swl(\d{3})$/);

    if (!citizenMatch) {
      throw new Error(
        `Invalid Citizen ID "${customCitizenId}". Expected format like swl001.`
      );
    }

    const citizenNumber = citizenMatch[1];

    // -----------------------------------------------------
    // Report prefix
    // -----------------------------------------------------

    const reportPrefix =
      `swl${citizenNumber}`;

    // -----------------------------------------------------
    // Find previous reports
    // -----------------------------------------------------

    const previousReports =
      await mongoose
        .model("WasteReport")
        .find({
          reportId: {
            $regex: `^${reportPrefix}\\d+$`,
            $options: "i",
          },
        })
        .select("reportId")
        .lean();

    // -----------------------------------------------------
    // Find highest report sequence
    // -----------------------------------------------------

    let nextReportNumber = 1;

    for (const report of previousReports) {
      const existingReportId = String(
        report.reportId || ""
      ).toLowerCase();

      const suffix =
        existingReportId.slice(
          reportPrefix.length
        );

      const number = Number(suffix);

      if (
        Number.isInteger(number) &&
        number >= nextReportNumber
      ) {
        nextReportNumber =
          number + 1;
      }
    }

    // -----------------------------------------------------
    // Generate final Report ID
    //
    // swl001 + 1 = swl0011
    // swl001 + 2 = swl0012
    //
    // swl002 + 1 = swl0021
    // -----------------------------------------------------

    this.reportId =
      `${reportPrefix}${nextReportNumber}`;

    // -----------------------------------------------------
    // Keep citizen snapshot ID synchronized
    // -----------------------------------------------------

    if (!this.citizen) {
      this.citizen = {};
    }

    this.citizen.citizenId =
      customCitizenId;

    // -----------------------------------------------------
    // Keep email synchronized
    // -----------------------------------------------------

    if (
      !this.email &&
      citizen.email
    ) {
      this.email =
        citizen.email;
    }

    if (
      !this.citizen.email &&
      citizen.email
    ) {
      this.citizen.email =
        citizen.email;
    }

    // IMPORTANT:
    // No next() here.
    // Mongoose 9 async middleware automatically
    // continues when the Promise resolves.

    return;
  } catch (error) {
    // IMPORTANT:
    // No next(error) here.
    // Throwing the error automatically passes it
    // to Mongoose.

    throw error;
  }
});

// =========================================================
// EXPORT
// =========================================================

module.exports =
  mongoose.model(
    "WasteReport",
    wasteReportSchema
  );