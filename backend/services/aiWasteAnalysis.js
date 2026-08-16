const { GoogleGenAI } = require("@google/genai");

// =========================================================
// GEMINI CONFIG
// =========================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||"gemini-3.1-flash-lite";

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  : null;

console.log(
  "🔑 Gemini API Key:",
  GEMINI_API_KEY ? "LOADED" : "MISSING"
);

console.log(
  "🤖 Gemini Model:",
  GEMINI_MODEL
);

// =========================================================
// ALLOWED VALUES
// =========================================================

const ALLOWED_WASTE_TYPES = [
  "Mixed Waste",
  "Plastic Waste",
  "Organic Waste",
  "Construction Waste",
  "Electronic Waste",
  "Hazardous Waste",
  "Other",
];

const ALLOWED_SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const ALLOWED_AI_CATEGORIES = [
  ...ALLOWED_WASTE_TYPES,
  "Not Waste",
];

// =========================================================
// CONSTANTS
// =========================================================

const MIN_CONFIDENCE = 0.60;

const QUANTITY_VALUES = [
  "Small amount",
  "Moderate amount",
  "Large amount",
  "Very large accumulation",
  "Unable to estimate",
];

// =========================================================
// DEFAULT RESULT
// =========================================================

const createDefaultResult = (
  reason = "Unable to analyze image."
) => ({
  isWaste: false,
  validImage: false,
  wasteDetected: false,

  confidence: 0,

  category: "Not Waste",
  wasteType: "",

  visibleSeverity: "Low",
  severity: "Low",

  description: "",
  reason,

  estimatedQuantity: "",

  hazardDetected: false,
  roadBlockage: false,

  prediction: "",
  recommendedAction: "",

  riskScore: 0,
  priority: "Low",

  message: reason,
});

// =========================================================
// RESPONSE SCHEMA
// =========================================================

const responseSchema = {
  type: "object",

  properties: {
    isWaste: {
      type: "boolean",
    },

    validImage: {
      type: "boolean",
    },

    wasteDetected: {
      type: "boolean",
    },

    confidence: {
      type: "number",
    },

    category: {
      type: "string",
      enum: ALLOWED_AI_CATEGORIES,
    },

    wasteType: {
      type: "string",
    },

    visibleSeverity: {
      type: "string",
      enum: ALLOWED_SEVERITIES,
    },

    severity: {
      type: "string",
      enum: ALLOWED_SEVERITIES,
    },

    description: {
      type: "string",
    },

    reason: {
      type: "string",
    },

    estimatedQuantity: {
      type: "string",
    },

    hazardDetected: {
      type: "boolean",
    },

    roadBlockage: {
      type: "boolean",
    },

    prediction: {
      type: "string",
    },

    recommendedAction: {
      type: "string",
    },

    riskScore: {
      type: "number",
    },

    priority: {
      type: "string",
      enum: ALLOWED_SEVERITIES,
    },

    message: {
      type: "string",
    },
  },

  required: [
    "isWaste",
    "validImage",
    "wasteDetected",
    "confidence",
    "category",
    "wasteType",
    "visibleSeverity",
    "severity",
    "description",
    "reason",
    "estimatedQuantity",
    "hazardDetected",
    "roadBlockage",
    "prediction",
    "recommendedAction",
    "riskScore",
    "priority",
    "message",
  ],
};

// =========================================================
// AI PROMPT
// =========================================================

const AI_PROMPT = `
You are the official SWACHHLENS AI image analysis system.

SWACHHLENS is a civic waste-response decision support system.

Inspect the uploaded image and determine whether it shows a
REAL-WORLD WASTE OR GARBAGE PROBLEM.

Only classify as waste when visible evidence exists.

If waste cannot be confidently identified:

isWaste = false
wasteDetected = false
category = "Not Waste"
wasteType = ""
visibleSeverity = "Low"
severity = "Low"
hazardDetected = false
roadBlockage = false
riskScore = 0
priority = "Low"

When uncertain, prefer FALSE.

=========================================================
VALID WASTE
=========================================================

Examples:

- garbage piles
- mixed household waste
- plastic waste
- organic waste
- discarded food
- construction debris
- electronic waste
- hazardous waste
- dumped garbage
- overflowing bins
- scattered garbage
- roadside garbage
- waste on streets
- waste blocking roads
- waste blocking pathways
- accumulated garbage
- public waste dumping

=========================================================
INVALID
=========================================================

Do NOT classify as waste merely because the image is:

- dirty
- dark
- blurry
- outdoors
- unusual
- low quality
- random objects
- normal street
- normal building
- people
- vehicles
- animals
- landscapes
- clean roads
- documents
- screenshots
- memes
- logos
- cartoons
- drawings
- unrelated photographs

=========================================================
WASTE CATEGORY
=========================================================

If waste is visible, choose exactly ONE:

"Mixed Waste"
"Plastic Waste"
"Organic Waste"
"Construction Waste"
"Electronic Waste"
"Hazardous Waste"
"Other"

If no waste:

category = "Not Waste"
wasteType = ""

=========================================================
SEVERITY
=========================================================

Low:
Small amount with limited impact.

Medium:
Moderate amount or noticeable accumulation.

High:
Large accumulation, significant public-space impact,
road/path obstruction, major dumping, or serious sanitation concern.

Critical:
Very severe accumulation, major road blockage,
dangerous/hazardous visible condition, or extremely serious impact.

=========================================================
QUANTITY
=========================================================

Use ONLY:

"Small amount"
"Moderate amount"
"Large amount"
"Very large accumulation"
"Unable to estimate"

Do not invent measurements.

=========================================================
HAZARD
=========================================================

hazardDetected = true ONLY when a visible hazardous condition
or hazardous material is reasonably identifiable.

Do not infer hidden hazards.

=========================================================
ROAD BLOCKAGE
=========================================================

roadBlockage = true ONLY when visible waste blocks:

- road
- street
- pathway
- footpath
- entrance
- public access

=========================================================
PREDICTION
=========================================================

Give one short realistic consequence if unresolved.

=========================================================
RECOMMENDED ACTION
=========================================================

Give one short practical civic response.

=========================================================
RISK SCORE
=========================================================

Generate a number from 0 to 100.

0-24 = Low
25-49 = Medium
50-74 = High
75-100 = Critical

Use only visible evidence.

=========================================================
CONFIDENCE
=========================================================

confidence must be between 0 and 1.

If waste is uncertain, set isWaste = false.

=========================================================
IMPORTANT
=========================================================

1. isWaste must be boolean.
2. validImage must indicate valid waste image.
3. wasteDetected must only be true for visible waste.
4. confidence must be 0 to 1.
5. Do not invent objects.
6. Do not infer hidden waste.
7. category must exactly match allowed values.
8. If isWaste=false, category="Not Waste".
9. If isWaste=false, wasteType="".
10. If isWaste=false, visibleSeverity="Low".
11. If isWaste=false, severity="Low".
12. If isWaste=false, hazardDetected=false.
13. If isWaste=false, roadBlockage=false.
14. If isWaste=false, riskScore=0.
15. If isWaste=false, priority="Low".
16. Keep description short.
17. Keep reason short.
18. Keep prediction short.
19. Keep recommendedAction short.
20. Do not invent measurements.
21. Return ONLY valid JSON.
22. Never return markdown.
`;

// =========================================================
// JSON CLEANER
// =========================================================

const cleanJSON = (text) => {
  let cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.substring(
      firstBrace,
      lastBrace + 1
    );
  }

  return cleaned;
};

// =========================================================
// SAFE STRING
// =========================================================

const safeString = (
  value,
  fallback = ""
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return String(value).trim();
};

// =========================================================
// CATEGORY NORMALIZATION
// =========================================================

const normalizeCategory = (value) => {
  const categoryMap = {
    "mixed waste": "Mixed Waste",
    "plastic waste": "Plastic Waste",
    "organic waste": "Organic Waste",
    "construction waste": "Construction Waste",
    "electronic waste": "Electronic Waste",
    "e-waste": "Electronic Waste",
    "hazardous waste": "Hazardous Waste",
    other: "Other",
    "not waste": "Not Waste",
  };

  const normalized = safeString(value)
    .toLowerCase();

  return (
    categoryMap[normalized] ||
    "Not Waste"
  );
};

// =========================================================
// SEVERITY NORMALIZATION
// =========================================================

const normalizeSeverity = (value) => {
  const severityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const normalized = safeString(value)
    .toLowerCase();

  return (
    severityMap[normalized] ||
    "Low"
  );
};

// =========================================================
// QUANTITY NORMALIZATION
// =========================================================

const normalizeQuantity = (value) => {
  const quantity = safeString(value);

  if (
    QUANTITY_VALUES.includes(quantity)
  ) {
    return quantity;
  }

  const lower = quantity.toLowerCase();

  if (lower.includes("very large")) {
    return "Very large accumulation";
  }

  if (lower.includes("large")) {
    return "Large amount";
  }

  if (
    lower.includes("moderate") ||
    lower.includes("medium")
  ) {
    return "Moderate amount";
  }

  if (lower.includes("small")) {
    return "Small amount";
  }

  return "Unable to estimate";
};

// =========================================================
// NORMALIZE AI RESULT
// =========================================================

const normalizeAIResult = (result = {}) => {

  const isWaste =
    result?.isWaste === true ||
    result?.wasteDetected === true;

  // -------------------------------------------------------
  // CONFIDENCE
  // -------------------------------------------------------

  let confidence = Number(
    result?.confidence
  );

  if (!Number.isFinite(confidence)) {
    confidence = 0;
  }

  confidence = Math.max(
    0,
    Math.min(1, confidence)
  );

  // -------------------------------------------------------
  // CATEGORY
  // -------------------------------------------------------

  let category = normalizeCategory(
    result?.category ||
    result?.wasteType
  );

  if (!isWaste) {
    category = "Not Waste";
  }

  // -------------------------------------------------------
  // WASTE TYPE
  // -------------------------------------------------------

  const wasteType =
    isWaste &&
    ALLOWED_WASTE_TYPES.includes(category)
      ? category
      : "";

  // -------------------------------------------------------
  // SEVERITY
  // -------------------------------------------------------

  let visibleSeverity =
    normalizeSeverity(
      result?.visibleSeverity ||
      result?.severity
    );

  if (!isWaste) {
    visibleSeverity = "Low";
  }

  const severity =
    isWaste
      ? visibleSeverity
      : "Low";

  // -------------------------------------------------------
  // DESCRIPTION
  // -------------------------------------------------------

  const description = safeString(
    result?.description
  );

  // -------------------------------------------------------
  // REASON
  // -------------------------------------------------------

  const reason = safeString(
    result?.reason ||
    result?.message ||
    (
      isWaste
        ? "Waste was detected in the uploaded image."
        : "No clear waste was detected in the uploaded image."
    )
  );

  // -------------------------------------------------------
  // QUANTITY
  // -------------------------------------------------------

  const estimatedQuantity =
    isWaste
      ? normalizeQuantity(
          result?.estimatedQuantity
        )
      : "";

  // -------------------------------------------------------
  // HAZARD
  // -------------------------------------------------------

  const hazardDetected =
    isWaste &&
    result?.hazardDetected === true;

  // -------------------------------------------------------
  // ROAD BLOCKAGE
  // -------------------------------------------------------

  const roadBlockage =
    isWaste &&
    result?.roadBlockage === true;

  // -------------------------------------------------------
  // PREDICTION
  // -------------------------------------------------------

  const prediction = safeString(
    result?.prediction
  );

  // -------------------------------------------------------
  // RECOMMENDED ACTION
  // -------------------------------------------------------

  const recommendedAction = safeString(
    result?.recommendedAction
  );

  // -------------------------------------------------------
  // RISK SCORE
  // -------------------------------------------------------

  let riskScore = Number(
    result?.riskScore
  );

  if (!Number.isFinite(riskScore)) {
    riskScore = 0;
  }

  riskScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(riskScore)
    )
  );

  if (!isWaste) {
    riskScore = 0;
  }

  // -------------------------------------------------------
  // PRIORITY
  // -------------------------------------------------------

  let priority = normalizeSeverity(
    result?.priority ||
    visibleSeverity
  );

  if (!isWaste) {
    priority = "Low";
  }

  // Risk based priority
  if (isWaste) {

    if (riskScore >= 75) {
      priority = "Critical";
    } else if (riskScore >= 50) {
      priority = "High";
    } else if (riskScore >= 25) {
      priority = "Medium";
    } else {
      priority = "Low";
    }

    const severityRank = {
      Low: 1,
      Medium: 2,
      High: 3,
      Critical: 4,
    };

    if (
      severityRank[visibleSeverity] >
      severityRank[priority]
    ) {
      priority = visibleSeverity;
    }
  }

  // -------------------------------------------------------
  // VALID IMAGE
  // -------------------------------------------------------

  const validImage =
    isWaste &&
    confidence >= MIN_CONFIDENCE &&
    ALLOWED_WASTE_TYPES.includes(
      wasteType
    );

  // -------------------------------------------------------
  // MESSAGE
  // -------------------------------------------------------

  const message =
    safeString(result?.message) ||
    (
      isWaste
        ? `AI detected ${wasteType} with ${visibleSeverity} severity.`
        : reason
    );

  // -------------------------------------------------------
  // FINAL RESULT
  // -------------------------------------------------------

  return {
    isWaste,

    validImage,

    wasteDetected: isWaste,

    confidence,

    category,

    wasteType,

    visibleSeverity,

    severity,

    description,

    reason,

    estimatedQuantity,

    hazardDetected,

    roadBlockage,

    prediction,

    recommendedAction,

    riskScore,

    priority,

    message,
  };
};

// =========================================================
// VALIDATE IMAGE INPUT
// =========================================================

const validateImageInput = ({
  buffer,
  mimeType,
}) => {

  if (
    !buffer ||
    !Buffer.isBuffer(buffer) ||
    !buffer.length
  ) {
    throw new Error(
      "Uploaded image is empty."
    );
  }

  if (!mimeType) {
    throw new Error(
      "Image MIME type is missing."
    );
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    !allowedMimeTypes.includes(
      mimeType.toLowerCase()
    )
  ) {
    throw new Error(
      "Unsupported image format. Only JPG, JPEG, PNG and WEBP are allowed."
    );
  }
};

// =========================================================
// MAIN AI ANALYSIS
// =========================================================

const analyzeWasteImage = async ({
  buffer,
  mimeType,
}) => {

  try {

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "🧠 SWACHHLENS AI ANALYSIS"
    );
    console.log(
      "========================================"
    );

    // -----------------------------------------------------
    // API KEY
    // -----------------------------------------------------

    if (!ai) {
      throw new Error(
        "GEMINI_API_KEY is missing in backend .env"
      );
    }

    // -----------------------------------------------------
    // VALIDATE IMAGE
    // -----------------------------------------------------

    validateImageInput({
      buffer,
      mimeType,
    });

    // =====================================================
    // TEST MODE
    // =====================================================

    if (
      process.env.AI_TEST_MODE === "true"
    ) {

      console.log(
        "🧪 AI TEST MODE ENABLED — Gemini request skipped."
      );

      const testResult = {
        isWaste: true,
        validImage: true,
        wasteDetected: true,

        wasteType: "Plastic Waste",
        category: "Plastic Waste",

        visibleSeverity: "High",
        severity: "High",

        confidence: 0.92,

        estimatedQuantity:
          "Moderate amount",

        hazardDetected: false,

        roadBlockage: true,

        prediction:
          "May obstruct public movement and worsen sanitation conditions.",

        recommendedAction:
          "Deploy a sanitation team for waste removal.",

        riskScore: 72,

        priority: "High",

        description:
          "Visible plastic waste accumulation detected.",

        reason:
          "The image visibly contains accumulated plastic waste.",

        message:
          "TEST MODE: Waste situation detected successfully.",
      };

      console.log(
        "🧪 TEST AI RESULT:",
        testResult
      );

      const finalTestResult =
        normalizeAIResult(
          testResult
        );

      console.log(
        "✅ TEST AI ANALYSIS COMPLETE"
      );

      return finalTestResult;
    }

    // =====================================================
    // BASE64 IMAGE
    // =====================================================

    const base64Image =
      buffer.toString("base64");

    // =====================================================
    // GEMINI REQUEST
    // =====================================================

    console.log(
      "🚀 Sending image to Gemini..."
    );

    const response =
      await ai.models.generateContent({

        model: GEMINI_MODEL,

        contents: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: AI_PROMPT,
          },
        ],

        config: {
          responseMimeType:
            "application/json",

          responseSchema,
        },
      });

    console.log(
      "✅ Gemini response received."
    );

    // =====================================================
    // GET GEMINI TEXT
    // =====================================================

    let text = "";

    try {

      // New @google/genai SDK normally exposes response.text
      if (
        typeof response?.text === "function"
      ) {

        text =
          response.text();

      } else {

        text =
          response?.text || "";

      }

    } catch (textError) {

      console.error(
        "❌ Could not read Gemini response text:",
        textError
      );

      throw new Error(
        "Unable to read Gemini AI response."
      );
    }

    text =
      String(text || "").trim();

    console.log(
      "🤖 RAW GEMINI RESPONSE:"
    );

    console.log(
      text
    );

    // =====================================================
    // EMPTY RESPONSE
    // =====================================================

    if (!text) {

      console.error(
        "❌ Gemini returned empty response."
      );

      console.error(
        "Gemini response object:",
        response
      );

      throw new Error(
        "AI returned an empty response."
      );
    }

    // =====================================================
    // CLEAN JSON
    // =====================================================

    text =
      cleanJSON(text);

    console.log(
      "🧹 CLEANED AI JSON:"
    );

    console.log(
      text
    );

    // =====================================================
    // PARSE JSON
    // =====================================================

    let result;

    try {

      result =
        JSON.parse(text);

    } catch (parseError) {

      console.error(
        "❌ Invalid AI JSON:"
      );

      console.error(
        text
      );

      console.error(
        "JSON Parse Error:",
        parseError
      );

      throw new Error(
        "AI image analysis returned invalid JSON."
      );
    }

    // =====================================================
    // NORMALIZE
    // =====================================================

    const finalResult =
      normalizeAIResult(result);

    // =====================================================
    // LOG RESULT
    // =====================================================

    console.log(
      "========================================"
    );

    console.log(
      "✅ AI ANALYSIS COMPLETE"
    );

    console.log(
      "♻️ Waste:",
      finalResult.isWaste
    );

    console.log(
      "♻️ Detected:",
      finalResult.wasteDetected
    );

    console.log(
      "♻️ Type:",
      finalResult.wasteType
    );

    console.log(
      "📂 Category:",
      finalResult.category
    );

    console.log(
      "⚠️ Severity:",
      finalResult.visibleSeverity
    );

    console.log(
      "🎯 Confidence:",
      finalResult.confidence
    );

    console.log(
      "📦 Quantity:",
      finalResult.estimatedQuantity
    );

    console.log(
      "☣️ Hazard:",
      finalResult.hazardDetected
    );

    console.log(
      "🚧 Road Blockage:",
      finalResult.roadBlockage
    );

    console.log(
      "📊 Risk:",
      finalResult.riskScore
    );

    console.log(
      "🚨 Priority:",
      finalResult.priority
    );

    console.log(
      "========================================"
    );

    return finalResult;

  } catch (error) {

    console.error(
      "❌ AI Waste Analysis Error:",
      error
    );

    throw error;
  }
};

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  analyzeWasteImage,

  normalizeAIResult,

  createDefaultResult,

  ALLOWED_WASTE_TYPES,

  ALLOWED_SEVERITIES,
};