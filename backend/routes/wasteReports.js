const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const router = express.Router();

const WasteReport = require("../models/WasteReport");
const Citizen = require("../models/Citizen");

const {
  analyzeWasteImage,
  ALLOWED_WASTE_TYPES,
  ALLOWED_SEVERITIES,
} = require("../services/aiWasteAnalysis");

const {
  sendWasteReportEmail,
} = require("../utils/emailOtp");
// =========================================================
// UPLOAD DIRECTORY
// =========================================================

const uploadDirectory = path.join(
  __dirname,
  "../public/uploads/waste"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname || ""
    );

    const filename =
      `waste-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    ),
    false
  );
};

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =========================================================
// HELPER - DELETE FILE
// =========================================================

const deleteFile = (filePath) => {
  try {
    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "File deletion error:",
      error.message
    );
  }
};

// =========================================================
// HELPER - PARSE JSON
// Handles:
// object
// JSON string
// array containing JSON strings
// array containing objects
// =========================================================

const parseJSON = (value, fallback = null) => {
  try {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    // Already object
    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    // Array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return fallback;
      }

      for (const item of value) {
        const parsed = parseJSON(
          item,
          null
        );

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          return parsed;
        }
      }

      return fallback;
    }

    // String
    if (typeof value === "string") {
      const parsed = JSON.parse(value);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed;
      }

      if (Array.isArray(parsed)) {
        return parseJSON(
          parsed,
          fallback
        );
      }
    }

    return fallback;
  } catch (error) {
    console.error(
      "JSON PARSE ERROR:",
      error.message
    );

    return fallback;
  }
};

// =========================================================
// HELPER - NORMALIZE EMAIL
// =========================================================

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

// =========================================================
// HELPER - GET / CREATE CITIZEN CUSTOM ID
//
// First citizen  -> swl001
// Second citizen -> swl002
// Third citizen  -> swl003
//
// Existing citizen NEVER receives a new ID.
// =========================================================

const getOrCreateCitizenId = async (citizen) => {
  const existingCitizenId = String(
    citizen?.citizenId || ""
  )
    .trim()
    .toLowerCase();

  // Existing valid custom ID
  if (
    /^swl\d+$/.test(
      existingCitizenId
    )
  ) {
    return existingCitizenId;
  }

  // Find all existing custom IDs
  const citizens =
    await Citizen.find(
      {
        citizenId: {
          $regex: /^swl\d+$/i,
        },
      },
      {
        citizenId: 1,
      }
    ).lean();

  let highestNumber = 0;

  for (const item of citizens) {
    const match = String(
      item?.citizenId || ""
    )
      .trim()
      .toLowerCase()
      .match(/^swl(\d+)$/);

    if (!match) {
      continue;
    }

    const number = Number(
      match[1]
    );

    if (
      Number.isFinite(number) &&
      number > highestNumber
    ) {
      highestNumber = number;
    }
  }

  let nextNumber =
    highestNumber + 1;

  let generatedCitizenId =
    `swl${String(
      nextNumber
    ).padStart(3, "0")}`;

  // Safety check
  while (
    await Citizen.exists({
      citizenId:
        generatedCitizenId,
    })
  ) {
    nextNumber++;

    generatedCitizenId =
      `swl${String(
        nextNumber
      ).padStart(3, "0")}`;
  }

  citizen.citizenId =
    generatedCitizenId;

  await citizen.save();

  console.log(
    "†” NEW CITIZEN ID GENERATED:",
    generatedCitizenId
  );

  return generatedCitizenId;
};

// =========================================================
// HELPER - GET NEXT REPORT SEQUENCE
//
// Citizen swl001:
// report 1 -> swl0011
// report 2 -> swl0012
// report 3 -> swl0013
//
// This does NOT rely only on reportCount.
// =========================================================

const getNextReportSequence = async (
  citizenObjectId,
  citizenCustomId
) => {
  const reports =
    await WasteReport.find(
      {
        citizenId:
          citizenObjectId,
      },
      {
        reportId: 1,
      }
    ).lean();

  let highestSequence = 0;

  const prefix = String(
    citizenCustomId || ""
  )
    .trim()
    .toLowerCase();

  for (const report of reports) {
    const existingReportId =
      String(
        report?.reportId || ""
      )
        .trim()
        .toLowerCase();

    if (
      !existingReportId ||
      !prefix ||
      !existingReportId.startsWith(
        prefix
      )
    ) {
      continue;
    }

    const suffix =
      existingReportId.slice(
        prefix.length
      );

    if (!/^\d+$/.test(suffix)) {
      continue;
    }

    const sequence =
      Number(suffix);

    if (
      Number.isFinite(sequence) &&
      sequence > highestSequence
    ) {
      highestSequence =
        sequence;
    }
  }

  return highestSequence + 1;
};

// =========================================================
// HELPER - CREATE UNIQUE REPORT ID
// =========================================================

const createUniqueReportId = async (
  citizenObjectId,
  citizenCustomId
) => {
  let sequence =
    await getNextReportSequence(
      citizenObjectId,
      citizenCustomId
    );

  let reportId =
    `${citizenCustomId}${sequence}`;

  while (
    await WasteReport.exists({
      reportId,
    })
  ) {
    sequence++;

    reportId =
      `${citizenCustomId}${sequence}`;
  }

  return reportId;
};

// =========================================================
// AI IMAGE ANALYZE ONLY
// POST /api/waste-reports/analyze-image
// =========================================================

router.post(
  "/analyze-image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload an image.",
        });
      }

      console.log(
        "[AI] AI IMAGE ANALYZE ENDPOINT HIT"
      );

      const aiResult =
        await analyzeWasteImage({
          buffer: fs.readFileSync(
            req.file.path
          ),

          mimeType:
            req.file.mimetype,
        });

      // This endpoint does not permanently save
      // the uploaded analysis image.
      deleteFile(
        req.file.path
      );

      // =====================================================
      // INVALID IMAGE
      // =====================================================

      if (!aiResult?.validImage) {
        return res.json({
          success: true,

          validImage: false,

          wasteDetected: false,
          isWasteImage: false,
          isWaste: false,

          wasteType: "",
          detectedWasteType: "",

          category:
            "Not Waste",

          visibleSeverity: "",
          severity: "",

          confidence:
            aiResult?.confidence ?? 0,

          description: "",

          reason:
            aiResult?.reason || "",

          estimatedQuantity: "",

          hazardDetected: false,
          roadBlockage: false,

          prediction: "",

          recommendedAction: "",

          riskScore: 0,

          priority: "Low",

          message:
            aiResult?.reason ||
            "The uploaded image is not a valid waste image.",

          aiAnalysis: {
            ...aiResult,

            validImage: false,
            isWaste: false,
            wasteDetected: false,
            isWasteImage: false,
          },
        });
      }

      // =====================================================
      // VALID IMAGE
      // =====================================================

      return res.json({
        success: true,

        validImage: true,

        wasteDetected:
          Boolean(
            aiResult?.isWaste
          ),

        isWasteImage:
          Boolean(
            aiResult?.isWaste
          ),

        isWaste:
          Boolean(
            aiResult?.isWaste
          ),

        wasteType:
          aiResult?.wasteType || "",

        detectedWasteType:
          aiResult?.wasteType || "",

        category:
          aiResult?.category || "",

        visibleSeverity:
          aiResult?.visibleSeverity || "",

        severity:
          aiResult?.severity ||
          aiResult?.visibleSeverity ||
          "",

        confidence:
          aiResult?.confidence ?? 0,

        description:
          aiResult?.description || "",

        reason:
          aiResult?.reason || "",

        estimatedQuantity:
          aiResult?.estimatedQuantity || "",

        hazardDetected:
          Boolean(
            aiResult?.hazardDetected
          ),

        roadBlockage:
          Boolean(
            aiResult?.roadBlockage
          ),

        prediction:
          aiResult?.prediction || "",

        recommendedAction:
          aiResult?.recommendedAction || "",

        riskScore:
          aiResult?.riskScore ?? 0,

        priority:
          aiResult?.priority || "Low",

        message:
          aiResult?.message || "",

        aiAnalysis:
          aiResult,
      });
    } catch (error) {
      console.error(
        "Analyze Image Endpoint Error:",
        error
      );

      deleteFile(
        req.file?.path
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to analyze image.",
      });
    }
  }
);

// =========================================================
// CREATE WASTE REPORT
// POST /api/waste-reports
// =========================================================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(
        "========================================"
      );

      console.log(
        "[AI] CREATE WASTE REPORT ROUTE HIT"
      );

      console.log(
        "[BODY] RAW BACKEND BODY:",
        req.body
      );

      // =====================================================
      // BASIC DATA
      // =====================================================

      const {
        wasteType,
        visibleSeverity,
        description,
      } = req.body;

      // =====================================================
      // CITIZEN
      // =====================================================

      const citizen =
        parseJSON(
          req.body.citizen,
          null
        );

      // =====================================================
      // LOCATION
      // =====================================================

      let location =
        parseJSON(
          req.body.location,
          null
        );

      if (!location) {
        location =
          parseJSON(
            req.body.wasteLocation,
            null
          );
      }

      // =====================================================
      // CITIZEN SITUATION
      // =====================================================

      const citizenSituation =
        parseJSON(
          req.body.citizenSituation,
          null
        );

      console.log(
        "[USER] PARSED CITIZEN:",
        citizen
      );

      console.log(
        "“ PARSED LOCATION:",
        location
      );

      console.log(
        "CITIZEN SITUATION:",
        citizenSituation
      );

      // =====================================================
      // EMAIL
      // =====================================================

     const email =
  normalizeEmail(
    req.body.email
  );

      if (!email) {
        deleteFile(
          req.file?.path
        );

        return res.status(400).json({
          success: false,

          message:
            "Verified citizen email is required.",
        });
      }

      // =====================================================
      // VERIFIED CITIZEN
      // =====================================================

      const verifiedCitizen =
        await Citizen.findOne({
          email,
          emailVerified: true,
        });

      if (!verifiedCitizen) {
        deleteFile(
          req.file?.path
        );

        return res.status(403).json({
          success: false,

          message:
            "Verified citizen account not found. Please verify your email first.",
        });
      }

      // =====================================================
      // CITIZEN ID
      // =====================================================

      const citizenCustomId =
        await getOrCreateCitizenId(
          verifiedCitizen
        );

      console.log(
        "[USER] FINAL CITIZEN ID:",
        citizenCustomId
      );

      // =====================================================
      // IMAGE
      // =====================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,

          message:
            "Please upload a real photo of the waste location.",
        });
      }

      // =====================================================
      // AI VERIFICATION
      // =====================================================

      console.log(
        "Starting AI verification..."
      );

      const imageBuffer =
        fs.readFileSync(
          req.file.path
        );

      const aiResult =
        await analyzeWasteImage({
          buffer: imageBuffer,

          mimeType:
            req.file.mimetype,
        });

      console.log(
        "AI RESULT:",
        aiResult
      );

      // =====================================================
      // INVALID / NON-WASTE IMAGE
      // =====================================================

      if (
        !aiResult?.validImage ||
        !aiResult?.isWaste
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "The uploaded image does not appear to show a real waste situation. Please upload a clear photo of the waste location.",

          aiVerification:
            aiResult,
        });
      }

      // =====================================================
      // CONFIDENCE
      // =====================================================

      const aiConfidence =
        Number(
          aiResult?.confidence ?? 0
        );

      if (
        !Number.isFinite(
          aiConfidence
        ) ||
        aiConfidence < 0.60
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "The AI could not confidently verify the waste image. Please upload a clearer photo.",

          aiVerification:
            aiResult,
        });
      }

      // =====================================================
      // WASTE TYPE
      // =====================================================

      if (
        !ALLOWED_WASTE_TYPES.includes(
          wasteType
        )
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "Please select a valid waste type.",

          aiSuggestion:
            aiResult?.wasteType || "",
        });
      }

      // =====================================================
      // SEVERITY
      // =====================================================

      if (
        !ALLOWED_SEVERITIES.includes(
          visibleSeverity
        )
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "Invalid visible severity.",

          aiSuggestion:
            aiResult?.visibleSeverity || "",
        });
      }

      // =====================================================
      // LOCATION
      // =====================================================

      if (
        !location ||
        typeof location !== "object" ||
        Array.isArray(location)
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "Waste location is required.",
        });
      }

      // =====================================================
      // LOCATION DATA
      // =====================================================

      const {
        country,
        state,
        district,
        block,
        locality,
        village,
        locationType,
        coordinates,
        accuracy,
        gpsDetected,
        gpsPlaceName,
        gpsDistrict,
        gpsState,
        fullAddress,
      } = location;

      // =====================================================
      // FINAL LOCATION
      // =====================================================

      const finalCountry =
        String(
          country || "India"
        ).trim();

      const finalState =
        String(
          state ||
          gpsState ||
          ""
        ).trim();

      const finalDistrict =
        String(
          district ||
          gpsDistrict ||
          ""
        ).trim();

      const finalBlock =
        String(
          block || ""
        ).trim();

      const finalLocality =
        String(
          locality ||
          village ||
          gpsPlaceName ||
          fullAddress ||
          ""
        ).trim();

      const finalFullAddress =
        String(
          fullAddress ||
          gpsPlaceName ||
          ""
        ).trim();

      const finalLatitude =
        coordinates?.latitude ??
        null;

      const finalLongitude =
        coordinates?.longitude ??
        null;

      const finalAccuracy =
        coordinates?.accuracy ??
        accuracy ??
        null;

      const hasGPSCoordinates =
        finalLatitude !== null &&
        finalLongitude !== null;

      const hasLocationData =
        Boolean(
          finalState ||
          finalDistrict ||
          finalBlock ||
          finalLocality ||
          finalFullAddress ||
          hasGPSCoordinates
        );

      if (!hasLocationData) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          success: false,

          message:
            "Waste location could not be detected. Please enable GPS or provide the location manually.",
        });
      }

      console.log(
        "“ FINAL WASTE LOCATION:",
        {
          country:
            finalCountry,

          state:
            finalState,

          district:
            finalDistrict,

          block:
            finalBlock,

          locality:
            finalLocality,

          latitude:
            finalLatitude,

          longitude:
            finalLongitude,

          accuracy:
            finalAccuracy,

          gpsDetected:
            Boolean(
              gpsDetected
            ),

          gpsPlaceName:
            gpsPlaceName || "",

          gpsDistrict:
            gpsDistrict || "",

          gpsState:
            gpsState || "",

          fullAddress:
            finalFullAddress,
        }
      );

      // =====================================================
      // CITIZEN SITUATION VALIDATION
      // =====================================================

      const requiredSituationFields = [
        "nearWasteLocation",
        "affectingDailyLife",
        "blockingPublicSpace",
        "sanitationProblem",
        "longTermProblem",
        "urgentAttention",
        "canProvideInformation",
      ];

      for (
        const field of
          requiredSituationFields
      ) {
        if (
          !citizenSituation ||
          !["Yes", "No"].includes(
            citizenSituation[field]
          )
        ) {
          deleteFile(
            req.file.path
          );

          return res.status(400).json({
            success: false,

            message:
              "Please answer all Citizen Situation questions.",
          });
        }
      }

      // =====================================================
      // REPORT ID
      // =====================================================

      const reportId =
        await createUniqueReportId(
          verifiedCitizen._id,
          citizenCustomId
        );

      console.log(
        "†” GENERATED CITIZEN ID:",
        citizenCustomId
      );

      console.log(
        "†” GENERATED REPORT ID:",
        reportId
      );

      // =====================================================
      // IMAGE URL
      // =====================================================

      const imageUrl =
        `/uploads/waste/${req.file.filename}`;

      // =====================================================
      // DESCRIPTION
      // =====================================================

      const finalDescription =
        String(
          description ||
          aiResult?.description ||
          ""
        ).trim();

      // =====================================================
      // RISK SCORE
      // =====================================================

      let finalRiskScore =
        Number(
          aiResult?.riskScore ?? 0
        );

      if (
        !Number.isFinite(
          finalRiskScore
        )
      ) {
        finalRiskScore = 0;
      }

      const situationYesCount =
        requiredSituationFields.filter(
          (field) =>
            citizenSituation[field] ===
            "Yes"
        ).length;

      finalRiskScore =
        Math.min(
          100,
          Math.max(
            0,
            finalRiskScore +
              situationYesCount * 3
          )
        );

      // =====================================================
      // PRIORITY
      // =====================================================

      let finalPriority = "Low";

      if (
        finalRiskScore >= 75
      ) {
        finalPriority =
          "Critical";
      } else if (
        finalRiskScore >= 50
      ) {
        finalPriority =
          "High";
      } else if (
        finalRiskScore >= 25
      ) {
        finalPriority =
          "Medium";
      }

      // Manual severity protection
      const severityRank = {
        Low: 1,
        Medium: 2,
        High: 3,
        Critical: 4,
      };

      if (
        severityRank[visibleSeverity] >
        severityRank[finalPriority]
      ) {
        finalPriority =
          visibleSeverity;
      }

      // =====================================================
      // CREATE REPORT
      // =====================================================

      const report =
        await WasteReport.create({

          // =================================================
          // CITIZEN IDENTITY
          // =================================================

          citizenId:
            verifiedCitizen._id,

          email,

          // =================================================
          // CITIZEN SNAPSHOT
          // =================================================

          citizen: {
            citizenId:
              citizenCustomId,

            isIndianCitizen:
              verifiedCitizen.isIndianCitizen ??
              null,

            fullName:
              verifiedCitizen.fullName ||
              "",

            email:
              verifiedCitizen.email ||
              email,

            emailVerified:
              Boolean(
                verifiedCitizen.emailVerified
              ),

            age:
              verifiedCitizen.age ??
              null,

            ageStatus:
              verifiedCitizen.ageStatus ??
              null,

            isAbove18:
              verifiedCitizen.isAbove18 ??
              null,

            gender:
              verifiedCitizen.gender ||
              "",

            phone:
              verifiedCitizen.phone ||
              "",

            otherDetails: {},
          },

          // =================================================
          // CITIZEN PROFILE LOCATION
          // =================================================

          citizenLocation: {
            country:
              verifiedCitizen.country ||
              "India",

            state:
              verifiedCitizen.state ||
              "",

            district:
              verifiedCitizen.district ||
              "",

            block:
              verifiedCitizen.block ||
              "",

            villageLocality:
              verifiedCitizen.villageLocality ||
              "",

            otherFields: {},
          },

          // =================================================
          // REPORT ID
          // =================================================

          reportId,

          // =================================================
          // IMAGE
          // =================================================

          imageUrl,

          image: {
            url:
              imageUrl,

            originalName:
              req.file.originalname ||
              "",

            filename:
              req.file.filename ||
              "",

            mimeType:
              req.file.mimetype ||
              "",

            size:
              req.file.size ||
              0,

            uploadedAt:
              new Date(),
          },

          // =================================================
          // WASTE BASIC
          // =================================================

          wasteType,

          visibleSeverity,

          // =================================================
          // WASTE DETAILS
          // =================================================

          waste: {
            wasteType,

            visibleSeverity,

            description:
              finalDescription,

            otherDetails: {
              estimatedQuantity:
                aiResult?.estimatedQuantity ||
                "",

              hazardDetected:
                Boolean(
                  aiResult?.hazardDetected
                ),

              roadBlockage:
                Boolean(
                  aiResult?.roadBlockage
                ),
            },
          },

          // =================================================
          // INCIDENT LOCATION
          // =================================================

          location: {
            country:
              finalCountry,

            state:
              finalState,

            district:
              finalDistrict,

            block:
              finalBlock,

            locality:
              finalLocality,

            locationType:
              String(
                locationType || ""
              ).trim(),

            coordinates: {
              latitude:
                finalLatitude,

              longitude:
                finalLongitude,

              accuracy:
                finalAccuracy,
            },

            accuracy:
              finalAccuracy,

            gpsDetected:
              Boolean(
                gpsDetected
              ),

            gpsPlaceName:
              String(
                gpsPlaceName || ""
              ).trim(),

            gpsDistrict:
              String(
                gpsDistrict || ""
              ).trim(),

            gpsState:
              String(
                gpsState || ""
              ).trim(),

            fullAddress:
              finalFullAddress,

            otherFields: {},
          },

          // =================================================
          // WASTE LOCATION
          // =================================================

          wasteLocation: {
            country:
              finalCountry,

            state:
              finalState,

            district:
              finalDistrict,

            block:
              finalBlock,

            locality:
              finalLocality,

            village:
              String(
                village || ""
              ).trim(),

            locationType:
              String(
                locationType || ""
              ).trim(),

            coordinates: {
              latitude:
                finalLatitude,

              longitude:
                finalLongitude,
            },

            accuracy:
              finalAccuracy,

            gpsDetected:
              Boolean(
                gpsDetected
              ),

            gpsPlaceName:
              String(
                gpsPlaceName || ""
              ).trim(),

            gpsDistrict:
              String(
                gpsDistrict || ""
              ).trim(),

            gpsState:
              String(
                gpsState || ""
              ).trim(),

            fullAddress:
              finalFullAddress,

            otherFields: {},
          },

          // =================================================
          // DESCRIPTION
          // =================================================

          description:
            finalDescription,

          // =================================================
          // CITIZEN SITUATION
          // =================================================

          citizenSituation: {
            nearWasteLocation:
              citizenSituation.nearWasteLocation,

            affectingDailyLife:
              citizenSituation.affectingDailyLife,

            blockingPublicSpace:
              citizenSituation.blockingPublicSpace,

            sanitationProblem:
              citizenSituation.sanitationProblem,

            longTermProblem:
              citizenSituation.longTermProblem,

            urgentAttention:
              citizenSituation.urgentAttention,

            canProvideInformation:
              citizenSituation.canProvideInformation,
          },

          // =================================================
          // DECISION SUPPORT
          // =================================================

          riskScore:
            finalRiskScore,

          priority:
            finalPriority,

          // =================================================
          // COMPLETE AI ANALYSIS
          // =================================================

          aiAnalysis: {
            analysisStatus:
              "Completed",

            analyzedAt:
              new Date(),

            completeResponse:
              aiResult,

            wasteClassification:
              aiResult?.wasteType ||
              "",

            estimatedQuantity:
              aiResult?.estimatedQuantity ||
              "",

            hazardDetected:
              Boolean(
                aiResult?.hazardDetected
              ),

            roadBlockage:
              Boolean(
                aiResult?.roadBlockage
              ),

            prediction:
              aiResult?.prediction ||
              "",

            recommendedAction:
              aiResult?.recommendedAction ||
              "",

            verification: {
              isWaste:
                Boolean(
                  aiResult?.isWaste
                ),

              confidence:
                aiResult?.confidence ??
                0,

              category:
                aiResult?.category ||
                "",

              reason:
                aiResult?.reason ||
                "",

              visibleSeverity:
                aiResult?.visibleSeverity ||
                "",

              description:
                aiResult?.description ||
                "",

              estimatedQuantity:
                aiResult?.estimatedQuantity ||
                "",

              hazardDetected:
                Boolean(
                  aiResult?.hazardDetected
                ),

              roadBlockage:
                Boolean(
                  aiResult?.roadBlockage
                ),

              prediction:
                aiResult?.prediction ||
                "",

              recommendedAction:
                aiResult?.recommendedAction ||
                "",

              riskScore:
                aiResult?.riskScore ??
                0,

              priority:
                aiResult?.priority ||
                "",

              additionalAnalysis: {},
            },
          },

          // =================================================
          // STATUS
          // =================================================

          status:
            "Reported",
        });

      // =====================================================
// UPDATE CITIZEN REPORT COUNT
// =====================================================

await Citizen.findByIdAndUpdate(
  verifiedCitizen._id,
  {
    $inc: {
      reportCount: 1,
    },
  }
);

// =====================================================
// SEND WASTE REPORT CONFIRMATION EMAIL
// =====================================================

let emailResult = {
  success: false,
  message: "Email was not sent.",
};

try {
  emailResult =
    await sendWasteReportEmail({
      email,

      citizenName:
        verifiedCitizen.fullName ||
        citizen?.fullName ||
        "Citizen",

      reportId:
        report.reportId,

imagePath: req.file.path,

      wasteType:
        report.wasteType,

      category:
        report.aiAnalysis?.verification?.category ||
        report.aiAnalysis?.completeResponse?.category ||
        "Not available",

      visibleSeverity:
        report.visibleSeverity,

      estimatedQuantity:
        report.aiAnalysis?.estimatedQuantity ||
        report.waste?.otherDetails?.estimatedQuantity ||
        "Not available",

      hazardDetected:
        Boolean(
          report.aiAnalysis?.hazardDetected ??
          report.waste?.otherDetails?.hazardDetected
        ),

      roadBlockage:
        Boolean(
          report.aiAnalysis?.roadBlockage ??
          report.waste?.otherDetails?.roadBlockage
        ),

      riskScore:
        report.riskScore,

      priority:
        report.priority,

      recommendedAction:
        report.aiAnalysis?.recommendedAction ||
        report.aiAnalysis?.verification?.recommendedAction ||
        "Our response team will assess the situation.",

      description:
        report.description,

      wasteLocation:
        [
          report.wasteLocation?.country,
          report.wasteLocation?.state,
          report.wasteLocation?.district,
          report.wasteLocation?.block,
          report.wasteLocation?.locality,
        ]
          .filter(Boolean)
          .join(", "),

      reportDate:
        report.createdAt
          ? new Date(
              report.createdAt
            ).toLocaleString("en-IN")
          : new Date().toLocaleString("en-IN"),

      trackingUrl:
        process.env.FRONTEND_URL
          ? `${process.env.FRONTEND_URL}/report-analysis-status?reportId=${encodeURIComponent(
              report.reportId
            )}`
          : "",
    });

  if (emailResult.success) {
    console.log(
      `REPORT CONFIRMATION EMAIL SENT: ${email}`
    );
  } else {
    console.error(
      `  REPORT CREATED BUT EMAIL FAILED: ${emailResult.message}`
    );
  }
} catch (emailError) {
  // IMPORTANT:
  // Email failure must NOT delete/fail the already-created report.

  console.error(
    "  REPORT EMAIL ERROR:",
    emailError.message
  );

  emailResult = {
    success: false,
    message:
      emailError.message ||
      "Failed to send report confirmation email.",
  };
}


      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "========================================"
      );

      console.log(
        "… WASTE REPORT CREATED"
      );

      console.log(
        "[USER] CITIZEN ID:",
        citizenCustomId
      );

      console.log(
        "“„ REPORT ID:",
        report.reportId
      );

      console.log(
        "========================================"
      );

      return res.status(201).json({
        success: true,

        message:
          "Waste report created successfully.",

        citizenId:
          citizenCustomId,

        reportId:
          report.reportId,
          emailSent:
    Boolean(emailResult?.success),

  emailMessageId:
    emailResult?.messageId || null,

        report: {
          id:
            report._id,

          reportId:
            report.reportId,

          citizenId:
            report.citizenId,

          citizenCustomId:
            citizenCustomId,

          email:
            report.email,

        imageUrl:
  report.imageUrl
    ? `${process.env.BACKEND_URL || `http://localhost:${PORT}`}${report.imageUrl}`
    : "",

          wasteType:
            report.wasteType,

          visibleSeverity:
            report.visibleSeverity,

          location:
            report.location,

          wasteLocation:
            report.wasteLocation,

          citizenLocation:
            report.citizenLocation,

          description:
            report.description,

          citizenSituation:
            report.citizenSituation,

          riskScore:
            report.riskScore,

          priority:
            report.priority,

          aiAnalysis:
            report.aiAnalysis,

          status:
            report.status,

          createdAt:
            report.createdAt,

          updatedAt:
            report.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        "========================================"
      );

      console.error(
        "CREATE WASTE REPORT ERROR:"
      );

      console.error(
        error
      );

      console.error(
        "========================================"
      );

      deleteFile(
        req.file?.path
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to create waste report.",
      });
    }
  }
);
// =========================================================
// PUBLIC LIVE REPORT OVERVIEW
// =========================================================

router.get("/public-overview", async (req, res) => {
  try {
    // =====================================================
    // TOTAL REPORTS
    // =====================================================

    const totalReports =
      await WasteReport.countDocuments();

const wasteTypeStats =
  await WasteReport.aggregate([
    {
      $group: {
        _id: "$wasteType",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  const wasteTypeDistribution =
  wasteTypeStats.map((item) => ({
    wasteType:
      item._id || "Other",

    count:
      item.count,

    percentage:
      totalReports > 0
        ? Number(
            (
              (item.count /
                totalReports) *
              100
            ).toFixed(1)
          )
        : 0,
  }));
    // =====================================================
    // REPORTS RECEIVED / ACTIVE REPORTS
    //
    // Reported
    // Analyzing
    // Assigned
    // In Progress
    // Verification Failed
    // =====================================================

    const pendingReports =
      await WasteReport.countDocuments({
        status: {
          $in: [
            "Reported",
            "Analyzing",
            "Assigned",
            "In Progress",
            "Verification Failed",
          ],
        },
      });


    // =====================================================
    // RESOLVED REPORTS
    //
    // Resolved + Verified
    // =====================================================

    const resolvedReports =
      await WasteReport.countDocuments({
        status: {
          $in: [
            "Resolved",
            "Verified",
          ],
        },
      });


    // =====================================================
// TODAY'S REPORTS
// INDIA / IST
// =====================================================

const now = new Date();

// Get current date/time directly in IST
const istDateParts =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(now);

const istYear =
  Number(
    istDateParts.find(
      (part) => part.type === "year"
    )?.value
  );

const istMonth =
  Number(
    istDateParts.find(
      (part) => part.type === "month"
    )?.value
  );

const istDay =
  Number(
    istDateParts.find(
      (part) => part.type === "day"
    )?.value
  );

// -----------------------------------------------------
// Build IST day boundaries explicitly
// India = UTC+05:30
// -----------------------------------------------------

const todayStartUTC =
  new Date(
    Date.UTC(
      istYear,
      istMonth - 1,
      istDay,
      -5,
      -30,
      0,
      0
    )
  );

const todayEndUTC =
  new Date(
    Date.UTC(
      istYear,
      istMonth - 1,
      istDay + 1,
      -5,
      -30,
      0,
      0
    ) - 1
  );

// -----------------------------------------------------
// COUNT TODAY'S REPORTS
// -----------------------------------------------------

const todayReports =
  await WasteReport.countDocuments({
    createdAt: {
      $gte: todayStartUTC,
      $lte: todayEndUTC,
    },
  });

console.log(
  "“… IST TODAY REPORT COUNT:",
  todayReports
);

console.log(
  "• IST DAY START UTC:",
  todayStartUTC
);

console.log(
  "• IST DAY END UTC:",
  todayEndUTC
);
    // =====================================================
    // RECENT REPORTS
    // =====================================================

    const recentDocs =
      await WasteReport.find({})
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .select(
          [
            "_id",
            "reportId",
            "status",
            "createdAt",
            "wasteType",
            "visibleSeverity",
            "location",
            "wasteLocation",
          ].join(" ")
        )
        .lean();


    // =====================================================
    // FORMAT RECENT REPORTS
    // =====================================================

    const recentReports =
      recentDocs.map((report) => {
        const location =
          report.location || {};

        const wasteLocation =
          report.wasteLocation || {};

        return {
          _id: report._id,
          reportId: report.reportId,
          status: report.status,
          createdAt: report.createdAt,

          wasteType:
            report.wasteType || "",

          visibleSeverity:
            report.visibleSeverity || "",

          locationName:
            location.locality ||
            location.district ||
            location.state ||
            wasteLocation.locality ||
            wasteLocation.district ||
            wasteLocation.state ||
            "Location submitted",

          district:
            location.district ||
            wasteLocation.district ||
            "",

          state:
            location.state ||
            wasteLocation.state ||
            "",

          latitude:
            location.coordinates?.latitude ??
            wasteLocation.coordinates?.latitude ??
            null,

          longitude:
            location.coordinates?.longitude ??
            wasteLocation.coordinates?.longitude ??
            null,
        };
      });


    // =====================================================
    // LIVE MAP LOCATIONS
    // =====================================================

    const locationDocs =
      await WasteReport.find({
        $or: [
          {
            "location.coordinates.latitude":
              { $ne: null },

            "location.coordinates.longitude":
              { $ne: null },
          },

          {
            "wasteLocation.coordinates.latitude":
              { $ne: null },

            "wasteLocation.coordinates.longitude":
              { $ne: null },
          },
        ],
      })
        .sort({
          createdAt: -1,
        })
        .limit(100)
        .select(
          [
            "reportId",
            "status",
            "createdAt",
            "location",
            "wasteLocation",
          ].join(" ")
        )
        .lean();


    // =====================================================
    // FORMAT MAP DATA
    // =====================================================

    const locations =
      locationDocs
        .map((report) => {
          const location =
            report.location || {};

          const wasteLocation =
            report.wasteLocation || {};

          const latitude =
            location.coordinates?.latitude ??
            wasteLocation.coordinates?.latitude;

          const longitude =
            location.coordinates?.longitude ??
            wasteLocation.coordinates?.longitude;

          if (
            latitude == null ||
            longitude == null
          ) {
            return null;
          }

          return {
            reportId:
              report.reportId || "",

            status:
              report.status || "Reported",

            createdAt:
              report.createdAt,

            latitude:
              Number(latitude),

            longitude:
              Number(longitude),

            district:
              location.district ||
              wasteLocation.district ||
              "",

            state:
              location.state ||
              wasteLocation.state ||
              "",

            locality:
              location.locality ||
              wasteLocation.locality ||
              "",

            gpsPlaceName:
              location.gpsPlaceName ||
              wasteLocation.gpsPlaceName ||
              "",
          };
        })
        .filter(Boolean);


    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      totalReports,

      pendingReports,

      resolvedReports,

      todayReports,

      recentReports,

      locations,

      wasteTypeDistribution,

      generatedAt: new Date(),
    });

  } catch (error) {

    console.error(
      "PUBLIC OVERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to load live report statistics.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
});

// =========================================================
// GET SINGLE REPORT BY REPORT ID + EMAIL
// GET /api/waste-reports/by-report-id
// =========================================================

router.get(
  "/by-report-id",
  async (req, res) => {
    try {
      const reportId =
        String(
          req.query.reportId || ""
        ).trim();

      const email =
        normalizeEmail(
          req.query.email
        );

      if (
        !reportId ||
        !email
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Report ID and Email are required.",
        });
      }

      const citizen =
        await Citizen.findOne({
          email,
          emailVerified: true,
        });

      if (!citizen) {
        return res.status(404).json({
          success: false,

          message:
            "No verified citizen found with this email.",
        });
      }

      const report =
        await WasteReport.findOne({
          reportId,

          email,

          citizenId:
            citizen._id,
        }).lean();

      if (!report) {
        return res.status(404).json({
          success: false,

          message:
            "No report found for this Report ID and Email.",
        });
      }

      return res.json({
        success: true,

        report,
      });
    } catch (error) {
      console.error(
        "Get Report By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch waste report.",
      });
    }
  }
);

// =========================================================
// GET ALL WASTE REPORTS
// GET /api/waste-reports
// =========================================================

router.get(
  "/",
  async (req, res) => {
    try {
      const reports =
        await WasteReport.find()
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        success: true,

        count:
          reports.length,

        reports,
      });
    } catch (error) {
      console.error(
        "Get Waste Reports Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch waste reports.",
      });
    }
  }
);

// =========================================================
// GET PREVIOUS REPORTS BY EMAIL
// GET /api/waste-reports/by-email
// =========================================================

router.get(
  "/by-email",
  async (req, res) => {
    try {
      const email =
        normalizeEmail(
          req.query.email
        );

      if (!email) {
        return res.status(400).json({
          success: false,

          message:
            "Email is required.",
        });
      }

      const citizen =
        await Citizen.findOne({
          email,
          emailVerified: true,
        }).lean();

      if (!citizen) {
        return res.json({
          success: true,

          found: false,

          email,

          reports: [],

          hasPreviousReports:
            false,

          previousReportCount:
            0,

          message:
            "Verified citizen not found.",
        });
      }

      // Citizen ObjectId is the authoritative
      // report-to-citizen relationship.
      const reports =
        await WasteReport.find({
          citizenId:
            citizen._id,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      const citizenData = {
        id:
          citizen._id,

        citizenId:
          citizen.citizenId,

        fullName:
          citizen.fullName,

        email:
          citizen.email,

        emailVerified:
          citizen.emailVerified,

        country:
          citizen.country,

        state:
          citizen.state,

        district:
          citizen.district,

        block:
          citizen.block,

        villageLocality:
          citizen.villageLocality,
      };

      if (
        reports.length === 0
      ) {
        return res.json({
          success: true,

          found: true,

          email,

          citizen:
            citizenData,

          reports: [],

          hasPreviousReports:
            false,

          previousReportCount:
            0,

          message:
            "No previous reports detected. Please make a report first.",
        });
      }

      return res.json({
        success: true,

        found: true,

        email,

        citizen:
          citizenData,

        reports,

        hasPreviousReports:
          true,

        previousReportCount:
          reports.length,

        message:
          "Previous waste reports found.",
      });
    } catch (error) {
      console.error(
        "Get Previous Waste Reports Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch previous waste reports.",
      });
    }
  }
);
// =========================================================
// GET REPORT LOCATION BY CUSTOM REPORT ID
// GET /api/waste-reports/by-report-id/location?reportId=swl0011
// =========================================================

router.get(
  "/by-report-id/location",
  async (req, res) => {
    try {
      const reportId = String(
        req.query.reportId || ""
      ).trim();

      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: "Report ID is required.",
        });
      }

      const report = await WasteReport.findOne(
        { reportId },
        {
          reportId: 1,
          status: 1,
          createdAt: 1,
          location: 1,
          wasteLocation: 1,
        }
      ).lean();

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Waste report not found.",
        });
      }

      const location =
        report.location || {};

      const wasteLocation =
        report.wasteLocation || {};

      const latitude =
        location.coordinates?.latitude ??
        wasteLocation.coordinates?.latitude ??
        null;

      const longitude =
        location.coordinates?.longitude ??
        wasteLocation.coordinates?.longitude ??
        null;

      if (
        latitude == null ||
        longitude == null
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Location coordinates are not available for this report.",
        });
      }

      return res.status(200).json({
        success: true,

        reportId:
          report.reportId,

        status:
          report.status,

        createdAt:
          report.createdAt,

        location: {
          latitude: Number(latitude),
          longitude: Number(longitude),

          country:
            location.country ||
            wasteLocation.country ||
            "India",

          state:
            location.state ||
            wasteLocation.state ||
            "",

          district:
            location.district ||
            wasteLocation.district ||
            "",

          block:
            location.block ||
            wasteLocation.block ||
            "",

          locality:
            location.locality ||
            wasteLocation.locality ||
            "",

          gpsPlaceName:
            location.gpsPlaceName ||
            wasteLocation.gpsPlaceName ||
            "",

          fullAddress:
            location.fullAddress ||
            wasteLocation.fullAddress ||
            "",
        },
      });
    } catch (error) {
      console.error(
        "Get Report Location Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch report location.",
      });
    }
  }
);
// =========================================================
// GET SINGLE REPORT BY MONGO ID OR CUSTOM REPORT ID
// GET /api/waste-reports/:id
// =========================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const id =
        String(
          req.params.id || ""
        ).trim();

      if (!id) {
        return res.status(400).json({
          success: false,

          message:
            "Report ID is required.",
        });
      }

      let report = null;

      // =====================================================
      // FIRST: MONGO _id
      // =====================================================

      try {
        report =
          await WasteReport.findById(
            id
          ).lean();
      } catch (error) {
        // Invalid Mongo ObjectId.
        // Continue with custom reportId.
      }

      // =====================================================
      // SECOND: CUSTOM REPORT ID
      // =====================================================

      if (!report) {
        report =
          await WasteReport.findOne({
            reportId: id,
          }).lean();
      }

      if (!report) {
        return res.status(404).json({
          success: false,

          message:
            "Waste report not found.",
        });
      }

      return res.json({
        success: true,

        report,
      });
    } catch (error) {
      console.error(
        "Get Waste Report Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch waste report.",
      });
    }
  }
);

// =========================================================
// MULTER ERROR HANDLER
// =========================================================

router.use(
  function wasteReportErrorHandler(
    error,
    req,
    res,
    next
  ) {
    if (res.headersSent) {
      return next(error);
    }

    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Image size must be less than 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,

        message:
          error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "Image upload failed.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unexpected waste report route error.",
    });
  }
);

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  router,
  analyzeWasteImage,
  upload,
};
