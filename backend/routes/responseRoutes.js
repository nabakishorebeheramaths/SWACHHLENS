const express = require("express");

const WasteReport = require(
  "../models/WasteReport"
);

const Organization = require(
  "../models/Organization"
);

const ResponseRequest = require(
  "../models/ResponseRequest"
);

const {
  requireAdminAuth,
} = require(
  "../middleware/adminAuth"
);

const router = express.Router();


// =========================================================
// TEXT HELPERS
// =========================================================

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
};


// =========================================================
// LOCATION HELPERS
// IMPORTANT:
// WASTE INCIDENT LOCATION HAS PRIORITY.
// CITIZEN LOCATION IS ONLY A FALLBACK.
// =========================================================

const getLocationObject = (report) => {

  const incidentLocation =
    report?.wasteLocation ||
    report?.location ||
    {};

  const fallbackLocation =
    report?.location ||
    {};

  return {

    state:
      incidentLocation.state ||
      fallbackLocation.state ||
      "",

    district:
      incidentLocation.district ||
      fallbackLocation.district ||
      "",

    city:
      incidentLocation.city ||
      incidentLocation.locality ||
      fallbackLocation.city ||
      fallbackLocation.locality ||
      "",

    locality:
      incidentLocation.locality ||
      fallbackLocation.locality ||
      "",

    latitude:
      incidentLocation.coordinates?.latitude ??
      fallbackLocation.coordinates?.latitude ??
      null,

    longitude:
      incidentLocation.coordinates?.longitude ??
      fallbackLocation.coordinates?.longitude ??
      null,

  };
};


// =========================================================
// ORGANIZATION LOCATION DATA
// =========================================================

const getOrganizationLocation = (
  organization
) => {

  const location =
    organization?.location || {};

  return {

    state:
      location.state || "",

    district:
      location.district || "",

    city:
      location.city || "",

  };
};


// =========================================================
// SERVICE AREA MATCH
// =========================================================

const getServiceAreaMatches = (
  organization,
  reportLocation
) => {

  const organizationLocation =
    getOrganizationLocation(
      organization
    );

  const serviceAreas =
    normalizeArray(
      organization?.serviceArea
    );

  const reportState =
    normalizeText(
      reportLocation.state
    );

  const reportDistrict =
    normalizeText(
      reportLocation.district
    );

  const reportCity =
    normalizeText(
      reportLocation.city
    );

  const organizationState =
    normalizeText(
      organizationLocation.state
    );

  const organizationDistrict =
    normalizeText(
      organizationLocation.district
    );

  const organizationCity =
    normalizeText(
      organizationLocation.city
    );


  const stateMatch =
    Boolean(
      reportState &&
      (
        organizationState ===
          reportState ||
        serviceAreas.includes(
          reportState
        )
      )
    );


  const districtMatch =
    Boolean(
      reportDistrict &&
      (
        organizationDistrict ===
          reportDistrict ||
        serviceAreas.includes(
          reportDistrict
        )
      )
    );


  const cityMatch =
    Boolean(
      reportCity &&
      (
        organizationCity ===
          reportCity ||
        serviceAreas.includes(
          reportCity
        )
      )
    );


  return {

    cityMatch,

    districtMatch,

    stateMatch,

    organizationCity,

    organizationDistrict,

    organizationState,

  };
};


// =========================================================
// WASTE TYPE MATCHING
// =========================================================

const getWasteTypeMatch = (
  organization,
  reportWasteType
) => {

  const normalizedReportWaste =
    normalizeText(
      reportWasteType
    );

  const organizationWasteTypes =
    normalizeArray(
      organization?.wasteTypes
    );


  if (
    !normalizedReportWaste
  ) {
    return {
      exact: false,
      compatible: false,
      score: 0,
      reason: "",
    };
  }


  // =======================================================
  // EXACT MATCH
  // =======================================================

  if (
    organizationWasteTypes.includes(
      normalizedReportWaste
    )
  ) {

    return {

      exact: true,

      compatible: true,

      score: 40,

      reason:
        "Organization directly supports the reported waste type.",

    };
  }


  // =======================================================
  // PHRASE / CATEGORY COMPATIBILITY
  // =======================================================

  const compatibilityGroups = [

    {
      keywords: [
        "plastic",
      ],

      types: [
        "plastic waste",
        "mixed waste",
        "municipal waste",
        "municipal solid waste",
        "other",
      ],
    },

    {
      keywords: [
        "paper",
      ],

      types: [
        "paper waste",
        "mixed waste",
        "municipal waste",
        "other",
      ],
    },

    {
      keywords: [
        "glass",
      ],

      types: [
        "glass waste",
        "mixed waste",
        "municipal waste",
        "other",
      ],
    },

    {
      keywords: [
        "organic",
        "food",
        "biodegradable",
      ],

      types: [
        "organic waste",
        "mixed waste",
        "municipal waste",
        "municipal solid waste",
        "other",
      ],
    },

    {
      keywords: [
        "e-waste",
        "electronic",
      ],

      types: [
        "e-waste",
      ],
    },

    {
      keywords: [
        "biomedical",
        "medical",
      ],

      types: [
        "biomedical waste",
      ],
    },

    {
      keywords: [
        "hazardous",
        "chemical",
        "toxic",
      ],

      types: [
        "hazardous waste",
      ],
    },

    {
      keywords: [
        "construction",
        "demolition",
        "c&d",
      ],

      types: [
        "construction waste",
      ],
    },

    {
      keywords: [
        "mixed",
        "municipal",
        "solid waste",
      ],

      types: [
        "mixed waste",
        "municipal waste",
        "municipal solid waste",
        "solid waste",
        "other",
      ],
    },

  ];


  for (
    const group
    of compatibilityGroups
  ) {

    const keywordMatched =
      group.keywords.some(
        (keyword) =>
          normalizedReportWaste.includes(
            keyword
          )
      );


    if (!keywordMatched) {
      continue;
    }


    const compatible =
      group.types.some(
        (supportedType) =>
          organizationWasteTypes.includes(
            supportedType
          )
      );


    if (compatible) {

      return {

        exact: false,

        compatible: true,

        score: 28,

        reason:
          "Organization supports a compatible waste category.",

      };
    }
  }


  return {

    exact: false,

    compatible: false,

    score: 0,

    reason: "",

  };
};


// =========================================================
// SEVERITY / RISK INFORMATION
// =========================================================

const getRiskInformation = (
  report
) => {

  const ai =
    report?.aiAnalysis || {};


  const severity =
    normalizeText(
      report?.visibleSeverity ||
      ai?.visibleSeverity ||
      report?.severity ||
      ai?.severity ||
      ""
    );


  const priority =
    normalizeText(
      report?.priority ||
      ai?.priority ||
      ""
    );


  const riskScore =
    Number(
      report?.riskScore ??
      ai?.riskScore ??
      0
    );


  const hazardDetected =
    Boolean(
      report?.hazardDetected ??
      ai?.hazardDetected ??
      false
    );


  const roadBlockage =
    Boolean(
      report?.roadBlockage ??
      ai?.roadBlockage ??
      false
    );


  return {

    severity,

    priority,

    riskScore,

    hazardDetected,

    roadBlockage,

  };
};


// =========================================================
// SCORE ORGANIZATION
// =========================================================

const calculateOrganizationScore = (
  organization,
  report
) => {

  const reportLocation =
    getLocationObject(
      report
    );


  const locationMatch =
    getServiceAreaMatches(
      organization,
      reportLocation
    );


  const wasteMatch =
    getWasteTypeMatch(
      organization,
      report?.wasteType
    );


  const risk =
    getRiskInformation(
      report
    );


  let score = 0;

  const reasons = [];

  const matchedFactors = [];


  // =======================================================
  // 1. WASTE TYPE
  // =======================================================

  score +=
    wasteMatch.score;


  if (
    wasteMatch.exact
  ) {

    reasons.push(
      wasteMatch.reason
    );

    matchedFactors.push(
      "waste-type-exact"
    );

  } else if (
    wasteMatch.compatible
  ) {

    reasons.push(
      wasteMatch.reason
    );

    matchedFactors.push(
      "waste-type-compatible"
    );

  }


  // =======================================================
  // 2. EXACT CITY
  // =======================================================

  if (
    locationMatch.cityMatch
  ) {

    score += 30;

    reasons.push(
      "Organization serves the reported city."
    );

    matchedFactors.push(
      "city"
    );

  }

  // =======================================================
  // 3. DISTRICT
  // =======================================================

  else if (
    locationMatch.districtMatch
  ) {

    score += 22;

    reasons.push(
      "Organization serves the reported district."
    );

    matchedFactors.push(
      "district"
    );

  }

  // =======================================================
  // 4. STATE
  // =======================================================

  else if (
    locationMatch.stateMatch
  ) {

    score += 12;

    reasons.push(
      "Organization serves the reported state."
    );

    matchedFactors.push(
      "state"
    );

  }


  // =======================================================
  // 5. PRIORITY SUPPORT
  // =======================================================

  if (
    organization?.prioritySupport ===
    true
  ) {

    score += 8;

    reasons.push(
      "Organization has priority response support."
    );

    matchedFactors.push(
      "priority-support"
    );

  }


  // =======================================================
  // 6. ACTIVE STATUS
  // =======================================================

  if (
    organization?.active ===
    true
  ) {

    score += 5;

    matchedFactors.push(
      "active"
    );

  }


  // =======================================================
  // 7. HIGH-RISK REPORT
  // =======================================================

  const highRisk =
    risk.riskScore >= 70 ||
    risk.severity ===
      "high" ||
    risk.severity ===
      "critical" ||
    risk.priority ===
      "high" ||
    risk.priority ===
      "critical";


  if (
    highRisk &&
    organization?.prioritySupport ===
      true
  ) {

    score += 10;

    reasons.push(
      "Priority support is suitable for this high-risk report."
    );

    matchedFactors.push(
      "high-risk-priority"
    );

  }


  // =======================================================
  // 8. HAZARD SUPPORT
  // =======================================================

  if (
    risk.hazardDetected
  ) {

    const organizationTypes =
      normalizeArray(
        organization?.wasteTypes
      );


    const hazardCapable =
      organizationTypes.includes(
        "hazardous waste"
      ) ||
      organizationTypes.includes(
        "biomedical waste"
      ) ||
      organizationTypes.includes(
        "e-waste"
      );


    if (
      hazardCapable
    ) {

      score += 10;

      reasons.push(
        "Organization handles waste categories relevant to the detected hazard."
      );

      matchedFactors.push(
        "hazard-support"
      );

    }

  }


  // =======================================================
  // 9. ROAD BLOCKAGE
  // =======================================================

  if (
    risk.roadBlockage
  ) {

    if (
      locationMatch.cityMatch ||
      locationMatch.districtMatch ||
      locationMatch.stateMatch
    ) {

      score += 5;

      reasons.push(
        "Organization operates in the affected area."
      );

      matchedFactors.push(
        "road-blockage-area"
      );

    }

  }


  // =======================================================
  // 10. OWN RATING
  // =======================================================

  if (
    typeof organization?.rating ===
      "number" &&
    organization.rating > 0
  ) {

    score += Math.min(
      organization.rating * 2,
      10
    );

  }


  // =======================================================
  // MATCH QUALITY
  // =======================================================

  let matchLevel =
    "Available";

  if (
    score >= 80
  ) {

    matchLevel =
      "Excellent Match";

  } else if (
    score >= 60
  ) {

    matchLevel =
      "Strong Match";

  } else if (
    score >= 40
  ) {

    matchLevel =
      "Good Match";

  } else if (
    score >= 20
  ) {

    matchLevel =
      "Possible Match";

  }


  return {

    score,

    matchLevel,

    reasons,

    matchedFactors,

    locationMatch,

    wasteMatch,

    risk,

  };
};


// =========================================================
// GET SMART ORGANIZATION SUGGESTIONS
// =========================================================

router.get(
  "/suggestions/:reportId",
  async (
    req,
    res
  ) => {

    try {

      const reportId =
        String(
          req.params.reportId ||
            ""
        ).trim();


      // =====================================================
      // REPORT ID VALIDATION
      // =====================================================

      if (!reportId) {

        return res.status(400).json({

          success: false,

          message:
            "Report ID is required.",

        });

      }


      // =====================================================
      // FIND ACTUAL SAVED WASTE REPORT
      // =====================================================

      const report =
        await WasteReport.findOne({

          reportId,

        }).lean();


      if (!report) {

        return res.status(404).json({

          success: false,

          message:
            "Report ID not found.",

        });

      }


      // =====================================================
      // REPORT LOCATION
      // =====================================================

      const reportLocation =
        getLocationObject(
          report
        );


      // =====================================================
      // REPORT RISK INFORMATION
      // =====================================================

      const reportRisk =
        getRiskInformation(
          report
        );


      // =====================================================
      // LOAD ACTIVE ORGANIZATIONS
      // =====================================================

      const organizations =
        await Organization.find({

          active: true,

        }).lean();


      // =====================================================
      // SCORE EVERY ORGANIZATION
      // =====================================================

      const scored =
        organizations.map(
          (organization) => {

            const result =
              calculateOrganizationScore(
                organization,
                report
              );


            return {

              organization,

              ...result,

            };

          }
        );


      // =====================================================
      // SORT
      // =====================================================

      scored.sort(
        (
          first,
          second
        ) => {

          // Highest score first
          if (
            second.score !==
            first.score
          ) {

            return (
              second.score -
              first.score
            );

          }


          // Priority support first
          if (
            Boolean(
              second.organization
                ?.prioritySupport
            ) !==
            Boolean(
              first.organization
                ?.prioritySupport
            )
          ) {

            return second.organization
              ?.prioritySupport
              ? 1
              : -1;

          }


          // Exact waste match first
          if (
            Boolean(
              second.wasteMatch
                ?.exact
            ) !==
            Boolean(
              first.wasteMatch
                ?.exact
            )
          ) {

            return second.wasteMatch
              ?.exact
              ? 1
              : -1;

          }


          // Alphabetical fallback
          return String(
            first.organization
              ?.organizationName ||
              ""
          ).localeCompare(
            String(
              second.organization
                ?.organizationName ||
                ""
            )
          );

        }
      );


      // =====================================================
      // SELECT RECOMMENDATIONS
      // =====================================================

      const suggested =
        scored
          .filter(
            (item) => {

              const usefulLocationMatch =
                item.locationMatch
                  .cityMatch ||
                item.locationMatch
                  .districtMatch ||
                item.locationMatch
                  .stateMatch;

              const usefulWasteMatch =
                item.wasteMatch
                  .exact ||
                item.wasteMatch
                  .compatible;

              return (
                usefulLocationMatch ||
                usefulWasteMatch
              );

            }
          )
          .slice(
            0,
            10
          );


      // =====================================================
      // FALLBACK
      // If no meaningful location/waste match exists,
      // return best active organizations instead of fake
      // "perfect" matches.
      // =====================================================

      const finalSuggestions =
        suggested.length > 0
          ? suggested
          : scored.slice(
              0,
              5
            );


      // =====================================================
      // FORMAT SAFE RESPONSE
      // =====================================================

     const suggestions =
  finalSuggestions.map(
    (item) => {

      const organization =
        item.organization;

      return {

        // -------------------------------------------------
        // BASIC ORGANIZATION IDENTITY
        // -------------------------------------------------

        organizationId:
          String(
            organization._id
          ),

        organizationName:
          organization.organizationName,

        // -------------------------------------------------
        // PUBLIC LOCATION DETAILS
        // -------------------------------------------------

        location:
          organization.location,

        // -------------------------------------------------
        // PUBLIC ORGANIZATION DETAILS
        // -------------------------------------------------

        serviceArea:
          Array.isArray(
            organization.serviceArea
          )
            ? organization.serviceArea
            : [],

        wasteTypes:
          Array.isArray(
            organization.wasteTypes
          )
            ? organization.wasteTypes
            : [],

        prioritySupport:
          organization.prioritySupport ===
          true,

        active:
          organization.active ===
          true,

        rating:
          typeof organization.rating ===
            "number"
            ? organization.rating
            : null,

        // -------------------------------------------------
        // INTERNAL MATCHING RESULT
        // -------------------------------------------------

        matchScore:
          item.score,

        matchLevel:
          item.matchLevel,

        matchedFactors:
          item.matchedFactors,

        reasons:
          item.reasons,

      };

    }
  );
      // =====================================================
      // RETURN RESULT
      // =====================================================

      return res.status(200).json({

        success: true,

        report: {

          reportId:
            report.reportId,

          wasteType:
            report.wasteType ||
            "",

          visibleSeverity:
            report.visibleSeverity ||
            report.aiAnalysis
              ?.visibleSeverity ||
            "",

          priority:
            report.priority ||
            report.aiAnalysis
              ?.priority ||
            "",

          riskScore:
            reportRisk.riskScore,

          hazardDetected:
            reportRisk.hazardDetected,

          roadBlockage:
            reportRisk.roadBlockage,

          location:
            reportLocation,

        },

        count:
          suggestions.length,

        suggestions,

      });

    } catch (error) {

      console.error(
        "❌ Organization Suggestion Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to generate organization suggestions.",

      });

    }
  }
);

// =========================================================
// GET REPORT DETAILS FOR RESPONSE REQUEST
// =========================================================

router.get(
  "/report/:reportId",
  async (
    req,
    res
  ) => {

    try {

      const reportId =
        String(
          req.params.reportId || ""
        ).trim();

      if (!reportId) {

        return res.status(400).json({
          success: false,
          message:
            "Report ID is required.",
        });

      }

      const report =
        await WasteReport.findOne({
          reportId,
        }).lean();

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Report ID not found.",
        });

      }

      return res.status(200).json({
        success: true,
        report,
      });

    } catch (error) {

      console.error(
        "❌ Response Report Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load report details.",
      });

    }
  }
);


// =========================================================
// FINAL RESPONSE REQUEST SUBMIT
// =========================================================

router.post(
  "/request",
  async (
    req,
    res
  ) => {

    try {

      const {
        reportId,
        organizationId,
        feedback,
        appointment,
      } = req.body || {};

      const normalizedReportId =
        String(
          reportId || ""
        ).trim();

      if (!normalizedReportId) {

        return res.status(400).json({
          success: false,
          message:
            "Report ID is required.",
        });

      }

      if (!organizationId) {

        return res.status(400).json({
          success: false,
          message:
            "Organization selection is required.",
        });

      }

      const report =
        await WasteReport.findOne({
          reportId:
            normalizedReportId,
        }).lean();

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Report ID not found.",
        });

      }

      const organization =
        await Organization.findOne({
          _id:
            organizationId,
          active:
            true,
        }).lean();

      if (!organization) {

        return res.status(404).json({
          success: false,
          message:
            "Selected organization is not available.",
        });

      }

      const feedbackReason =
        String(
          feedback?.reason || ""
        ).trim();

      const additionalFeedback =
        String(
          feedback?.additionalFeedback || ""
        ).trim();

      if (!feedbackReason) {

        return res.status(400).json({
          success: false,
          message:
            "Feedback reason is required.",
        });

      }

      const appointmentRequested =
        appointment?.requested === true;

      const appointmentDate =
        String(
          appointment?.date || ""
        ).trim();

      const appointmentTime =
        String(
          appointment?.time || ""
        ).trim();

      const appointmentNote =
        String(
          appointment?.note || ""
        ).trim();

      if (
        appointmentRequested &&
        !appointmentDate
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Appointment date is required.",
        });

      }

      if (
        appointmentRequested &&
        !appointmentTime
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Appointment time is required.",
        });

      }

      const reportLocation =
        getLocationObject(
          report
        );

      const reportSnapshot = {

        wasteType:
          report?.wasteType || "",

        visibleSeverity:
          report?.visibleSeverity ||
          report?.aiAnalysis
            ?.visibleSeverity ||
          "",

        riskScore:
          report?.riskScore ??
          report?.aiAnalysis
            ?.riskScore ??
          null,

        hazardDetected:
          Boolean(
            report?.hazardDetected ??
            report?.aiAnalysis
              ?.hazardDetected ??
            false
          ),

        roadBlockage:
          Boolean(
            report?.roadBlockage ??
            report?.aiAnalysis
              ?.roadBlockage ??
            false
          ),

        location: {

          state:
            reportLocation.state,

          district:
            reportLocation.district,

          city:
            reportLocation.city,

          locality:
            reportLocation.locality,

        },

        description:
          report?.description || "",

        imageUrl:
          report?.imageUrl ||
          report?.image?.url ||
          "",

      };

      const existingRequest =
        await ResponseRequest.findOne({
          reportId:
            normalizedReportId,
          status: {
            $in: [
              "pending",
              "processing",
              "sent",
              "accepted",
            ],
          },
        }).lean();

      if (existingRequest) {

        return res.status(409).json({
          success: false,
          message:
            "A response request for this Report ID is already active.",
        });

      }

      const responseRequest =
        await ResponseRequest.create({

          reportId:
            normalizedReportId,

          citizenId:
            String(
              report?.citizenId || ""
            ).trim(),

          citizenEmail:
            String(
              report?.email ||
              report?.citizen?.email ||
              ""
            )
              .trim()
              .toLowerCase(),

          organizationId:
            organization._id,

          organizationName:
            organization.organizationName,

          organizationLocation: {

            state:
              organization.location
                ?.state || "",

            district:
              organization.location
                ?.district || "",

            city:
              organization.location
                ?.city || "",

          },

          reportSnapshot,

          feedback: {

            reason:
              feedbackReason,

            additionalFeedback,

          },

          appointment: {

            requested:
              appointmentRequested,

            date:
              appointmentRequested
                ? appointmentDate
                : "",

            time:
              appointmentRequested
                ? appointmentTime
                : "",

            note:
              appointmentRequested
                ? appointmentNote
                : "",

            status:
              appointmentRequested
                ? "pending"
                : "not_requested",

          },

          status:
            "pending",

          organizationNotificationStatus:
            "pending",

          submittedAt:
            new Date(),

        });

      return res.status(201).json({

        success: true,

        message:
          "Response request submitted successfully.",

        responseRequest: {

          id:
            responseRequest._id,

          reportId:
            responseRequest.reportId,

          organizationId:
            responseRequest.organizationId,

          organizationName:
            responseRequest.organizationName,

          status:
            responseRequest.status,

          appointment:
            responseRequest.appointment,

          submittedAt:
            responseRequest.submittedAt,

        },

      });

    } catch (error) {

      console.error(
        "❌ Final Response Request Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to submit response request.",
      });

    }
  }
);


// =========================================================
// PROTECTED ADMIN RESPONSE REQUESTS
// =========================================================

router.get(
  "/admin/requests",
  requireAdminAuth,
  async (
    req,
    res
  ) => {

    try {

      const requests =
        await ResponseRequest
          .find({})
          .sort({
            submittedAt:
              -1,
          })
          .lean();

      return res.status(200).json({

        success: true,

        count:
          requests.length,

        requests,

      });

    } catch (error) {

      console.error(
        "❌ Admin Response Request Loading Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to load response requests.",

      });

    }
  }
);
module.exports = router;