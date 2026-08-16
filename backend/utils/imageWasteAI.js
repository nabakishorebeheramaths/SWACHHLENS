const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

// =========================================================
// GEMINI AI
// =========================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =========================================================
// ANALYZE WASTE IMAGE
// =========================================================

const analyzeWasteImage = async (
  filePath,
  mimeType
) => {
  // -------------------------------------------------------
  // CHECK API KEY
  // -------------------------------------------------------

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing in backend .env"
    );
  }

  // -------------------------------------------------------
  // CHECK FILE
  // -------------------------------------------------------

  if (!filePath) {
    throw new Error(
      "Image file path is missing."
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      "Uploaded image file was not found."
    );
  }

  // -------------------------------------------------------
  // READ IMAGE
  // -------------------------------------------------------

  const imageBuffer =
    fs.readFileSync(filePath);

  const base64Image =
    imageBuffer.toString("base64");

  // -------------------------------------------------------
  // AI PROMPT
  // -------------------------------------------------------

  const prompt = `
You are the image intelligence AI for SWACHHLENS,
an intelligent citizen waste reporting system.

Your job is to analyze the uploaded image and determine
whether it shows a REAL-WORLD WASTE OR GARBAGE PROBLEM.

=========================================================
VALID WASTE IMAGES
=========================================================

Examples:

- garbage piles
- mixed household waste
- plastic waste
- organic waste
- construction debris
- electronic waste
- hazardous waste
- dumped garbage
- overflowing garbage bins
- scattered garbage
- roadside garbage
- waste blocking roads
- waste blocking pathways
- accumulated garbage
- dirty waste dumping locations

=========================================================
INVALID IMAGES
=========================================================

Examples:

- selfies
- portraits
- people without visible waste
- animals without visible waste
- vehicles without visible waste
- buildings without visible waste
- normal landscapes
- clean roads
- food photos without waste
- documents
- screenshots
- memes
- logos
- cartoons
- random unrelated objects
- unrelated photographs

=========================================================
IMPORTANT
=========================================================

Do NOT assume something is waste simply because
the image is dirty, dark, blurry or unclear.

There must be visible evidence of waste.

If waste is uncertain or unrelated,
classify the image as invalid.

=========================================================
WASTE TYPE
=========================================================

If the image is a valid waste image, choose EXACTLY
ONE of these categories:

- Mixed Waste
- Plastic Waste
- Organic Waste
- Construction Waste
- Electronic Waste
- Hazardous Waste
- Other

=========================================================
VISIBLE SEVERITY
=========================================================

Estimate the visible severity based ONLY on what
can be seen in the image.

Choose EXACTLY ONE:

- Low
- Medium
- High
- Critical

Use these guidelines:

Low:
Small amount of waste with limited visible impact.

Medium:
Noticeable accumulation or scattered waste affecting
the immediate surroundings.

High:
Large accumulation, significant obstruction,
overflowing waste, or clearly serious sanitation impact.

Critical:
Extremely large accumulation, major road/path blockage,
strong visible hazard, dangerous waste, or severe public
health/environmental risk.

Do NOT infer severity from information that is not visible.

=========================================================
RETURN FORMAT
=========================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "isWaste": true,
  "confidence": 0.95,
  "wasteType": "Plastic Waste",
  "visibleSeverity": "High",
  "description": "Large amount of plastic waste accumulated beside the road.",
  "reason": "Clearly visible plastic waste is accumulated in the area."
}

=========================================================
RULES
=========================================================

1. isWaste must be true or false.

2. confidence must be a number between 0 and 1.

3. If waste is not clearly visible,
   isWaste must be false.

4. If isWaste is false:
   wasteType must be ""
   visibleSeverity must be ""

5. If isWaste is true:
   wasteType must be one of the allowed categories.

6. If isWaste is true:
   visibleSeverity must be one of:
   Low, Medium, High, Critical.

7. Never invent objects.

8. Never assume hidden waste.

9. If uncertain, prefer isWaste = false.

10. Keep description short.

11. Keep reason short.

12. Return JSON only.
`;

  // -------------------------------------------------------
  // GEMINI REQUEST
  // -------------------------------------------------------

  console.log(
    "🤖 Sending image to Gemini AI..."
  );

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    });

  console.log(
    "✅ Gemini response received."
  );

  // -------------------------------------------------------
  // GET AI RESPONSE
  // -------------------------------------------------------

  let text =
    response?.text || "";

  console.log(
    "🤖 Gemini raw response:",
    text
  );

  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // -------------------------------------------------------
  // PARSE JSON
  // -------------------------------------------------------

  let result;

  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error(
      "❌ AI returned invalid JSON:",
      text
    );

    throw new Error(
      "AI image analysis returned an invalid response."
    );
  }

  // -------------------------------------------------------
  // NORMALIZE
  // -------------------------------------------------------

  const allowedWasteTypes = [
    "Mixed Waste",
    "Plastic Waste",
    "Organic Waste",
    "Construction Waste",
    "Electronic Waste",
    "Hazardous Waste",
    "Other",
  ];

  const allowedSeverities = [
    "Low",
    "Medium",
    "High",
    "Critical",
  ];

  const wasteType =
    allowedWasteTypes.includes(
      result?.wasteType
    )
      ? result.wasteType
      : "";

  const visibleSeverity =
    allowedSeverities.includes(
      result?.visibleSeverity
    )
      ? result.visibleSeverity
      : "";

  const normalizedResult = {
    isWaste:
      result?.isWaste === true,

    confidence:
      Math.min(
        1,
        Math.max(
          0,
          Number(
            result?.confidence
          ) || 0
        )
      ),

    wasteType:
      result?.isWaste
        ? wasteType
        : "",

    visibleSeverity:
      result?.isWaste
        ? visibleSeverity
        : "",

    description:
      result?.description || "",

    reason:
      result?.reason || "",
  };

  console.log(
    "🤖 NORMALIZED AI RESULT:",
    normalizedResult
  );

  return normalizedResult;
};

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  analyzeWasteImage,
};