const express = require("express");

const router = express.Router();

const Citizen = require("../models/Citizen");
const Location = require("../models/Location");

// =========================================================
// GENERATE UNIQUE CITIZEN ID
//
// Format:
// swl001
// swl002
// swl003
// ...
//
// IMPORTANT:
// Existing citizen ka ID kabhi change nahi hoga.
// =========================================================

const generateCitizenId = async () => {
  // =======================================================
  // FIND ALL EXISTING CUSTOM CITIZEN IDs
  // =======================================================

  const citizens = await Citizen.find(
    {
      citizenId: {
        $regex: /^swl\d+$/i,
      },
    },
    {
      citizenId: 1,
    }
  ).lean();

  // =======================================================
  // FIND HIGHEST NUMBER
  // =======================================================

  let highestNumber = 0;

  for (const citizen of citizens) {
    const existingId = String(
      citizen?.citizenId || ""
    )
      .trim()
      .toLowerCase();

    const match = existingId.match(
      /^swl(\d+)$/
    );

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

  // =======================================================
  // GENERATE NEXT ID
  //
  // First citizen  -> swl001
  // Second citizen -> swl002
  // Third citizen  -> swl003
  // =======================================================

  let nextNumber =
    highestNumber + 1;

  let generatedCitizenId =
    `swl${String(
      nextNumber
    ).padStart(3, "0")}`;

  // =======================================================
  // SAFETY CHECK
  // =======================================================

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

  return generatedCitizenId;
};

// =========================================================
// GET VERIFIED CITIZEN BY EMAIL
//
// GET /api/citizen/by-email?email=example@gmail.com
//
// Purpose:
// Find an already verified citizen and restore
// their saved citizen profile + location.
// =========================================================

router.get("/by-email", async (req, res) => {
  try {
    // =====================================================
    // NORMALIZE EMAIL
    // =====================================================

    const email = req.query.email
      ?.trim()
      .toLowerCase();

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    if (!email) {
      return res.status(400).json({
        success: false,
        found: false,
        citizen: null,
        message: "Email is required.",
      });
    }

    // =====================================================
    // FIND VERIFIED CITIZEN
    // =====================================================

    const citizen = await Citizen.findOne({
      email,
      emailVerified: true,
    }).lean();

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!citizen) {
      return res.status(200).json({
        success: true,
        found: false,
        citizen: null,
        message:
          "No saved citizen location found for this email.",
      });
    }

    // =====================================================
    // FOUND
    // =====================================================

    return res.status(200).json({
      success: true,
      found: true,

      citizen: {
        // =================================================
        // CITIZEN DATABASE ID
        // =================================================

        id: citizen._id,

        // =================================================
        // CITIZEN ID
        // =================================================

        citizenId: citizen.citizenId || "",

        // =================================================
        // CITIZEN DETAILS
        // =================================================

        fullName:
          citizen.fullName || "",

        email:
          citizen.email,

        emailVerified:
          citizen.emailVerified,

        // =================================================
        // AGE CONFIRMATION
        // =================================================

        isAbove18:
          typeof citizen.isAbove18 === "boolean"
            ? citizen.isAbove18
            : null,

        // =================================================
        // COUNTRY
        // =================================================

        country:
          citizen.country,

        // =================================================
        // STATE
        // =================================================

        state:
          citizen.state,

        stateCode:
          citizen.stateCode || "",

        // =================================================
        // DISTRICT
        // =================================================

        district:
          citizen.district,

        districtCode:
          citizen.districtCode || "",

        // =================================================
        // BLOCK
        // =================================================

        block:
          citizen.block,

        blockCode:
          citizen.blockCode || "",

        // =================================================
        // VILLAGE / LOCALITY
        // =================================================

        villageLocality:
          citizen.villageLocality,

        villageCode:
          citizen.villageCode || "",

        // =================================================
        // COORDINATES
        // =================================================

        latitude:
          citizen.latitude ?? null,

        longitude:
          citizen.longitude ?? null,

        // =================================================
        // LOCATION STATUS
        // =================================================

        locationSubmitted:
          citizen.locationSubmitted === true,

        locationSubmittedAt:
          citizen.locationSubmittedAt || null,

        // =================================================
        // TIMESTAMPS
        // =================================================

        createdAt:
          citizen.createdAt || null,

        updatedAt:
          citizen.updatedAt || null,
      },

      message:
        "Saved citizen location found.",
    });
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "GET CITIZEN BY EMAIL ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,
      found: false,
      citizen: null,
      message:
        "Failed to load citizen location.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// =========================================================
// SAVE / UPDATE CITIZEN LOCATION
//
// POST /api/citizen/location
//
// Existing email:
// UPDATE existing Citizen document
//
// New email:
// CREATE new Citizen document
//
// Citizen ID:
// Existing citizen -> PRESERVE SAME ID
// New citizen      -> GENERATE NEW ID
// =========================================================

router.post("/location", async (req, res) => {
  try {
    // =====================================================
    // RECEIVE REQUEST DATA
    // =====================================================

    const {
      fullName,
      email,
      emailVerified,
      isAbove18,
      country,
      state,
      district,
      block,
      villageLocality,
    } = req.body;

    // =====================================================
    // DEBUG REQUEST
    // =====================================================

    console.log(
      "========================================"
    );

    console.log(
      "CITIZEN LOCATION SAVE REQUEST"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Full Name:",
      fullName
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Email Verified:",
      emailVerified
    );

    console.log(
      "Country:",
      country
    );

    console.log(
      "State:",
      state
    );

    console.log(
      "District:",
      district
    );

    console.log(
      "Block:",
      block
    );

    console.log(
      "Village / Locality:",
      villageLocality
    );

    // =====================================================
    // FULL NAME VALIDATION
    // =====================================================

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Full name is required.",
      });
    }

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =====================================================
    // EMAIL FORMAT VALIDATION
    // =====================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    if (emailVerified !== true) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before saving location.",
      });
    }

    // =====================================================
    // COUNTRY VALIDATION
    // =====================================================

    if (country !== "India") {
      return res.status(400).json({
        success: false,
        message:
          "Citizen location is currently available only for India.",
      });
    }

    // =====================================================
    // STATE VALIDATION
    // =====================================================

    if (!state?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "State is required.",
      });
    }

    // =====================================================
    // DISTRICT VALIDATION
    // =====================================================

    if (!district?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "District is required.",
      });
    }

    // =====================================================
    // BLOCK VALIDATION
    // =====================================================

    if (!block?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Block is required.",
      });
    }

    // =====================================================
    // VILLAGE / LOCALITY VALIDATION
    // =====================================================

    if (!villageLocality?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Village / Locality is required.",
      });
    }

    // =====================================================
    // NORMALIZE LOCATION VALUES
    // =====================================================

    const normalizedState =
      state.trim();

    const normalizedDistrict =
      district.trim();

    const normalizedBlock =
      block.trim();

    const normalizedVillage =
      villageLocality.trim();

    // =====================================================
    // DEBUG LOCATION SEARCH
    // =====================================================

    console.log(
      "----------------------------------------"
    );

    console.log(
      "SEARCHING MASTER LOCATION DATABASE"
    );

    console.log(
      "----------------------------------------"
    );

    console.log({
      country: "India",
      state: normalizedState,
      district: normalizedDistrict,
      block: normalizedBlock,
      village: normalizedVillage,
    });

    // =====================================================
    // VERIFY LOCATION FROM MASTER LOCATION DATABASE
    // =====================================================

    const validLocation =
      await Location.findOne({
        country: "India",
        state: normalizedState,
        district: normalizedDistrict,
        block: normalizedBlock,
        village: normalizedVillage,
      }).lean();

    // =====================================================
    // LOCATION NOT FOUND
    // =====================================================

    if (!validLocation) {
      console.error(
        "----------------------------------------"
      );

      console.error(
        "❌ MASTER LOCATION NOT FOUND"
      );

      console.error(
        "----------------------------------------"
      );

      console.error({
        country: "India",
        state: normalizedState,
        district: normalizedDistrict,
        block: normalizedBlock,
        village: normalizedVillage,
      });

      return res.status(400).json({
        success: false,
        message:
          "Invalid location. Please select a valid State, District, Block and Village / Locality.",
      });
    }

    // =====================================================
    // LOCATION FOUND
    // =====================================================

    console.log(
      "----------------------------------------"
    );

    console.log(
      "✅ MASTER LOCATION FOUND"
    );

    console.log(
      "----------------------------------------"
    );

    console.log({
      id: validLocation._id,

      country:
        validLocation.country,

      state:
        validLocation.state,

      stateCode:
        validLocation.stateCode,

      district:
        validLocation.district,

      districtCode:
        validLocation.districtCode,

      block:
        validLocation.block,

      blockCode:
        validLocation.blockCode,

      village:
        validLocation.village,

      villageCode:
        validLocation.villageCode,

      latitude:
        validLocation.latitude,

      longitude:
        validLocation.longitude,
    });

    // =====================================================
    // CHECK EXISTING CITIZEN
    // =====================================================

    let existingCitizen =
      await Citizen.findOne({
        email: normalizedEmail,
      });

    console.log(
      "Existing Citizen:",
      existingCitizen
        ? existingCitizen.citizenId || "NO ID"
        : "New Citizen"
    );

    // =====================================================
    // GENERATE CITIZEN ID ONLY FOR NEW CITIZEN
    // =====================================================

    let citizenId;

    if (existingCitizen) {
      // ================================================
      // EXISTING CITIZEN
      // ================================================

      citizenId =
        existingCitizen.citizenId;

      // ================================================
      // SAFETY FOR OLD CITIZENS
      //
      // If an old citizen exists without citizenId,
      // generate one now.
      // ================================================

      if (!citizenId) {
        citizenId =
          await generateCitizenId();

        existingCitizen.citizenId =
          citizenId;

        await existingCitizen.save();
      }

      console.log(
        "♻️ Existing Citizen ID:",
        citizenId
      );
    } else {
      // ================================================
      // NEW CITIZEN
      // ================================================

      citizenId =
        await generateCitizenId();

      console.log(
        "🆕 New Citizen ID:",
        citizenId
      );
    }

    // =====================================================
    // SAVE / UPDATE CITIZEN
    // =====================================================

    console.log(
      "----------------------------------------"
    );

    console.log(
      "SAVING CITIZEN TO MONGODB"
    );

    console.log(
      "----------------------------------------"
    );

    const citizen =
      await Citizen.findOneAndUpdate(
        {
          email:
            normalizedEmail,
        },

        {
          $set: {
            // =============================================
            // CITIZEN ID
            // =============================================

            citizenId:
              citizenId,

            // =============================================
            // CITIZEN DETAILS
            // =============================================

            fullName:
              fullName.trim(),

            email:
              normalizedEmail,

            emailVerified:
              true,

            // =============================================
            // AGE CONFIRMATION
            // ONLY FOR CONFIRMATION
            // NOT ELIGIBILITY
            // =============================================

            isAbove18:
              isAbove18 === true
                ? true
                : isAbove18 === false
                ? false
                : null,

            // =============================================
            // COUNTRY
            // =============================================

            country:
              "India",

            // =============================================
            // STATE
            // =============================================

            state:
              validLocation.state,

            stateCode:
              validLocation.stateCode || "",

            // =============================================
            // DISTRICT
            // =============================================

            district:
              validLocation.district,

            districtCode:
              validLocation.districtCode || "",

            // =============================================
            // BLOCK
            // =============================================

            block:
              validLocation.block,

            blockCode:
              validLocation.blockCode || "",

            // =============================================
            // VILLAGE / LOCALITY
            // =============================================

            villageLocality:
              validLocation.village,

            villageCode:
              validLocation.villageCode || "",

            // =============================================
            // COORDINATES
            // =============================================

            latitude:
              validLocation.latitude ?? null,

            longitude:
              validLocation.longitude ?? null,

            // =============================================
            // LOCATION STATUS
            // =============================================

            locationSubmitted:
              true,

            locationSubmittedAt:
              new Date(),
          },
        },

        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!citizen) {
      console.error(
        "❌ Citizen document was not created or updated."
      );

      return res.status(500).json({
        success: false,
        message:
          "Citizen could not be saved to MongoDB.",
      });
    }

    // =====================================================
    // MONGODB SUCCESS LOG
    // =====================================================

    console.log(
      "----------------------------------------"
    );

    console.log(
      "✅ CITIZEN SAVED TO MONGODB"
    );

    console.log(
      "----------------------------------------"
    );

    console.log({
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

      locationSubmitted:
        citizen.locationSubmitted,
    });

    console.log(
      "========================================"
    );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Email and citizen location saved successfully.",

      messageOdia:
        "ଇମେଲ୍ ଏବଂ ନାଗରିକଙ୍କ ସ୍ଥାନ ବିବରଣୀ ସଫଳତାର ସହିତ ସଂରକ୍ଷିତ ହୋଇଛି।",

      citizen: {
        // =================================================
        // MONGODB ID
        // =================================================

        id:
          citizen._id,

        // =================================================
        // CITIZEN ID
        // =================================================

        citizenId:
          citizen.citizenId,

        // =================================================
        // CITIZEN DETAILS
        // =================================================

        fullName:
          citizen.fullName,

        email:
          citizen.email,

        emailVerified:
          citizen.emailVerified,

        // =================================================
        // AGE CONFIRMATION
        // =================================================

        isAbove18:
          typeof citizen.isAbove18 === "boolean"
            ? citizen.isAbove18
            : null,

        // =================================================
        // COUNTRY
        // =================================================

        country:
          citizen.country,

        // =================================================
        // STATE
        // =================================================

        state:
          citizen.state,

        stateCode:
          citizen.stateCode,

        // =================================================
        // DISTRICT
        // =================================================

        district:
          citizen.district,

        districtCode:
          citizen.districtCode,

        // =================================================
        // BLOCK
        // =================================================

        block:
          citizen.block,

        blockCode:
          citizen.blockCode,

        // =================================================
        // VILLAGE
        // =================================================

        villageLocality:
          citizen.villageLocality,

        villageCode:
          citizen.villageCode,

        // =================================================
        // COORDINATES
        // =================================================

        latitude:
          citizen.latitude ?? null,

        longitude:
          citizen.longitude ?? null,

        // =================================================
        // LOCATION STATUS
        // =================================================

        locationSubmitted:
          citizen.locationSubmitted,

        locationSubmittedAt:
          citizen.locationSubmittedAt,

        // =================================================
        // TIMESTAMPS
        // =================================================

        createdAt:
          citizen.createdAt,

        updatedAt:
          citizen.updatedAt,
      },
    });
  } catch (error) {
    // =====================================================
    // ERROR LOG
    // =====================================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ CITIZEN LOCATION SAVE ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(error);

    // =====================================================
    // MONGOOSE VALIDATION ERROR
    // =====================================================

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Citizen data validation failed.",

        error:
          error.message,
      });
    }

    // =====================================================
    // DUPLICATE EMAIL / CITIZEN ID ERROR
    // =====================================================

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,

        message:
          "A citizen with this email or Citizen ID already exists.",

        error:
          error.message,
      });
    }

    // =====================================================
    // GENERAL SERVER ERROR
    // =====================================================

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Failed to save citizen location.",

      error:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    });
  }
});
// =========================================================
// VERIFY CITIZEN ID + EMAIL
//
// POST /api/citizen/verify
//
// BOTH MUST MATCH:
// 1. Citizen ID
// 2. Registered Email
//
// Email must also be verified.
//
// Existing citizen data is NOT changed.
// =========================================================

router.post("/verify", async (req, res) => {
  try {
    // =====================================================
    // RECEIVE REQUEST DATA
    // =====================================================

    const {
      citizenId,
      email,
    } = req.body;

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "========================================"
    );

    console.log(
      "CITIZEN ID + EMAIL VERIFICATION REQUEST"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Citizen ID:",
      citizenId
    );

    console.log(
      "Email:",
      email
    );

    // =====================================================
    // CITIZEN ID VALIDATION
    // =====================================================

    if (!citizenId?.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Citizen ID is required.",
      });
    }

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Email is required.",
      });
    }

    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const normalizedCitizenId =
      citizenId
        .trim()
        .toLowerCase();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    // =====================================================
    // CITIZEN ID FORMAT VALIDATION
    //
    // Expected:
    // swl001
    // swl002
    // swl003
    // =====================================================

    if (
      !/^swl\d{3}$/.test(
        normalizedCitizenId
      )
    ) {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Invalid Citizen ID format.",
      });
    }

    // =====================================================
    // EMAIL FORMAT VALIDATION
    // =====================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // =====================================================
    // FIND CITIZEN
    //
    // BOTH CITIZEN ID + EMAIL MUST MATCH
    // =====================================================

    const citizen =
      await Citizen.findOne({
        citizenId:
          normalizedCitizenId,

        email:
          normalizedEmail,
      }).lean();

    // =====================================================
    // CITIZEN NOT FOUND
    // =====================================================

    if (!citizen) {
      console.log(
        "❌ Citizen ID + Email combination not found."
      );

      return res.status(401).json({
        success: false,
        verified: false,
        message:
          "Citizen ID and registered email do not match.",
        messageOdia:
          "Citizen ID ଏବଂ ପଞ୍ଜୀକୃତ ଇମେଲ୍ ମେଳ ଖାଉନାହିଁ।",
      });
    }

    // =====================================================
    // EMAIL VERIFICATION CHECK
    // =====================================================

    if (
      citizen.emailVerified !== true
    ) {
      console.log(
        "❌ Citizen email is not verified."
      );

      return res.status(403).json({
        success: false,
        verified: false,
        message:
          "This email address is not verified.",
        messageOdia:
          "ଏହି ଇମେଲ୍ ଠିକଣା ଯାଞ୍ଚ ହୋଇନାହିଁ।",
      });
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      "========================================"
    );

    console.log(
      "✅ CITIZEN VERIFIED SUCCESSFULLY"
    );

    console.log(
      "Citizen ID:",
      citizen.citizenId
    );

    console.log(
      "Email:",
      citizen.email
    );

    console.log(
      "========================================"
    );

    // =====================================================
    // RETURN VERIFIED CITIZEN
    // =====================================================

    return res.status(200).json({
      success: true,
      verified: true,

      message:
        "Citizen ID and email verified successfully.",

      messageOdia:
        "Citizen ID ଏବଂ ଇମେଲ୍ ସଫଳତାର ସହିତ ଯାଞ୍ଚ ହୋଇଛି।",

      citizen: {
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

        isAbove18:
          typeof citizen.isAbove18 === "boolean"
            ? citizen.isAbove18
            : null,

        country:
          citizen.country,

        state:
          citizen.state,

        stateCode:
          citizen.stateCode || "",

        district:
          citizen.district,

        districtCode:
          citizen.districtCode || "",

        block:
          citizen.block,

        blockCode:
          citizen.blockCode || "",

        villageLocality:
          citizen.villageLocality,

        villageCode:
          citizen.villageCode || "",

        latitude:
          citizen.latitude ?? null,

        longitude:
          citizen.longitude ?? null,

        locationSubmitted:
          citizen.locationSubmitted === true,

        locationSubmittedAt:
          citizen.locationSubmittedAt || null,

        createdAt:
          citizen.createdAt || null,

        updatedAt:
          citizen.updatedAt || null,
      },
    });
  } catch (error) {
    // =====================================================
    // ERROR LOG
    // =====================================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ CITIZEN ID + EMAIL VERIFICATION ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(error);

    // =====================================================
    // GENERAL SERVER ERROR
    // =====================================================

    return res.status(500).json({
      success: false,
      verified: false,

      message:
        "Failed to verify citizen.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});
// =========================================================
// EXPORT
// =========================================================

module.exports = router;