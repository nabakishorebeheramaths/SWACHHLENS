
const { GoogleGenAI } = require("@google/genai");

// =========================================================
// GEMINI CONFIG
// =========================================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.6-flash";

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  : null;

console.log(
  "🔑 Gemini API Key:",
  GEMINI_API_KEY
    ? "LOADED"
    : "MISSING"
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

Your job is to inspect the uploaded image and determine whether
it shows a REAL-WORLD WASTE OR GARBAGE PROBLEM.

=========================================================
CORE DECISION
=========================================================

Only classify the image as waste when visible evidence of actual
waste, garbage, litter, dumping, debris, discarded material,
overflowing waste, or a waste-related sanitation problem exists.

If actual waste cannot be confidently identified:

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
DO NOT FALSELY CLASSIFY
=========================================================

Do NOT classify something as waste merely because the image is:

- dirty
- dark
- blurry
- outdoors
- old
- unusual
- low quality
- containing random objects
- showing a normal street
- showing a normal building
- showing people
- showing vehicles

Actual waste must be visually supported.

=========================================================
VALID WASTE EXAMPLES
=========================================================

- garbage piles
- mixed household waste
- plastic waste
- organic waste
- discarded food
- construction debris
- electronic waste
- hazardous waste
- dumped garbage
- overflowing garbage bins
- scattered garbage
- roadside garbage
- waste on streets
- waste blocking roads
- waste blocking pathways
- accumulated garbage
- public waste dumping
- waste collection problems

=========================================================
INVALID IMAGE EXAMPLES
=========================================================

- selfies
- portraits
- people without visible waste
- animals without visible waste
- vehicles without visible waste
- buildings without visible waste
- normal landscapes
- clean roads
- normal streets
- normal food photographs
- documents
- screenshots
- memes
- logos
- cartoons
- drawings
- random unrelated objects
- unrelated photographs

=========================================================
WASTE CATEGORY
=========================================================

If waste is visible, select exactly ONE category:

"Mixed Waste"
"Plastic Waste"
"Organic Waste"
"Construction Waste"
"Electronic Waste"
"Hazardous Waste"
"Other"

If no waste is visible:

category = "Not Waste"
wasteType = ""

Do not invent a category.

=========================================================
VISIBLE SEVERITY
=========================================================

Low:
Small amount of waste with limited visible impact.

Medium:
Moderate amount of waste or noticeable accumulation.

High:
Large accumulation, significant public-space impact,
road/path obstruction, major dumping, or serious visible
sanitation concern.

Critical:
Very severe accumulation, major road blockage,
dangerous/hazardous visible condition, or extremely serious
public/environmental impact.

=========================================================
ESTIMATED QUANTITY
=========================================================

Use ONLY one of:

"Small amount"
"Moderate amount"
"Large amount"
"Very large accumulation"
"Unable to estimate"

Do NOT invent measurements.

Never provide kilograms, tonnes, litres, cubic metres,
or numerical quantities unless they are explicitly visible
and meaningful from the image.

=========================================================
HAZARD DETECTION
=========================================================

hazardDetected = true ONLY when a visible hazardous condition
or hazardous material is reasonably identifiable.

Examples:

- chemicals
- medical waste
- sharp dangerous objects
- visibly dangerous electronic components
- fire-related waste
- toxic-looking containers

Do NOT infer hidden hazards.

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

Otherwise:

roadBlockage = false

=========================================================
PREDICTION
=========================================================

Give one short realistic consequence if the visible waste remains
unresolved.

Examples:

"May attract pests and create sanitation problems."

"May obstruct public movement."

"May worsen roadside pollution."

Do not invent unsupported medical or environmental facts.

=========================================================
RECOMMENDED ACTION
=========================================================

Give one short practical civic response.

Examples:

"Arrange routine waste collection."

"Deploy a sanitation team for roadside cleanup."

"Prioritize immediate removal because public access is blocked."

"Arrange hazardous waste handling."

=========================================================
RISK SCORE
=========================================================

Generate a number from 0 to 100.

Consider ONLY visible evidence.

0-24   = Low
25-49  = Medium
50-74  = High
75-100 = Critical

Possible visible factors:

- amount of waste
- accumulation
- public-space impact
- road/path blockage
- visible hazard
- severity of dumping
- sanitation concern

Do not use hidden assumptions.

=========================================================
CONFIDENCE
=========================================================

confidence must be between 0 and 1.

Use confidence based on how clearly the image supports the
classification.

If waste is uncertain, set isWaste = false.

=========================================================
IMPORTANT RULES
=========================================================

1. isWaste must be true or false.
2. validImage must indicate whether the image is a valid waste image.
3. wasteDetected must be true only when real waste is visible.
4. confidence must be between 0 and 1.
5. If no waste is clearly visible, isWaste must be false.
6. If uncertain, prefer false.
7. Do not invent objects.
8. Do not infer hidden waste.
9. category must exactly match the allowed category.
10. If isWaste is false, category must be "Not Waste".
11. If isWaste is false, wasteType must be "".
12. If isWaste is false, visibleSeverity must be "Low".
13. If isWaste is false, severity must be "Low".
14. If isWaste is false, hazardDetected must be false.
15. If isWaste is false, roadBlockage must be false.
16. If isWaste is false, riskScore must be 0.
17. If isWaste is false, priority must be "Low".
18. Keep description short.
19. Keep reason short.
20. Keep prediction short.
21. Keep recommendedAction short.
22. Do not invent measurements.
23. Return ONLY JSON matching the provided schema.
24. Never return markdown.
25. Never return explanations outside the JSON.
`;

// =========================================================
// JSON CLEANER
// =========================================================

const cleanJSON = (text) => {
  let cleaned =
    String(text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned =
      cleaned.substring(
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

const normalizeCategory = (
  value
) => {
  const categoryMap = {
    "mixed waste":
      "Mixed Waste",

    "plastic waste":
      "Plastic Waste",

    "organic waste":
      "Organic Waste",

    "construction waste":
      "Construction Waste",

    "electronic waste":
      "Electronic Waste",

    "e-waste":
      "Electronic Waste",

    "hazardous waste":
      "Hazardous Waste",

    other:
      "Other",

    "not waste":
      "Not Waste",
  };

  const normalized =
    safeString(value)
      .toLowerCase();

  return (
    categoryMap[normalized] ||
    "Not Waste"
  );
};

// =========================================================
// SEVERITY NORMALIZATION
// =========================================================

const normalizeSeverity = (
  value
) => {
  const severityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const normalized =
    safeString(value)
      .toLowerCase();

  return (
    severityMap[normalized] ||
    "Low"
  );
};

// =========================================================
// QUANTITY NORMALIZATION
// =========================================================

const normalizeQuantity = (
  value
) => {
  const quantity =
    safeString(value);

  if (
    QUANTITY_VALUES.includes(
      quantity
    )
  ) {
    return quantity;
  }

  const lower =
    quantity.toLowerCase();

  if (
    lower.includes("very large")
  ) {
    return "Very large accumulation";
  }

  if (
    lower.includes("large")
  ) {
    return "Large amount";
  }

  if (
    lower.includes("moderate") ||
    lower.includes("medium")
  ) {
    return "Moderate amount";
  }

  if (
    lower.includes("small")
  ) {
    return "Small amount";
  }

  return "Unable to estimate";
};

// =========================================================
// NORMALIZE AI RESULT
// =========================================================

const normalizeAIResult = (
  result
) => {
  // -------------------------------------------------------
  // WASTE DECISION
  // -------------------------------------------------------

  const isWaste =
    result?.isWaste === true ||
    result?.wasteDetected === true;

  // -------------------------------------------------------
  // CONFIDENCE
  // -------------------------------------------------------

  let confidence =
    Number(
      result?.confidence
    );

  if (
    !Number.isFinite(
      confidence
    )
  ) {
    confidence = 0;
  }

  confidence =
    Math.max(
      0,
      Math.min(
        1,
        confidence
      )
    );

  // -------------------------------------------------------
  // CATEGORY
  // -------------------------------------------------------

  let category =
    normalizeCategory(
      result?.category ||
      result?.wasteType
    );

  if (!isWaste) {
    category =
      "Not Waste";
  }

  // -------------------------------------------------------
  // WASTE TYPE
  // -------------------------------------------------------

  const wasteType =
    isWaste &&
    ALLOWED_WASTE_TYPES.includes(
      category
    )
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
    visibleSeverity =
      "Low";
  }

  const severity =
    isWaste
      ? visibleSeverity
      : "Low";

  // -------------------------------------------------------
  // DESCRIPTION
  // -------------------------------------------------------

  const description =
    safeString(
      result?.description
    );

  // -------------------------------------------------------
  // REASON
  // -------------------------------------------------------

  const reason =
    safeString(
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

  const prediction =
    safeString(
      result?.prediction
    );

  // -------------------------------------------------------
  // RECOMMENDED ACTION
  // -------------------------------------------------------

  const recommendedAction =
    safeString(
      result?.recommendedAction
    );

  // -------------------------------------------------------
  // RISK SCORE
  // -------------------------------------------------------

  let riskScore =
    Number(
      result?.riskScore
    );

  if (
    !Number.isFinite(
      riskScore
    )
  ) {
    riskScore = 0;
  }

  riskScore =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          riskScore
        )
      )
    );

  if (!isWaste) {
    riskScore = 0;
  }

  // -------------------------------------------------------
  // PRIORITY
  // -------------------------------------------------------

  let priority =
    normalizeSeverity(
      result?.priority ||
      visibleSeverity
    );

  if (!isWaste) {
    priority = "Low";
  }

  // -------------------------------------------------------
  // RISK BASED PRIORITY
  // -------------------------------------------------------

  if (isWaste) {
    if (
      riskScore >= 75
    ) {
      priority =
        "Critical";
    } else if (
      riskScore >= 50
    ) {
      priority =
        "High";
    } else if (
      riskScore >= 25
    ) {
      priority =
        "Medium";
    } else {
      priority =
        "Low";
    }

    // -----------------------------------------------------
    // MANUAL / VISIBLE SEVERITY PROTECTION
    // -----------------------------------------------------

    const severityRank = {
      Low: 1,
      Medium: 2,
      High: 3,
      Critical: 4,
    };

    if (
      severityRank[
        visibleSeverity
      ] >
      severityRank[
        priority
      ]
    ) {
      priority =
        visibleSeverity;
    }
  }

  // -------------------------------------------------------
  // VALID IMAGE
  // -------------------------------------------------------

  const validImage =
    isWaste &&
    confidence >=
      MIN_CONFIDENCE &&
    ALLOWED_WASTE_TYPES.includes(
      wasteType
    );

  // -------------------------------------------------------
  // MESSAGE
  // -------------------------------------------------------

  const message =
    safeString(
      result?.message
    ) ||
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

    wasteDetected:
      isWaste,

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
// VALIDATE INPUT
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
// MAIN ANALYSIS FUNCTION
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

    // -------------------------------------------------------
    // API KEY
    // -------------------------------------------------------

    if (!ai) {
      throw new Error(
        "GEMINI_API_KEY is missing in backend .env"
      );
    }

    // -------------------------------------------------------
    // VALIDATE IMAGE
    // -------------------------------------------------------

    validateImageInput({
      buffer,
      mimeType,
    });

    console.log(
      "🖼️ MIME:",
      mimeType
    );

    console.log(
      "📦 Image size:",
      buffer.length,
      "bytes"
    );

    // -------------------------------------------------------
    // BASE64
    // -------------------------------------------------------

    const base64Image =
      buffer.toString(
        "base64"
      );

    // -------------------------------------------------------
    // GEMINI REQUEST
    // -------------------------------------------------------

    console.log(
      "🔄 Sending image to Gemini..."
    );

    const response =
      await ai.models.generateContent({
        model:
          GEMINI_MODEL,

        contents: [
          {
            role: "user",

            parts: [
              {
                inlineData: {
                  mimeType,
                  data:
                    base64Image,
                },
              },

              {
                text:
                  AI_PROMPT,
              },
            ],
          },
        ],

        config: {
          responseMimeType:
            "application/json",

          responseSchema,

          temperature: 0.1,

          maxOutputTokens:
            1200,
        },
      });

    console.log(
      "✅ Gemini response received"
    );

    // -------------------------------------------------------
    // RESPONSE TEXT
    // -------------------------------------------------------

    let text =
      response?.text ||
      "";

    if (
      typeof text ===
      "function"
    ) {
      text =
        response.text();
    }

    text =
      String(
        text || ""
      ).trim();

    console.log(
      "🤖 RAW GEMINI RESPONSE:"
    );

    console.log(
      text
    );

    // -------------------------------------------------------
    // EMPTY RESPONSE
    // -------------------------------------------------------

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

    // -------------------------------------------------------
    // CLEAN JSON
    // -------------------------------------------------------

    text =
      cleanJSON(
        text
      );

    // -------------------------------------------------------
    // PARSE JSON
    // -------------------------------------------------------

    let result;

    try {
      result =
        JSON.parse(
          text
        );
    } catch (error) {
      console.error(
        "❌ Invalid AI JSON:"
      );

      console.error(
        text
      );

      throw new Error(
        "AI image analysis returned invalid JSON."
      );
    }

    // -------------------------------------------------------
    // NORMALIZE
    // -------------------------------------------------------

    const finalResult =
      normalizeAIResult(
        result
      );

    // -------------------------------------------------------
    // LOG RESULT
    // -------------------------------------------------------

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
