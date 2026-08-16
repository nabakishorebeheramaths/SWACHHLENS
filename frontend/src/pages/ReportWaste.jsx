import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportWaste.css";

import {
  getStates,
  getDistricts,
  getBlocks,
  getVillages,
} from "../services/api";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";
// =====================================================
// INITIAL CITIZEN SITUATION
// =====================================================

const INITIAL_CITIZEN_SITUATION = {
  nearWasteLocation: "",
  affectingDailyLife: "",
  blockingPublicSpace: "",
  sanitationProblem: "",
  longTermProblem: "",
  urgentAttention: "",
  canProvideInformation: "",
};

// =====================================================
// COMPONENT
// =====================================================

function ReportWaste() {
  const navigate = useNavigate();

  // =====================================================
// DIRECT ACCESS GUARD
// MONGODB CITIZEN VERIFICATION CHECK
// =====================================================

useEffect(() => {
  const verifyCitizenFromMongoDB = async () => {
    try {
      // =================================================
      // HOME JOURNEY CHECK
      // =================================================

      const homeStarted =
        sessionStorage.getItem(
          "swachhlensHomeStarted"
        );

      if (homeStarted !== "true") {
        sessionStorage.removeItem(
          "swachhlens_incident_completed"
        );

        navigate("/citizen-details", {
          replace: true,
        });

        return;
      }

      // =================================================
      // GET CITIZEN EMAIL
      // =================================================

      let email =
        sessionStorage.getItem(
          "swachhlens_citizen_email"
        );

      // =================================================
      // FALLBACK:
      // GET EMAIL FROM SAVED CITIZEN OBJECT
      // =================================================

      if (!email?.trim()) {
        const savedCitizen =
          sessionStorage.getItem(
            "swachhlens_citizen"
          );

        if (savedCitizen) {
          try {
            const parsedCitizen =
              JSON.parse(savedCitizen);

            email =
              parsedCitizen?.email || "";
          } catch (parseError) {
            console.warn(
              "⚠️ Could not parse saved citizen data:",
              parseError
            );
          }
        }
      }

      // =================================================
      // EMAIL REQUIRED
      // =================================================

      if (!email?.trim()) {
        console.warn(
          "❌ No citizen email found in sessionStorage."
        );

        sessionStorage.removeItem(
          "swachhlens_incident_completed"
        );

        navigate("/citizen-details", {
          replace: true,
        });

        return;
      }

      // =================================================
      // NORMALIZE EMAIL
      // =================================================

      email =
        email.trim().toLowerCase();

      // =================================================
      // KEEP EMAIL IN SESSION STORAGE
      // =================================================

      sessionStorage.setItem(
        "swachhlens_citizen_email",
        email
      );

      // =================================================
      // CHECK MONGODB
      // =================================================

      console.log(
        "========================================"
      );

      console.log(
        "🔍 CHECKING CITIZEN VERIFICATION"
      );

      console.log(
        "📧 Citizen Email:",
        email
      );

      console.log(
        "========================================"
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/citizen/by-email?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      // =================================================
      // RESPONSE JSON
      // =================================================

      const data =
        await response.json();

      console.log(
        "📥 MongoDB Citizen Verification Response:",
        data
      );

      // =================================================
      // SERVER ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to verify citizen."
        );
      }

      // =================================================
      // CITIZEN NOT FOUND
      // =================================================

      if (
        data?.found !== true ||
        !data?.citizen
      ) {
        console.warn(
          "❌ Citizen not found in MongoDB."
        );

        sessionStorage.removeItem(
          "swachhlens_incident_completed"
        );

        navigate("/citizen-details", {
          replace: true,
        });

        return;
      }

      // =================================================
      // EMAIL VERIFICATION CHECK
      // =================================================

      if (
        data.citizen.emailVerified !== true
      ) {
        console.warn(
          "❌ Citizen email is not verified in MongoDB."
        );

        sessionStorage.removeItem(
          "swachhlens_incident_completed"
        );

        navigate("/citizen-details", {
          replace: true,
        });

        return;
      }

      // =================================================
      // MONGODB EMAIL
      // =================================================

      const mongoEmail =
        data.citizen.email
          ?.trim()
          .toLowerCase();

      // =================================================
      // EMAIL MATCH CHECK
      // =================================================

      if (
        !mongoEmail ||
        mongoEmail !== email
      ) {
        console.warn(
          "❌ Citizen email mismatch."
        );

        console.log(
          "Session Email:",
          email
        );

        console.log(
          "MongoDB Email:",
          mongoEmail
        );

        sessionStorage.removeItem(
          "swachhlens_incident_completed"
        );

        navigate("/citizen-details", {
          replace: true,
        });

        return;
      }

      // =================================================
      // CITIZEN VERIFIED
      // =================================================

      console.log(
        "========================================"
      );

      console.log(
        "✅ CITIZEN VERIFIED FROM MONGODB"
      );

      console.log(
        "Citizen ID:",
        data.citizen.citizenId
      );

      console.log(
        "Citizen Email:",
        data.citizen.email
      );

      console.log(
        "Email Verified:",
        data.citizen.emailVerified
      );

      console.log(
        "========================================"
      );

      // =================================================
      // RESTORE LATEST CITIZEN DATA
      // =================================================

      sessionStorage.setItem(
        "swachhlens_citizen",
        JSON.stringify(
          data.citizen
        )
      );

      // =================================================
      // RESTORE VERIFIED EMAIL
      // =================================================

      sessionStorage.setItem(
        "swachhlens_citizen_email",
        data.citizen.email
      );

      // =================================================
      // SYNCHRONIZE LOCAL FLAG
      //
      // MongoDB remains the actual source of truth.
      // =================================================

      sessionStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      // =================================================
      // ACCESS GRANTED
      // =================================================

      console.log(
        "✅ ReportWaste access granted."
      );

    } catch (error) {
      // =================================================
      // ERROR
      // =================================================

      console.error(
        "❌ MongoDB citizen verification failed:",
        error
      );

      sessionStorage.removeItem(
        "swachhlens_incident_completed"
      );

      navigate("/citizen-details", {
        replace: true,
      });
    }
  };

  verifyCitizenFromMongoDB();

}, [navigate]);
  // =====================================================
  // CITIZEN IDENTITY
  // =====================================================

  const [citizen, setCitizen] = useState(null);

  // =====================================================
  // IMAGE
  // =====================================================

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisDone, setAiAnalysisDone] = useState(false);
  const [aiAnalysisMessage, setAiAnalysisMessage] =
    useState("");

  // =====================================================
  // WASTE
  // =====================================================

  const [wasteType, setWasteType] = useState("");
  const [visibleSeverity, setVisibleSeverity] =
    useState("");

  // =====================================================
  // LOCATION
  // =====================================================

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [locality, setLocality] = useState("");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [locationDataLoading, setLocationDataLoading] =
    useState(false);

  // =====================================================
  // GPS
  // =====================================================

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [selectedLocationType, setSelectedLocationType] =
    useState("");

  const [locationSaved, setLocationSaved] =
    useState(false);

  const [manualLocationMessage, setManualLocationMessage] =
    useState("");

  const [
    currentLocationMessage,
    setCurrentLocationMessage,
  ] = useState("");

  // =====================================================
  // CITIZEN SITUATION SAVE STATE
  // =====================================================

  const [citizenSituationSaved, setCitizenSituationSaved] =
    useState(false);

  const [showPageMessage, setShowPageMessage] =
    useState(false);

  // =====================================================
  // DESCRIPTION
  // =====================================================

  const [description, setDescription] = useState("");

  // =====================================================
  // CITIZEN SITUATION
  // =====================================================

  const [citizenSituation, setCitizenSituation] =
    useState(INITIAL_CITIZEN_SITUATION);

  // =====================================================
  // UI
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [stepGuardMessage, setStepGuardMessage] =
    useState("");

  const [reportId, setReportId] = useState("");
  const [reportIdMessage, setReportIdMessage] =
    useState("");

  // =====================================================
  // LOAD CITIZEN DATA
  // =====================================================

  useEffect(() => {
    try {
      const storedCitizen =
        sessionStorage.getItem(
          "swachhlens_citizen"
        );

      if (storedCitizen) {
        setCitizen(JSON.parse(storedCitizen));
      }
    } catch (err) {
      console.error(
        "Unable to read citizen data:",
        err
      );
    }
  }, []);

  // =====================================================
  // LOAD STATES
  // =====================================================

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLocationDataLoading(true);
        setError("");

        const data = await getStates();

        setStates(
          Array.isArray(data?.states)
            ? data.states
            : Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load states:",
          err
        );

        setError(
          "Failed to load states. Please try again."
        );
      } finally {
        setLocationDataLoading(false);
      }
    };

    loadStates();
  }, []);

  // =====================================================
  // CLEAN IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =====================================================
  // STATE → DISTRICTS
  // =====================================================

  const handleStateChange = async (event) => {
    const selectedState = event.target.value;

    setState(selectedState);

    setLocationSaved(false);
    setSelectedLocationType("");

    setManualLocationMessage("");
    setCurrentLocationMessage("");

    setDistrict("");
    setBlock("");
    setLocality("");

    setDistricts([]);
    setBlocks([]);
    setVillages([]);

    setError("");
    setMessage("");

    if (!selectedState) {
      return;
    }

    try {
      setLocationDataLoading(true);

      const data =
        await getDistricts(selectedState);

      const districtList =
        Array.isArray(data?.districts)
          ? data.districts
          : Array.isArray(data)
          ? data
          : [];

      setDistricts(districtList);
    } catch (err) {
      console.error(
        "Failed to load districts:",
        err
      );

      setDistricts([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load districts. Please try again."
      );
    } finally {
      setLocationDataLoading(false);
    }
  };

  // =====================================================
  // DISTRICT → BLOCKS
  // =====================================================

  const handleDistrictChange = async (event) => {
    const selectedDistrict =
      event.target.value;

    setDistrict(selectedDistrict);

    setLocationSaved(false);
    setSelectedLocationType("");

    setManualLocationMessage("");
    setCurrentLocationMessage("");

    setBlock("");
    setLocality("");

    setBlocks([]);
    setVillages([]);

    setError("");
    setMessage("");

    if (!selectedDistrict) {
      return;
    }

    try {
      setLocationDataLoading(true);

      const data = await getBlocks(
        state,
        selectedDistrict
      );

      const blockList =
        Array.isArray(data?.blocks)
          ? data.blocks
          : Array.isArray(data)
          ? data
          : [];

      setBlocks(blockList);
    } catch (err) {
      console.error(
        "Failed to load blocks:",
        err
      );

      setBlocks([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load blocks. Please try again."
      );
    } finally {
      setLocationDataLoading(false);
    }
  };

  // =====================================================
  // BLOCK → VILLAGES
  // =====================================================

  const handleBlockChange = async (event) => {
    const selectedBlock =
      event.target.value;

    setBlock(selectedBlock);

    setLocationSaved(false);
    setSelectedLocationType("");

    setManualLocationMessage("");
    setCurrentLocationMessage("");

    setLocality("");

    setVillages([]);

    setError("");
    setMessage("");

    if (!selectedBlock) {
      return;
    }

    try {
      setLocationDataLoading(true);

      const data = await getVillages(
        state,
        district,
        selectedBlock
      );

      const villageList =
        Array.isArray(data?.villages)
          ? data.villages
          : Array.isArray(data)
          ? data
          : [];

      setVillages(villageList);
    } catch (err) {
      console.error(
        "Failed to load villages:",
        err
      );

      setVillages([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load villages. Please try again."
      );
    } finally {
      setLocationDataLoading(false);
    }
  };

  // =====================================================
// IMAGE CHANGE
// =====================================================

const handleImageChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  // -----------------------------------------------
  // IMAGE TYPE VALIDATION
  // -----------------------------------------------

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError(
      "Please upload a JPG, JPEG, PNG or WEBP image."
    );

    event.target.value = "";
    return;
  }

  // -----------------------------------------------
  // IMAGE SIZE VALIDATION
  // -----------------------------------------------

  const maxSize = 10 * 1024 * 1024; // 10 MB

  if (file.size > maxSize) {
    setError(
      "Image size must be less than 10 MB."
    );

    event.target.value = "";
    return;
  }

  // -----------------------------------------------
  // CLEAN OLD PREVIEW
  // -----------------------------------------------

  if (imagePreview) {
    try {
      URL.revokeObjectURL(imagePreview);
    } catch (error) {
      console.warn(
        "Old image preview cleanup failed:",
        error
      );
    }
  }

  // -----------------------------------------------
  // SET NEW IMAGE
  // -----------------------------------------------

  const previewUrl =
    URL.createObjectURL(file);

  setImageFile(file);
  setImagePreview(previewUrl);

  // -----------------------------------------------
  // RESET AI STATE
  // -----------------------------------------------

  setAiAnalysisDone(false);
  setAiAnalysisMessage("");

  setWasteType("");
  setVisibleSeverity("");

  setError("");
  setMessage("");

  console.log(
    "========================================"
  );

  console.log(
    "🖼️ NEW IMAGE SELECTED"
  );

  console.log(
    "Name:",
    file.name
  );

  console.log(
    "Type:",
    file.type
  );

  console.log(
    "Size:",
    file.size
  );

  console.log(
    "========================================"
  );
};
  // =====================================================
// AI IMAGE ANALYSIS
// =====================================================

const handleAIAnalysis = async () => {
  // ===================================================
  // IMAGE CHECK
  // ===================================================

  if (!imageFile) {
    setError("Please upload an image first.");
    return;
  }

  // ===================================================
  // INITIAL STATE
  // ===================================================

  setAiAnalyzing(true);
  setAiAnalysisDone(false);
  setAiAnalysisMessage("");
  setError("");
  setMessage("");

  let timeoutId = null;

  try {
    // =================================================
    // START MESSAGE
    // =================================================

    setAiAnalysisMessage(
      "🤖 SWACHHLENS AI is starting image analysis..."
    );

    // =================================================
    // FORM DATA
    // =================================================

    const formData = new FormData();

    formData.append("image", imageFile);

    console.log("========================================");
    console.log("🤖 SWACHHLENS AI IMAGE ANALYSIS");
    console.log("========================================");

    console.log("🖼️ Image:", imageFile.name);
    console.log("📦 MIME:", imageFile.type);
    console.log("📏 Size:", imageFile.size);
console.log(
  "🌐 AI URL:",
  `${API_BASE_URL}/api/waste-reports/analyze-image`
);
console.log("📦 ALL FORMDATA:");

for (const [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(
      key,
      "FILE:",
      value.name,
      value.type,
      value.size
    );
  } else {
    console.log(
      key,
      value
    );
  }
}
    // =================================================
    // ABORT CONTROLLER
    // =================================================

    const controller = new AbortController();

    // Gemini ko maximum 2 minutes
    timeoutId = setTimeout(() => {
      controller.abort();
    }, 120000);

    // =================================================
    // ANALYSIS MESSAGE
    // =================================================

    setAiAnalysisMessage(
      "🔍 AI is checking whether this image contains a real waste situation..."
    );

    // =================================================
// API REQUEST
// =================================================

const response = await fetch(
  `${API_BASE_URL}/api/waste-reports/analyze-image`,
  {
    method: "POST",
    body: formData,
    signal: controller.signal,
  }
);

// =================================================
// CLEAR TIMEOUT
// =================================================

if (timeoutId) {
  clearTimeout(timeoutId);
  timeoutId = null;
}

// =================================================
// READ RESPONSE
// =================================================

const responseText = await response.text();

console.log(
  "📥 RAW AI RESPONSE:",
  responseText
);

let data = {};

try {
  data = responseText
    ? JSON.parse(responseText)
    : {};
} catch (parseError) {
  console.error(
    "❌ AI RESPONSE JSON PARSE ERROR:",
    parseError
  );

  throw new Error(
    "AI server returned an invalid response."
  );
}
    console.log(
      "🤖 COMPLETE AI RESPONSE:",
      data
    );

    // =================================================
    // SERVER ERROR
    // =================================================

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `AI analysis failed (${response.status}).`
      );
    }

    // =================================================
    // EXTRACT AI RESULT
    // =================================================

    const validImage =
      data?.validImage === true;

    const wasteDetected =
      data?.wasteDetected === true;

    const confidence =
      Number(data?.confidence) || 0;

    const detectedWasteType =
      data?.wasteType || "";

    const detectedSeverity =
      data?.severity || "";

    const aiMessage =
      data?.message || "";

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "----------------------------------------"
    );

    console.log(
      "🖼️ Valid Image:",
      validImage
    );

    console.log(
      "🗑️ Waste Detected:",
      wasteDetected
    );

    console.log(
      "🗑️ AI Waste Type:",
      detectedWasteType
    );

    console.log(
      "⚠️ AI Severity:",
      detectedSeverity
    );

    console.log(
      "🎯 AI Confidence:",
      confidence
    );

    console.log(
      "💬 AI Message:",
      aiMessage
    );

    console.log(
      "----------------------------------------"
    );

    // =================================================
    // INVALID IMAGE / NO WASTE
    // =================================================

    if (
      !validImage ||
      !wasteDetected
    ) {
      console.warn(
        "❌ AI rejected image."
      );

      // -----------------------------------------------
      // REMOVE PREVIEW URL
      // -----------------------------------------------

      if (imagePreview) {
        try {
          URL.revokeObjectURL(
            imagePreview
          );
        } catch (error) {
          console.warn(
            "Preview URL cleanup failed:",
            error
          );
        }
      }

      // -----------------------------------------------
      // RESET IMAGE
      // -----------------------------------------------

      setImageFile(null);
      setImagePreview(null);

      // -----------------------------------------------
      // RESET AI STATE
      // -----------------------------------------------

      setAiAnalysisDone(false);

      setWasteType("");
      setVisibleSeverity("");

      // -----------------------------------------------
      // MESSAGE
      // -----------------------------------------------

      setAiAnalysisMessage(
        aiMessage ||
          "❌ This image does not appear to show a real waste-related situation. Please upload a clear photo of the waste location."
      );

      setError(
        "Please upload a clear photo of the waste location."
      );

      setMessage("");

      return;
    }

    // =================================================
    // WASTE TYPE NORMALIZATION
    // =================================================

    const wasteTypeMap = {
      "mixed waste": "Mixed Waste",

      "plastic waste": "Plastic Waste",

      "organic waste": "Organic Waste",

      "construction waste":
        "Construction Waste",

      "electronic waste":
        "Electronic Waste",

      "e-waste":
        "Electronic Waste",

      "hazardous waste":
        "Hazardous Waste",

      other: "Other",
    };

    const normalizedWasteType =
      wasteTypeMap[
        String(
          detectedWasteType
        )
          .trim()
          .toLowerCase()
      ] || "";

    // =================================================
    // SEVERITY NORMALIZATION
    // =================================================

    const severityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };

    const normalizedSeverity =
      severityMap[
        String(
          detectedSeverity
        )
          .trim()
          .toLowerCase()
      ] || "";

    // =================================================
    // VALID WASTE TYPE CHECK
    // =================================================

    const allowedWasteTypes = [
      "Mixed Waste",
      "Plastic Waste",
      "Organic Waste",
      "Construction Waste",
      "Electronic Waste",
      "Hazardous Waste",
      "Other",
    ];

    const finalWasteType =
      allowedWasteTypes.includes(
        normalizedWasteType
      )
        ? normalizedWasteType
        : "";

    // =================================================
    // VALID SEVERITY CHECK
    // =================================================

    const allowedSeverities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    const finalSeverity =
      allowedSeverities.includes(
        normalizedSeverity
      )
        ? normalizedSeverity
        : "";

    // =================================================
    // AUTO-FILL WASTE TYPE
    // =================================================

    if (finalWasteType) {
      setWasteType(
        finalWasteType
      );

      console.log(
        "✅ Waste Type AUTO-FILLED:",
        finalWasteType
      );
    } else {
      console.warn(
        "⚠️ AI returned invalid waste type:",
        detectedWasteType
      );
    }

    // =================================================
    // AUTO-FILL SEVERITY
    // =================================================

    if (finalSeverity) {
      setVisibleSeverity(
        finalSeverity
      );

      console.log(
        "✅ Severity AUTO-FILLED:",
        finalSeverity
      );
    } else {
      console.warn(
        "⚠️ AI returned invalid severity:",
        detectedSeverity
      );
    }

    // =================================================
    // AI ANALYSIS COMPLETE
    // =================================================

    setAiAnalysisDone(true);

    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    if (
      finalWasteType &&
      finalSeverity
    ) {
      setAiAnalysisMessage(
        `✅ AI analysis completed successfully. Detected ${finalWasteType} with ${finalSeverity} severity.`
      );
    } else if (
      finalWasteType
    ) {
      setAiAnalysisMessage(
        `✅ AI detected ${finalWasteType}. Please select the severity manually.`
      );
    } else if (
      finalSeverity
    ) {
      setAiAnalysisMessage(
        `✅ AI detected ${finalSeverity} severity. Please select the waste type manually.`
      );
    } else {
      setAiAnalysisMessage(
        "✅ AI analysis completed. Please verify the waste type and severity manually."
      );
    }

    // =================================================
    // GENERAL SUCCESS MESSAGE
    // =================================================

    setMessage(
      "🤖 AI image analysis completed successfully."
    );

    setError("");

    console.log(
      "========================================"
    );

    console.log(
      "✅ AI ANALYSIS FINISHED SUCCESSFULLY"
    );

    console.log(
      "========================================"
    );

  } catch (error) {
    // =================================================
    // CLEAR TIMEOUT
    // =================================================

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // =================================================
    // LOG ERROR
    // =================================================

    console.error(
      "❌ AI IMAGE ANALYSIS ERROR:",
      error
    );

    // =================================================
    // TIMEOUT
    // =================================================

    if (
      error?.name ===
      "AbortError"
    ) {
      setAiAnalysisDone(false);

      setAiAnalysisMessage(
        "⏱️ AI analysis is taking too long. The AI server did not respond within 2 minutes."
      );

      setError(
        "AI analysis timed out. Please check that the backend AI service is running and try again."
      );

      return;
    }

    // =================================================
    // NORMAL ERROR
    // =================================================

    setAiAnalysisDone(false);

    setAiAnalysisMessage("");

    setError(
      error?.message ||
        "Unable to analyze the image. Please try again."
    );

    setMessage("");

  } finally {
    // =================================================
    // FINAL CLEANUP
    // =================================================

    setAiAnalyzing(false);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
};

  // =====================================================
  // NORMALIZE LOCATION NAME
  // =====================================================

  const normalizeLocationName = (
    value
  ) => {
    if (!value) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(
        /[.,'’"`-]/g,
        ""
      );
  };

  // =====================================================
  // FIND MATCHING LOCATION
  // =====================================================

  const findMatchingLocation = (
    list,
    detectedValue
  ) => {
    if (
      !Array.isArray(list) ||
      !detectedValue
    ) {
      return "";
    }

    const normalizedDetected =
      normalizeLocationName(
        detectedValue
      );

    // Exact match
    const exactMatch =
      list.find(
        (item) =>
          normalizeLocationName(
            item
          ) ===
          normalizedDetected
      );

    if (exactMatch) {
      return exactMatch;
    }

    // Partial match
    const partialMatch =
      list.find((item) => {
        const normalizedItem =
          normalizeLocationName(
            item
          );

        return (
          normalizedItem.includes(
            normalizedDetected
          ) ||
          normalizedDetected.includes(
            normalizedItem
          )
        );
      });

    return partialMatch || "";
  };
  // =====================================================
  // CHOOSE / SAVE WASTE LOCATION
  // =====================================================

  const handleChooseLocation = (
    type
  ) => {
    // ===================================================
    // MANUAL LOCATION
    // ===================================================

    if (type === "manual") {
      if (
        !state ||
        !district ||
        !block ||
        !locality
      ) {
        setLocationSaved(false);
        setSelectedLocationType("");

        setManualLocationMessage(
          "Please choose State, District, Block and Village first."
        );

        return;
      }

      setManualLocationMessage("");
      setCurrentLocationMessage("");

      setSelectedLocationType(
        "manual"
      );

      setLocationSaved(true);

      setMessage("");
      setError("");

      return;
    }

    // ===================================================
// CURRENT GPS LOCATION
// ===================================================

if (type === "current") {

  // -------------------------------------------------
  // GPS OBJECT REQUIRED
  // -------------------------------------------------

  if (!currentLocation) {
    setLocationSaved(false);
    setSelectedLocationType("");

    setCurrentLocationMessage(
      "Please get your current location first."
    );

    return;
  }

  // -------------------------------------------------
  // RESET MESSAGES
  // -------------------------------------------------

  setManualLocationMessage("");
  setCurrentLocationMessage("");
  setError("");

  // -------------------------------------------------
  // DEBUG — GPS LOCATION CONFIRMED BY USER
  // -------------------------------------------------

  console.log(
    "========================================"
  );

  console.log(
    "✅ USER CLICKED: CHOOSE THIS CURRENT LOCATION"
  );

  console.log(
    "📍 CURRENT GPS LOCATION TO SAVE:"
  );

  console.log(
    JSON.stringify(
      currentLocation,
      null,
      2
    )
  );

  console.log(
    "========================================"
  );

  // -------------------------------------------------
  // GPS COORDINATES REQUIRED
  // -------------------------------------------------

  if (
    currentLocation.latitude == null ||
    currentLocation.longitude == null
  ) {
    setLocationSaved(false);
    setSelectedLocationType("");

    setCurrentLocationMessage(
      "GPS coordinates could not be detected. Please try again."
    );

    return;
  }

  // -------------------------------------------------
  // NOW ACTUALLY SAVE / CONFIRM GPS LOCATION
  // -------------------------------------------------

  setSelectedLocationType("current");

  setLocationSaved(true);

  setMessage(
    "📍 Current GPS waste location saved successfully."
  );

  setCurrentLocationMessage("");
  setManualLocationMessage("");
  setError("");

  // -------------------------------------------------
  // FINAL DEBUG
  // -------------------------------------------------

  console.log(
    "========================================"
  );

  console.log(
    "✅ CURRENT GPS LOCATION SAVED"
  );

  console.log(
    "Latitude:",
    currentLocation.latitude
  );

  console.log(
    "Longitude:",
    currentLocation.longitude
  );

  console.log(
    "Accuracy:",
    currentLocation.accuracy
  );

  console.log(
    "Place:",
    currentLocation.name
  );

  console.log(
    "Full Address:",
    currentLocation.fullAddress
  );

  console.log(
    "========================================"
  );

  return;
}
  };
  // =====================================================
  // CURRENT LOCATION
  // GPS → REAL ADDRESS → LOCATION DATABASE MATCH
  // =====================================================

  const handleCurrentLocation = () => {
    // ===================================================
    // RESET PREVIOUS LOCATION SELECTION
    // ===================================================

    setLocationSaved(false);
    setSelectedLocationType("");

    setManualLocationMessage("");
    setCurrentLocationMessage("");

    setMessage("");
    setError("");

    console.log(
      "========================================"
    );

    console.log(
      "📍 CURRENT LOCATION BUTTON CLICKED"
    );

    console.log(
      "Secure context:",
      window.isSecureContext
    );

    console.log(
      "Geolocation:",
      !!navigator.geolocation
    );

    console.log(
      "========================================"
    );

    // ===================================================
    // BROWSER GEOLOCATION CHECK
    // ===================================================

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by this browser."
      );

      return;
    }

    // ===================================================
    // START LOADING
    // ===================================================

    setLocationLoading(true);
    setLocationDataLoading(false);

    setError("");

    setMessage(
      "📍 Requesting your current GPS location..."
    );

    // ===================================================
    // GET CURRENT GPS
    // ===================================================

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        console.log(
          "========================================"
        );

        console.log(
          "📡 REAL GPS RECEIVED"
        );

        console.log(
          "Latitude:",
          latitude
        );

        console.log(
          "Longitude:",
          longitude
        );

        console.log(
          "Accuracy:",
          accuracy
        );

        console.log(
          "========================================"
        );

        try {
          // =================================================
          // REVERSE GEOCODING
          // =================================================

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          // =================================================
          // REVERSE GEOCODING ERROR
          // =================================================

          if (!response.ok) {
            throw new Error(
              "Unable to identify current location."
            );
          }

          // =================================================
          // READ NOMINATIM RESPONSE
          // =================================================

          const data =
            await response.json();

          const address =
            data?.address || {};

          console.log(
            "========================================"
          );

          console.log(
            "🗺️ NOMINATIM ADDRESS RESPONSE"
          );

          console.log(
            "Address:",
            address
          );

          console.log(
            "Display Name:",
            data?.display_name
          );

          console.log(
            "========================================"
          );

          // =================================================
          // REAL STATE
          // =================================================

          const detectedState =
            address.state ||
            address.region ||
            "";

          // =================================================
          // REAL DISTRICT
          // =================================================

          const detectedDistrict =
            address.state_district ||
            address.district ||
            address.county ||
            address.city_district ||
            "";

          // =================================================
          // REAL BLOCK / SUBDISTRICT
          //
          // Different locations use different OSM fields.
          // Therefore use actual returned fields as fallback.
          // =================================================

          const detectedBlock =
            address.block ||
            address.subdistrict ||
            address.subdivision ||
            address.municipality ||
            address.city_district ||
            "";

          // =================================================
          // REAL LOCALITY / VILLAGE
          // =================================================

          const detectedVillage =
            address.village ||
            address.hamlet ||
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            address.town ||
            address.city ||
            address.municipality ||
            address.road ||
            "";

          // =================================================
          // REAL PLACE NAME
          // =================================================

          const locationName =
            address.village ||
            address.hamlet ||
            address.suburb ||
            address.neighbourhood ||
            address.town ||
            address.city ||
            address.municipality ||
            address.road ||
            data?.display_name ||
            `${latitude}, ${longitude}`;

          // =================================================
          // REAL FULL ADDRESS
          // =================================================

          const fullAddress =
            data?.display_name ||
            [
              address.road,
              address.neighbourhood,
              address.suburb,
              address.village,
              address.town,
              address.city,
              address.district,
              address.state,
              address.postcode,
            ]
              .filter(Boolean)
              .join(", ") ||
            `${latitude}, ${longitude}`;

          // =================================================
          // SAVE COMPLETE REAL GPS LOCATION
          // =================================================

          const gpsLocation = {
            // -------------------------------
            // GPS
            // -------------------------------

            latitude,
            longitude,
            accuracy,

            // -------------------------------
            // REAL PLACE
            // -------------------------------

            name:
              locationName,

            // -------------------------------
            // REAL ADMINISTRATIVE DATA
            // -------------------------------

            district:
              detectedDistrict,

            state:
              detectedState,

            block:
              detectedBlock,

            village:
              detectedVillage,

            // -------------------------------
            // COMPLETE REAL ADDRESS
            // -------------------------------

            fullAddress,

            // -------------------------------
            // RAW OSM ADDRESS
            // -------------------------------

            address: {
              ...address,
            },

            // -------------------------------
            // RAW DISPLAY NAME
            // -------------------------------

            displayName:
              data?.display_name ||
              "",
          };

          // =================================================
          // SAVE GPS LOCATION TO STATE
          // =================================================

          // =================================================
// GPS LOCATION DETECTED — NOT SAVED YET
// =================================================

setCurrentLocation(gpsLocation);

// GPS detected only.
// User must click "Choose This Current Location"
// to actually save/confirm it.

setSelectedLocationType("");

setLocationSaved(false);

setCurrentLocationMessage("");
setManualLocationMessage("");

setError("");

setMessage(
  "📍 Current location detected. Click Save Location to confirm."
);

          // =================================================
          // DEBUG
          // =================================================

          console.log(
            "========================================"
          );

          console.log(
            "✅ COMPLETE GPS LOCATION SAVED"
          );

          console.log(
            "GPS:",
            {
              latitude,
              longitude,
              accuracy,
            }
          );

          console.log(
            "State:",
            detectedState
          );

          console.log(
            "District:",
            detectedDistrict
          );

          console.log(
            "Block:",
            detectedBlock
          );

          console.log(
            "Village / Locality:",
            detectedVillage
          );

          console.log(
            "Place:",
            locationName
          );

          console.log(
            "Full Address:",
            fullAddress
          );

          console.log(
            "========================================"
          );

          // =================================================
          // LOCATION DATABASE MATCHING
          //
          // This is ONLY for displaying/filling the
          // dropdowns.
          //
          // It must NOT decide whether GPS is saved.
          // =================================================

          setLocationDataLoading(
            true
          );

          // =================================================
          // STEP 1: MATCH STATE
          // =================================================

          const matchedState =
            findMatchingLocation(
              states,
              detectedState
            );

          if (matchedState) {
            setState(
              matchedState
            );

            // ===============================================
            // LOAD DISTRICTS
            // ===============================================

            try {
              const districtData =
                await getDistricts(
                  matchedState
                );

              const districtList =
                Array.isArray(
                  districtData?.districts
                )
                  ? districtData.districts
                  : Array.isArray(
                      districtData
                    )
                  ? districtData
                  : [];

              setDistricts(
                districtList
              );

              // =============================================
              // MATCH DISTRICT
              // =============================================

              const matchedDistrict =
                findMatchingLocation(
                  districtList,
                  detectedDistrict
                );

              if (matchedDistrict) {
                setDistrict(
                  matchedDistrict
                );

                // ===========================================
                // LOAD BLOCKS
                // ===========================================

                try {
                  const blockData =
                    await getBlocks(
                      matchedState,
                      matchedDistrict
                    );

                  const blockList =
                    Array.isArray(
                      blockData?.blocks
                    )
                      ? blockData.blocks
                      : Array.isArray(
                          blockData
                        )
                      ? blockData
                      : [];

                  setBlocks(
                    blockList
                  );

                  // =========================================
                  // MATCH BLOCK
                  // =========================================

                  const matchedBlock =
                    findMatchingLocation(
                      blockList,
                      detectedBlock
                    );

                  if (matchedBlock) {
                    setBlock(
                      matchedBlock
                    );

                    // =======================================
                    // LOAD VILLAGES
                    // =======================================

                    try {
                      const villageData =
                        await getVillages(
                          matchedState,
                          matchedDistrict,
                          matchedBlock
                        );

                      const villageList =
                        Array.isArray(
                          villageData?.villages
                        )
                          ? villageData.villages
                          : Array.isArray(
                              villageData
                            )
                          ? villageData
                          : [];

                      setVillages(
                        villageList
                      );

                      // =====================================
                      // MATCH VILLAGE
                      // =====================================

                      const matchedVillage =
                        findMatchingLocation(
                          villageList,
                          detectedVillage
                        );

                      if (matchedVillage) {
                        setLocality(
                          matchedVillage
                        );

                        console.log(
                          "✅ GPS village matched:",
                          matchedVillage
                        );
                      } else {
                        // IMPORTANT:
                        // Do not invalidate GPS.
                        //
                        // Keep actual reverse-geocoded
                        // locality available in currentLocation.
                        //
                        // Dropdown remains unmatched.
                        setLocality(
                          detectedVillage
                        );

                        console.log(
                          "ℹ️ GPS village not found in database. Using real reverse-geocoded locality:",
                          detectedVillage
                        );
                      }
                    } catch (villageError) {
                      console.warn(
                        "⚠️ Village database lookup failed:",
                        villageError
                      );

                      // Keep real GPS locality.
                      setLocality(
                        detectedVillage
                      );
                    }
                  } else {
                    // IMPORTANT:
                    // Database block mismatch must NOT
                    // invalidate GPS location.

                    setBlock(
                      detectedBlock
                    );

                    setLocality(
                      detectedVillage
                    );

                    console.log(
                      "ℹ️ GPS block not matched in database. Keeping real reverse-geocoded block."
                    );
                  }
                } catch (blockError) {
                  console.warn(
                    "⚠️ Block database lookup failed:",
                    blockError
                  );

                  setBlock(
                    detectedBlock
                  );

                  setLocality(
                    detectedVillage
                  );
                }
              } else {
                // IMPORTANT:
                // Database district mismatch must NOT
                // invalidate GPS.

                setDistrict(
                  detectedDistrict
                );

                setBlock(
                  detectedBlock
                );

                setLocality(
                  detectedVillage
                );

                console.log(
                  "ℹ️ GPS district not matched in database. Keeping real reverse-geocoded district."
                );
              }
            } catch (districtError) {
              console.warn(
                "⚠️ District database lookup failed:",
                districtError
              );

              setDistrict(
                detectedDistrict
              );

              setBlock(
                detectedBlock
              );

              setLocality(
                detectedVillage
              );
            }
          } else {
            // =================================================
            // STATE NOT MATCHED
            //
            // STILL KEEP REAL GPS DATA.
            // =================================================

            setState(
              detectedState
            );

            setDistrict(
              detectedDistrict
            );

            setBlock(
              detectedBlock
            );

            setLocality(
              detectedVillage
            );

            console.log(
              "ℹ️ GPS state not matched in database. Keeping real reverse-geocoded location."
            );
          }

          
          // =================================================
          // SHOW REAL LOCATION
          // =================================================

          // =================================================
// =================================================
// FINAL GPS DETECTION — NOT SAVED YET
// =================================================

setLocationSaved(false);
setSelectedLocationType("");

setCurrentLocationMessage("");
setManualLocationMessage("");
setError("");

const detectedParts = [
  detectedState,
  detectedDistrict,
  detectedBlock,
  detectedVillage,
].filter(Boolean);

if (detectedParts.length > 0) {
  setMessage(
    `📍 Current location detected: ${detectedParts.join(
      " → "
    )}. Click "Choose This Current Location" to save.`
  );
} else {
  setMessage(
    `📍 GPS location detected: ${latitude.toFixed(
      6
    )}, ${longitude.toFixed(6)}. Click "Choose This Current Location" to save.`
  );
}

          // =================================================
// GPS DETECTED — NOT SAVED YET
// =================================================

setSelectedLocationType("");

setLocationSaved(false);
          setManualLocationMessage(
            ""
          );

          setError("");

         setMessage(
  `📍 GPS location detected: ${latitude.toFixed(
    6
  )}, ${longitude.toFixed(
    6
  )}. Click "Choose This Current Location" to save.`
);

          console.log(
            "========================================"
          );

          console.log(
            "⚠️ REVERSE GEOCODING FAILED"
          );

          console.log(
            "✅ REAL GPS STILL SAVED"
          );

          console.log(
            "Latitude:",
            latitude
          );

          console.log(
            "Longitude:",
            longitude
          );

          console.log(
            "========================================"
          );
        } finally {
          // =================================================
          // STOP LOADING
          // =================================================

          setLocationLoading(
            false
          );

          setLocationDataLoading(
            false
          );
        }
      },

      // =====================================================
      // GEOLOCATION ERROR
      // =====================================================

      (locationError) => {
        console.error(
          "Location error:",
          locationError
        );

        let errorMessage =
          "Unable to access your current location.";

        if (
          locationError.code === 1
        ) {
          errorMessage =
            "Location permission denied. Please allow location access.";
        }

        if (
          locationError.code === 2
        ) {
          errorMessage =
            "Current location is unavailable. Please try again.";
        }

        if (
          locationError.code === 3
        ) {
          errorMessage =
            "Location request timed out. Please try again.";
        }

        setError(
          errorMessage
        );

        setLocationSaved(
          false
        );

        setSelectedLocationType(
          ""
        );

        setLocationLoading(
          false
        );

        setLocationDataLoading(
          false
        );
      },

      // =====================================================
      // GEOLOCATION OPTIONS
      // =====================================================

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };
  // =====================================================
  // CITIZEN SITUATION HANDLER
  // =====================================================

  const handleSituationChange = (
    field,
    value
  ) => {
    setCitizenSituation(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

    // Any answer change means the previous save
    // should be considered outdated.

    setCitizenSituationSaved(
      false
    );

    setError("");
    setMessage("");
  };

  // =====================================================
  // VALIDATE CITIZEN SITUATION
  // =====================================================

  const validateCitizenSituation =
    () => {
      const requiredFields = [
        [
          "nearWasteLocation",
          "Please answer whether you are near the waste location.",
        ],
        [
          "affectingDailyLife",
          "Please answer whether the waste is affecting daily life.",
        ],
        [
          "blockingPublicSpace",
          "Please answer whether the waste is blocking a public space.",
        ],
        [
          "sanitationProblem",
          "Please answer whether there is a sanitation problem.",
        ],
        [
          "longTermProblem",
          "Please answer whether this is a long-term waste problem.",
        ],
        [
          "urgentAttention",
          "Please answer whether the waste requires urgent attention.",
        ],
        [
          "canProvideInformation",
          "Please answer whether you can provide additional information.",
        ],
      ];

      for (const [
        field,
        validationMessage,
      ] of requiredFields) {
        if (
          !citizenSituation[field]
        ) {
          return validationMessage;
        }
      }

      return null;
    };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(null);
    setImagePreview(null);

    setAiAnalyzing(false);
    setAiAnalysisDone(false);
    setAiAnalysisMessage("");

    setWasteType("");
    setVisibleSeverity("");

    setState("");
    setDistrict("");
    setBlock("");
    setLocality("");

    setDistricts([]);
    setBlocks([]);
    setVillages([]);

    setCurrentLocation(null);

    setLocationSaved(false);
    setSelectedLocationType("");

    setManualLocationMessage("");
    setCurrentLocationMessage("");

    setDescription("");

    setCitizenSituation(
      INITIAL_CITIZEN_SITUATION
    );

    setCitizenSituationSaved(
      false
    );

    setMessage("");
    setError("");

    setReportId("");
    setReportIdMessage("");

    sessionStorage.removeItem(
      "swachhlens_report_id"
    );

    sessionStorage.removeItem(
      "swachhlens_latest_report"
    );

    sessionStorage.removeItem(
      "swachhlens_incident_completed"
    );
  };

  // =====================================================
  // SUBMIT REPORT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!imageFile) {
      setError(
        "Please upload a real photo of the waste location."
      );
      return;
    }

    // =================================================
    // AI VALIDATION
    // =================================================

    if (!aiAnalysisDone) {
      setError(
        "Please analyze the uploaded image with AI before submitting the report."
      );
      return;
    }

    if (!wasteType) {
      setError(
        "Please select the waste type."
      );
      return;
    }

    if (!visibleSeverity) {
      setError(
        "Please select the visible severity."
      );
      return;
    }

    // =================================================
    // LOCATION VALIDATION
    // =================================================

    if (!locationSaved) {
  setError(
    "Please choose and save the waste location first."
  );
  return;
}

// =================================================
// MANUAL LOCATION VALIDATION
// =================================================

if (selectedLocationType === "manual") {
  if (!state) {
    setError("Please select the state.");
    return;
  }

  if (!district) {
    setError("Please select the district.");
    return;
  }

  if (!block) {
    setError("Please select the block.");
    return;
  }

  if (!locality.trim()) {
    setError("Please select the village.");
    return;
  }
}

// =================================================
// CURRENT GPS LOCATION VALIDATION
// =================================================

if (selectedLocationType === "current") {
  if (
    !currentLocation ||
    currentLocation.latitude == null ||
    currentLocation.longitude == null
  ) {
    setError(
      "Valid GPS coordinates are required for the current location."
    );
    return;
  }
}
    // =================================================
    // DESCRIPTION VALIDATION
    // =================================================

    if (!description.trim()) {
      setError(
        "Please describe the waste situation."
      );
      return;
    }

    // =================================================
    // CITIZEN SITUATION VALIDATION
    // =================================================

    if (!citizenSituationSaved) {
      setError(
        "Please save the Citizen Situation first."
      );
      return;
    }

    const situationError =
      validateCitizenSituation();

    if (situationError) {
      setError(
        situationError
      );
      return;
    }

    // =================================================
    // START SUBMISSION
    // =================================================

    setLoading(true);

    try {
      // =================================================
      // BUILD FORM DATA
      // =================================================

      const formData =
        new FormData();

      // -------------------------------------------------
      // IMAGE
      // -------------------------------------------------

      formData.append(
        "image",
        imageFile
      );

      // -------------------------------------------------
      // CITIZEN
      // -------------------------------------------------
// =================================================
// VERIFIED CITIZEN EMAIL
// =================================================

const verifiedEmail =
  sessionStorage
    .getItem("swachhlens_citizen_email")
    ?.trim()
    .toLowerCase();

if (!verifiedEmail) {
  throw new Error(
    "Verified citizen email is required."
  );
}

console.log(
  "📧 FINAL VERIFIED EMAIL:",
  verifiedEmail
);

// IMPORTANT:
// Always send the verified email as the
// authoritative citizen email.

formData.append(
  "email",
  verifiedEmail
);

// =================================================
// CITIZEN SNAPSHOT
// =================================================

if (citizen) {
  const citizenSnapshot = {
    ...citizen,

    // IMPORTANT:
    // Never allow stale citizen.email
    // to override the verified email.

    email: verifiedEmail,
  };

  formData.append(
    "citizen",
    JSON.stringify(
      citizenSnapshot
    )
  );
}
      // -------------------------------------------------
      // WASTE
      // -------------------------------------------------

      formData.append(
        "wasteType",
        wasteType
      );

      formData.append(
        "visibleSeverity",
        visibleSeverity
      );
// -------------------------------------------------
// WASTE INCIDENT LOCATION
// -------------------------------------------------

// -------------------------------------------------
// FINAL WASTE INCIDENT LOCATION
// -------------------------------------------------

const isCurrentLocation =
  selectedLocationType === "current";

const wasteLocationData = isCurrentLocation

  ? {
      country: "India",

      // =============================================
      // GPS LOCATION
      // Use GPS reverse-geocoded values
      // with form-state fallback
      // =============================================

      state:
        currentLocation?.state?.trim() ||
        state?.trim() ||
        "",

      district:
        currentLocation?.district?.trim() ||
        district?.trim() ||
        "",

      block:
        currentLocation?.block?.trim() ||
        block?.trim() ||
        "",

      locality:
        currentLocation?.village?.trim() ||
        locality?.trim() ||
        currentLocation?.name?.trim() ||
        "",

      village:
        currentLocation?.village?.trim() ||
        locality?.trim() ||
        "",

      locationType: "current",

      coordinates: {
        latitude:
          currentLocation?.latitude ?? null,

        longitude:
          currentLocation?.longitude ?? null,

        accuracy:
          currentLocation?.accuracy ?? null,
      },

      accuracy:
        currentLocation?.accuracy ?? null,

      gpsDetected: true,

      gpsPlaceName:
        currentLocation?.name?.trim() || "",

      gpsDistrict:
        currentLocation?.district?.trim() ||
        district?.trim() ||
        "",

      gpsState:
        currentLocation?.state?.trim() ||
        state?.trim() ||
        "",

      fullAddress:
        currentLocation?.fullAddress?.trim() || "",
    }
  : {
      // Manual location
      country: "India",

      state:
        state?.trim() || "",

      district:
        district?.trim() || "",

      block:
        block?.trim() || "",

      locality:
        locality?.trim() || "",

      village:
        locality?.trim() || "",

      locationType: "manual",

      coordinates: {
        latitude: null,
        longitude: null,
        accuracy: null,
      },

      accuracy: null,

      gpsDetected: false,

      gpsPlaceName: "",

      gpsDistrict: "",

      gpsState: "",

      fullAddress: "",
    };
// =================================================
// FINAL LOCATION VALIDATION
// =================================================

if (!wasteLocationData.state?.trim()) {
  setLoading(false);
  setError(
    "Waste location state could not be identified. Please detect your current location again."
  );
  return;
}

if (!wasteLocationData.district?.trim()) {
  setLoading(false);
  setError(
    "Waste location district could not be identified. Please detect your current location again."
  );
  return;
}
// -------------------------------------------------
// DEBUG — FINAL LOCATION SENT TO BACKEND
// -------------------------------------------------

console.log(
  "========================================"
);

console.log(
  "📍 FINAL WASTE INCIDENT LOCATION"
);

console.log(
  JSON.stringify(
    wasteLocationData,
    null,
    2
  )
);

console.log(
  "========================================"
);


// -------------------------------------------------
// MAIN LOCATION
// -------------------------------------------------

formData.append(
  "location",
  JSON.stringify(
    wasteLocationData
  )
);

// -------------------------------------------------
// EXPLICIT WASTE LOCATION
// -------------------------------------------------

formData.append(
  "wasteLocation",
  JSON.stringify(
    wasteLocationData
  )
);
// -------------------------------------------------
// DESCRIPTION
// -------------------------------------------------

formData.append(
  "description",
  description.trim()
);
            // -------------------------------------------------
      // CITIZEN SITUATION
      // -------------------------------------------------

      formData.append(
        "citizenSituation",
        JSON.stringify({
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
        })
      );

      // =================================================
      // API REQUEST
      // =================================================

      console.log(
        "🚀 SUBMITTING WASTE REPORT"
      );

      console.log(
        "🖼️ IMAGE FILE:",
        imageFile
      );

      console.log(
        "📦 IMAGE NAME:",
        imageFile?.name
      );

      console.log(
        "📦 IMAGE TYPE:",
        imageFile?.type
      );

      console.log(
        "📦 IMAGE SIZE:",
        imageFile?.size
      );

      console.log(
        "🌐 API URL:",
        `${API_BASE_URL}/api/waste-reports`
      );
console.log(
  "========================================"
);

console.log(
  "📦 FORMDATA BEFORE SUBMIT"
);

for (const [key, value] of formData.entries()) {
  console.log(
    key,
    value instanceof File
      ? {
          fileName: value.name,
          type: value.type,
          size: value.size,
        }
      : value
  );
}

console.log(
  "========================================"
);
      const response =
        await fetch(
          `${API_BASE_URL}/api/waste-reports`,
          {
            method: "POST",
            body: formData,
          }
        );

      // =================================================
      // SAFE RESPONSE PARSING
      // =================================================

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      console.log(
        "📥 SERVER RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to submit waste report."
        );
      }

      // =================================================
      // GET GENERATED REPORT ID
      // =================================================

      let createdReportId =
        "";

      if (data?.reportId) {
        createdReportId =
          String(
            data.reportId
          );
      }

      if (
        data?.report?.reportId
      ) {
        createdReportId =
          String(
            data.report.reportId
          );
      }

      // =================================================
      // REPORT ID VALIDATION
      // =================================================

      if (!createdReportId) {
        throw new Error(
          "Report was created, but Report ID was not returned by the server."
        );
      }

      // =================================================
      // MARK INCIDENT STEP COMPLETE
      // =================================================

      sessionStorage.setItem(
        "swachhlens_incident_completed",
        "true"
      );

      // =================================================
      // SAVE REPORT INFORMATION
      // =================================================

      if (data?.report) {
        sessionStorage.setItem(
          "swachhlens_latest_report",
          JSON.stringify(
            data.report
          )
        );
      }

      // =================================================
      // SAVE REPORT ID
      // =================================================

      sessionStorage.setItem(
        "swachhlens_report_id",
        createdReportId
      );

      setReportId(
        createdReportId
      );

      setReportIdMessage(
        `✅ Report ID ${createdReportId} created successfully. It will be sent to your registered email.`
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      setMessage(
        `✅ Waste report ${createdReportId} submitted successfully.`
      );

      setError("");

      // =================================================
      // IMPORTANT:
      // Do NOT automatically navigate here.
      // User can now click:
      // "Continue to Analysis & Status"
      // =================================================
    } catch (err) {
      console.error(
        "Report submission error:",
        err
      );

      setError(
        err?.message ||
          "Unable to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RADIO GROUP COMPONENT
  // =====================================================

  const YesNoOptions = ({
    name,
    value,
    field,
  }) => (
    <div className="yes-no-options">
      <label className="yes-no-option">
        <input
          type="radio"
          name={name}
          value="Yes"
          checked={
            value === "Yes"
          }
          onChange={(event) =>
            handleSituationChange(
              field,
              event.target.value
            )
          }
        />

        <span>Yes</span>
      </label>

      <label className="yes-no-option">
        <input
          type="radio"
          name={name}
          value="No"
          checked={
            value === "No"
          }
          onChange={(event) =>
            handleSituationChange(
              field,
              event.target.value
            )
          }
        />

        <span>No</span>
      </label>
    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="report-header">

        <span className="report-badge">
          ♻️ CITIZEN WASTE REPORT
        </span>

        <h1 className="rainbow-heading">
          Report a Waste
          <br />
          Problem
        </h1>

        <p>
          Give SWACHHLENS the information it needs
          to understand, assess and prioritize the
          waste situation.
        </p>

      </section>

      {/* =================================================
          PAGE MESSAGE
      ================================================= */}

      {message && (
        <div className="stepguard-message">
          {message}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="report-card"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            IMAGE UPLOAD
        ================================================= */}

        <div className="form-section">

          <label>
            Waste Image
          </label>

          <div className="upload-box">

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Waste preview"
                className="image-preview"
              />
            ) : (
              <>
                <div className="upload-icon">
                  📸
                </div>

                <h3>
                  Upload Waste Image
                </h3>

                <p>
                  Add a clear photo of the
                  waste location.
                </p>
              </>
            )}

            <label className="upload-btn">

              {imagePreview
                ? "Change Image"
                : "Choose Image"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageChange}
                hidden
              />

            </label>

            {/* =================================================
                AI IMAGE ANALYSIS BUTTON
            ================================================= */}

            {imageFile && (
              <div className="ai-image-analysis">

                <button
                  type="button"
                  className="ai-analyze-image-btn"
                  onClick={
                    handleAIAnalysis
                  }
                  disabled={
                    aiAnalyzing ||
                    loading
                  }
                >
                  {aiAnalyzing
  ? "🤖 AI Analyzing... Please Wait"
  : aiAnalysisDone
  ? "✅ AI Analysis Completed"
  : "🤖 Analyze Image with AI"}
                </button>

                {aiAnalyzing && (
                  <p className="ai-analysis-loading">
                    🔍 SWACHHLENS AI is checking whether this
                    image contains a waste-related situation...
                  </p>
                )}

                {aiAnalyzing && (
  <div className="ai-analysis-loading">
    <strong>
      🤖 SWACHHLENS AI is analyzing your image...
    </strong>

    <p>
      🔍 Checking waste presence...
      <br />
      🧠 Identifying waste type...
      <br />
      ⚠️ Estimating visible severity...
      <br />
      ⏳ Please wait. This may take up to 2 minutes.
    </p>
  </div>
)}
              </div>
            )}

          </div>

        </div>

    {/* AI RESULT / MESSAGE */}
    {aiAnalysisMessage && !aiAnalyzing && (
      <div className="ai-analysis-message">
        {aiAnalysisMessage}
      </div>
    )}

        {/* =================================================
            WASTE TYPE + SEVERITY
        ================================================= */}

        <div className="form-grid">

          <div className="form-section">

            <label htmlFor="wasteType">
              Waste Type
            </label>

            <select
              id="wasteType"
              value={wasteType}
              onChange={(event) =>
                setWasteType(
                  event.target.value
                )
              }
              disabled={loading}
            >

              <option value="">
                Select waste type
              </option>

              <option value="Mixed Waste">
                Mixed Waste
              </option>

              <option value="Plastic Waste">
                Plastic Waste
              </option>

              <option value="Organic Waste">
                Organic Waste
              </option>

              <option value="Construction Waste">
                Construction Waste
              </option>

              <option value="Electronic Waste">
                Electronic Waste
              </option>

              <option value="Hazardous Waste">
                Hazardous Waste
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          <div className="form-section">

            <label htmlFor="severity">
              Visible Severity
            </label>

            <select
              id="severity"
              value={
                visibleSeverity
              }
              onChange={(event) =>
                setVisibleSeverity(
                  event.target.value
                )
              }
              disabled={loading}
            >

              <option value="">
                Select severity
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="form-section">

          <label>
            Waste Location
          </label>

          <div className="location-grid">

            {/* COUNTRY */}

            <div className="location-field">

              <label htmlFor="country">
                Country
              </label>

              <select
                id="country"
                value="India"
                disabled
              >

                <option value="India">
                  🇮🇳 India
                </option>

              </select>

            </div>

            {/* STATE */}

            <div className="location-field">

              <label htmlFor="state">
                State
              </label>

              <select
                id="state"
                value={state}
                onChange={
                  handleStateChange
                }
                disabled={
                  locationDataLoading ||
                  loading
                }
              >

                <option value="">
                  {locationDataLoading
                    ? "Loading States..."
                    : "Select State"}
                </option>

                {states.map(
                  (stateName) => (
                    <option
                      key={
                        stateName
                      }
                      value={
                        stateName
                      }
                    >
                      {stateName}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DISTRICT */}

            <div className="location-field">

              <label htmlFor="district">
                District
              </label>

              <select
                id="district"
                value={district}
                disabled={
                  !state ||
                  locationDataLoading ||
                  loading
                }
                onChange={
                  handleDistrictChange
                }
              >

                <option value="">
                  {state
                    ? "Select District"
                    : "Select State First"}
                </option>

                {districts.map(
                  (
                    districtName
                  ) => (
                    <option
                      key={
                        districtName
                      }
                      value={
                        districtName
                      }
                    >
                      {
                        districtName
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            {/* BLOCK */}

            <div className="location-field">

              <label htmlFor="block">
                Block
              </label>

              <select
                id="block"
                value={block}
                disabled={
                  !district ||
                  locationDataLoading ||
                  loading
                }
                onChange={
                  handleBlockChange
                }
              >

                <option value="">
                  {district
                    ? "Select Block"
                    : "Select District First"}
                </option>

                {blocks.map(
                  (blockName) => (
                    <option
                      key={
                        blockName
                      }
                      value={
                        blockName
                      }
                    >
                      {blockName}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* VILLAGE */}

          <div className="location-field locality-field">

            <label htmlFor="locality">
              Village
            </label>

            <select
              id="locality"
              value={locality}
              disabled={
                !block ||
                locationDataLoading ||
                loading
              }
              onChange={(event) => {
                setLocality(
                  event.target.value
                );

                setLocationSaved(
                  false
                );

                setSelectedLocationType(
                  ""
                );

                setManualLocationMessage(
                  ""
                );

                setCurrentLocationMessage(
                  ""
                );
              }}
            >

              <option value="">
                {block
                  ? "Select Village"
                  : "Select Block First"}
              </option>

              {villages.map(
                (villageName) => (
                  <option
                    key={
                      villageName
                    }
                    value={
                      villageName
                    }
                  >
                    {
                      villageName
                    }
                  </option>
                )
              )}

            </select>

          </div>

          {/* =================================================
              SAVE MANUAL LOCATION
          ================================================= */}

          <button
            type="button"
            className="choose-location-btn"
            onClick={() =>
              handleChooseLocation(
                "manual"
              )
            }
            disabled={
              loading ||
              locationLoading
            }
          >
            ✓ Choose This Location
          </button>

          {selectedLocationType ===
          "manual" ? (
            <div className="location-save-message">
              ✅ Manual waste location saved successfully.
            </div>
          ) : manualLocationMessage ? (
            <div className="location-save-message">
              ⚠️{" "}
              {
                manualLocationMessage
              }
            </div>
          ) : null}

          {/* LOCATION LOADING */}

          {locationDataLoading && (
            <div className="location-loading">
              📡 Loading location data...
            </div>
          )}

          {/* =================================================
              CURRENT LOCATION
          ================================================= */}

          <button
            type="button"
            className="current-location-btn"
            onClick={
              handleCurrentLocation
            }
            disabled={
              locationLoading ||
              loading
            }
          >

            {locationLoading
              ? "📡 Detecting Location..."
              : "📍 Use Current Location"}

          </button>

          {/* =================================================
              GPS RESULT
          ================================================= */}

          {currentLocation && (
            <div className="current-location-result">

              <strong>
                📍 Current Location Detected
              </strong>

              <div
                style={{
                  marginTop:
                    "10px",
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: "6px",
                }}
              >

                {currentLocation.name && (
                  <span>
                    📌{" "}
                    <strong>
                      Place:
                    </strong>{" "}
                    {
                      currentLocation.name
                    }
                  </span>
                )}

                {currentLocation.district && (
                  <span>
                    🏙️{" "}
                    <strong>
                      District:
                    </strong>{" "}
                    {
                      currentLocation.district
                    }
                  </span>
                )}

                {currentLocation.state && (
                  <span>
                    🏛️{" "}
                    <strong>
                      State:
                    </strong>{" "}
                    {
                      currentLocation.state
                    }
                  </span>
                )}

                <span>
                  🌐{" "}
                  <strong>
                    Coordinates:
                  </strong>{" "}
                  {Number(
                    currentLocation.latitude
                  ).toFixed(6)}
                  ,{" "}
                  {Number(
                    currentLocation.longitude
                  ).toFixed(6)}
                </span>

                {currentLocation.accuracy && (
                  <span>
                    📏{" "}
                    <strong>
                      Accuracy:
                    </strong>{" "}
                    ±
                    {Math.round(
                      currentLocation.accuracy
                    )}
                    m
                  </span>
                )}

                {currentLocation.fullAddress && (
                  <span
                    style={{
                      marginTop:
                        "4px",
                      fontSize:
                        "0.9rem",
                      opacity:
                        0.8,
                    }}
                  >
                    📍{" "}
                    {
                      currentLocation.fullAddress
                    }
                  </span>
                )}

              </div>

            </div>
          )}

        </div>
{/* =================================================
    CONFIRM CURRENT GPS LOCATION
================================================= */}

<div>
  <button
    type="button"
    className="choose-location-btn current-save-location-btn"
    onClick={() => {
      handleChooseLocation("current");
    }}
    disabled={
      loading ||
      locationLoading ||
      !currentLocation
    }
  >
    ✓ Choose This Current Location
  </button>
</div>

{selectedLocationType === "current" &&
locationSaved ? (
  <div className="location-save-message">
    ✅ Current waste location saved successfully.
  </div>
) : currentLocation ? (
  <div className="location-save-message">
    📍 Current location detected. Click the button above to save it.
  </div>
) : currentLocationMessage ? (
  <div className="location-save-message">
    ⚠️ {currentLocationMessage}
  </div>
) : null}
        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="form-section">

          <label htmlFor="description">
            Describe the Situation
          </label>

          <div className="situation-suggestions">

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Garbage has accumulated at this location and has not been cleared for a long time."
                )
              }
            >
              🗑️ Garbage accumulated
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Waste is scattered around the area and is creating an unhygienic environment."
                )
              }
            >
              🧹 Waste scattered
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Plastic waste is heavily accumulated at this location and is affecting the surrounding area."
                )
              }
            >
              🥤 Plastic waste
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Organic waste is accumulating at this location and may cause bad smell and sanitation problems."
                )
              }
            >
              🍃 Organic waste
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Waste is blocking part of the road or pedestrian pathway and is causing inconvenience to people."
                )
              }
            >
              🚧 Blocking road/path
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Waste has been dumped in an open area and requires proper collection and disposal."
                )
              }
            >
              📍 Open dumping
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "Construction debris and other waste materials have been dumped at this location."
                )
              }
            >
              🏗️ Construction debris
            </button>

            <button
              type="button"
              onClick={() =>
                setDescription(
                  "The waste appears to be hazardous and may require immediate attention and safe handling."
                )
              }
            >
              ⚠️ Hazardous waste
            </button>

          </div>

          <textarea
            id="description"
            rows="5"
            value={
              description
            }
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Select a situation above or describe the waste problem in your own words..."
            disabled={loading}
          />

        </div>

        {/* =================================================
            CITIZEN SITUATION
        ================================================= */}

        <div className="form-section citizen-situation-section">

          <div className="section-heading">

            <div className="section-icon">
              👤
            </div>

            <div>

              <h2>
                Citizen Situation
              </h2>

              <p>
                Help SWACHHLENS understand how this
                waste problem is affecting you and the
                surrounding community.
              </p>

              <p className="odia-section-text">
                ଏହି ଆବର୍ଜନା ସମସ୍ୟା ଆପଣଙ୍କୁ ଏବଂ ଆଖପାଖ
                ଅଞ୍ଚଳର ଲୋକମାନଙ୍କୁ କିପରି ପ୍ରଭାବିତ
                କରୁଛି, ତାହା ବୁଝିବା ପାଇଁ ନିମ୍ନ ପ୍ରଶ୍ନଗୁଡ଼ିକର
                ଉତ୍ତର ଦିଅନ୍ତୁ।
              </p>

            </div>

          </div>

          {/* QUESTION 1 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                1. Are you currently near the reported waste location?
              </h3>

              <p className="question-odia">
                ଆପଣ ବର୍ତ୍ତମାନ ରିପୋର୍ଟ କରାଯାଇଥିବା
                ଆବର୍ଜନା ସ୍ଥାନ ନିକଟରେ ଅଛନ୍ତି କି?
              </p>

            </div>

            <YesNoOptions
              name="nearWasteLocation"
              value={
                citizenSituation.nearWasteLocation
              }
              field="nearWasteLocation"
            />

          </div>

          {/* QUESTION 2 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                2. Is the waste affecting your daily life
                or nearby residents?
              </h3>

              <p className="question-odia">
                ଏହି ଆବର୍ଜନା ଆପଣଙ୍କ ଦୈନନ୍ଦିନ ଜୀବନ କିମ୍ବା
                ଆଖପାଖ ଅଞ୍ଚଳର ବାସିନ୍ଦାମାନଙ୍କୁ ପ୍ରଭାବିତ
                କରୁଛି କି?
              </p>

            </div>

            <YesNoOptions
              name="affectingDailyLife"
              value={
                citizenSituation.affectingDailyLife
              }
              field="affectingDailyLife"
            />

          </div>

          {/* QUESTION 3 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                3. Is the waste blocking a road, pathway,
                entrance, or public space?
              </h3>

              <p className="question-odia">
                ଏହି ଆବର୍ଜନା ରାସ୍ତା, ପଥ, ପ୍ରବେଶ ପଥ କିମ୍ବା
                ସାର୍ବଜନୀନ ସ୍ଥାନକୁ ଅବରୋଧ କରୁଛି କି?
              </p>

            </div>

            <YesNoOptions
              name="blockingPublicSpace"
              value={
                citizenSituation.blockingPublicSpace
              }
              field="blockingPublicSpace"
            />

          </div>

          {/* QUESTION 4 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                4. Is there a bad smell or sanitation
                problem because of the waste?
              </h3>

              <p className="question-odia">
                ଏହି ଆବର୍ଜନା ଯୋଗୁଁ ଦୁର୍ଗନ୍ଧ କିମ୍ବା
                ପରିମଳ ସମସ୍ୟା ହେଉଛି କି?
              </p>

            </div>

            <YesNoOptions
              name="sanitationProblem"
              value={
                citizenSituation.sanitationProblem
              }
              field="sanitationProblem"
            />

          </div>

          {/* QUESTION 5 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                5. Has this waste problem existed for
                more than a few days?
              </h3>

              <p className="question-odia">
                ଏହି ଆବର୍ଜନା ସମସ୍ୟା କିଛି ଦିନରୁ ଅଧିକ
                ସମୟ ଧରି ରହିଛି କି?
              </p>

            </div>

            <YesNoOptions
              name="longTermProblem"
              value={
                citizenSituation.longTermProblem
              }
              field="longTermProblem"
            />

          </div>

          {/* QUESTION 6 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                6. Do you think the waste requires
                urgent attention?
              </h3>

              <p className="question-odia">
                ଆପଣଙ୍କ ମତରେ ଏହି ଆବର୍ଜନା ସମସ୍ୟା ପାଇଁ
                ତୁରନ୍ତ ପଦକ୍ଷେପ ନେବା ଆବଶ୍ୟକ କି?
              </p>

            </div>

            <YesNoOptions
              name="urgentAttention"
              value={
                citizenSituation.urgentAttention
              }
              field="urgentAttention"
            />

          </div>

          {/* QUESTION 7 */}

          <div className="situation-question">

            <div className="question-content">

              <h3>
                7. Can you provide additional information
                if authorities need clarification?
              </h3>

              <p className="question-odia">
                କର୍ତ୍ତୃପକ୍ଷଙ୍କୁ ଅଧିକ ସୂଚନା ଆବଶ୍ୟକ ହେଲେ
                ଆପଣ ଅତିରିକ୍ତ ସୂଚନା ଦେଇପାରିବେ କି?
              </p>

            </div>

            <YesNoOptions
              name="canProvideInformation"
              value={
                citizenSituation.canProvideInformation
              }
              field="canProvideInformation"
            />

          </div>

        </div>

        {/* =================================================
            SAVE CITIZEN SITUATION
        ================================================= */}

        <button
          type="button"
          className="save-situation-btn"
          onClick={() => {
            const situationError =
              validateCitizenSituation();

            if (situationError) {
              setCitizenSituationSaved(
                false
              );

              setMessage("");
              setError(
                situationError
              );

              setShowPageMessage(
                true
              );

              return;
            }

            setCitizenSituationSaved(
              true
            );

            setError("");
            setMessage(
              "✅ Citizen Situation saved successfully."
            );

            setShowPageMessage(
              false
            );
          }}
          disabled={loading}
        >
          {citizenSituationSaved
            ? "✅ Citizen Situation Saved"
            : "💾 Save Citizen Situation"}
        </button>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="location-save-message">
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            AI ANALYSIS
        ================================================= */}

        <div className="ai-analysis-box">

          <div className="ai-icon">
            🤖
          </div>

          <div>

            <h3>
              SWACHHLENS AI Analysis
            </h3>

            <p>
              After submission, SWACHHLENS can
              analyze the incident, calculate a
              waste risk score, assess severity
              and recommend the appropriate
              response.
            </p>

          </div>

        </div>
{/* =================================================
    CREATE REPORT ID
    ALWAYS VISIBLE
================================================= */}

<div className="report-id-action">
  <button
    type="button"
    className="create-report-id-btn"
    onClick={async () => {
      // -----------------------------------------------
      // RESET OLD MESSAGES
      // -----------------------------------------------

      setReportIdMessage("");
      setError("");
      setMessage("");

      // -----------------------------------------------
      // CREATE REPORT
      // Reuse existing complete report submission logic
      // -----------------------------------------------

      await handleSubmit({
        preventDefault: () => {},
      });
    }}
    disabled={loading || aiAnalyzing}
  >
    {loading
      ? "⏳ Creating Report ID..."
      : "🆔 Create Report ID"}
  </button>
</div>

{/* =================================================
    REPORT ID MESSAGE
================================================= */}

{reportIdMessage && (
  <div className="report-id-success-message">
    {reportIdMessage}
  </div>
)}

{/* =================================================
    CONTINUE TO RESPONSE CENTER
================================================= */}

<div className="report-analysis-action">

  <button
    type="button"
    className="continue-analysis-btn"
    onClick={() => {
      const savedReportId =
        sessionStorage.getItem(
          "swachhlens_report_id"
        );

      if (!savedReportId) {
        setError(
          "Report ID has not been created yet."
        );

        setShowPageMessage(
          true
        );

        return;
      }

      navigate(
        "/admin"
      );
    }}
    disabled={loading}
  >
    ➡️ Continue to Response Center
  </button>

</div>
</form>
</main>
  );
}
export default ReportWaste;