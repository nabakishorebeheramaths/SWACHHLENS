
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CitizenDetails.css";

// =========================================================
// API
// =========================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||   "https://swachhlens-z6ko.onrender.com";

const PROFILE_KEY =
  "swachhlens_verified_citizen";

// =========================================================
// COMPONENT
// =========================================================

function CitizenDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // CITIZEN LOCATION
  // IMPORTANT:
  // NOTHING IS AUTO-SELECTED INITIALLY
  // =========================================================

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [villageLocality, setVillageLocality] =
    useState("");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationSubmitting, setLocationSubmitting] =
    useState(false);

  const [locationSubmitted, setLocationSubmitted] =
    useState(false);

  // =========================================================
  // CITIZEN DETAILS
  // NOTHING IS AUTO-SELECTED
  // =========================================================

  const [isIndianCitizen, setIsIndianCitizen] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [isAbove18, setIsAbove18] =
    useState("");

  // =========================================================
  // VERIFICATION
  // =========================================================

  const [otpSent, setOtpSent] =
    useState(false);

  const [verified, setVerified] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // PREVIOUS VERIFIED USER
  // =========================================================

  const [previouslyVerified, setPreviouslyVerified] =
    useState(false);

  const [savedCitizenFromDB, setSavedCitizenFromDB] =
    useState(null);

  // =========================================================
  // MESSAGES
  // =========================================================

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("error");
  

  // =========================================================
  // MESSAGE HELPERS
  // =========================================================

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("error");
  };

  // =========================================================
  // SAFE SCROLL
  // =========================================================

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  // =========================================================
  // LOAD STATES
  // IMPORTANT:
  // STATES LOAD INTO LIST ONLY.
  // STATE VALUE REMAINS EMPTY.
  // =========================================================

  const fetchLocationList = async (url) => {
    const response = await fetch(url);

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Invalid response from location server."
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load location data."
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    return (
      data.items ||
      data.locations ||
      data.states ||
      data.districts ||
      data.blocks ||
      data.villages ||
      []
    );
  };

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLocationLoading(true);

        const list = await fetchLocationList(
          `${API_BASE}/api/locations/states`
        );

        setStates(list);
      } catch (error) {
        console.error("States loading error:", error);

        setStates([]);

        showMessage(
          "Unable to load states. Please make sure the location server is running."
        );
      } finally {
        setLocationLoading(false);
      }
    };

    loadStates();
  }, []);

  // =========================================================
  // LOAD DISTRICTS
  // =========================================================

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      try {
        setLocationLoading(true);

        const list = await fetchLocationList(
          `${API_BASE}/api/locations/districts?state=${encodeURIComponent(
            state
          )}`
        );

        setDistricts(list);
      } catch (error) {
        console.error("District loading error:", error);

        setDistricts([]);

        showMessage(
          "Unable to load districts for the selected state."
        );
      } finally {
        setLocationLoading(false);
      }
    };

    loadDistricts();
  }, [state]);

  // =========================================================
  // LOAD BLOCKS
  // =========================================================

  useEffect(() => {
    if (!state || !district) {
      setBlocks([]);
      return;
    }

    const loadBlocks = async () => {
      try {
        setLocationLoading(true);

        const list = await fetchLocationList(
          `${API_BASE}/api/locations/blocks?state=${encodeURIComponent(
            state
          )}&district=${encodeURIComponent(district)}`
        );

        setBlocks(list);
      } catch (error) {
        console.error("Block loading error:", error);

        setBlocks([]);

        showMessage(
          "Unable to load blocks for the selected district."
        );
      } finally {
        setLocationLoading(false);
      }
    };

    loadBlocks();
  }, [state, district]);

  // =========================================================
  // LOAD VILLAGES
  // =========================================================

  useEffect(() => {
    if (!state || !district || !block) {
      setVillages([]);
      return;
    }

    const loadVillages = async () => {
      try {
        setLocationLoading(true);

        const list = await fetchLocationList(
          `${API_BASE}/api/locations/villages?state=${encodeURIComponent(
            state
          )}&district=${encodeURIComponent(
            district
          )}&block=${encodeURIComponent(block)}`
        );

        setVillages(list);
      } catch (error) {
        console.error("Village loading error:", error);

        setVillages([]);

        showMessage(
          "Unable to load villages/localities for the selected block."
        );
      } finally {
        setLocationLoading(false);
      }
    };

    loadVillages();
  }, [state, district, block]);

  // =========================================================
  // RESET ALL LOCATION FIELDS
  // =========================================================

  const clearLocationFields = () => {
  setCountry("");
  setState("");
  setDistrict("");
  setBlock("");
  setVillageLocality("");

  setDistricts([]);
  setBlocks([]);
  setVillages([]);

  setLocationSubmitted(false);
  setSavedCitizenFromDB(null);

  // =======================================================
  // IMPORTANT:
  // LOCATION IS NO LONGER COMPLETE
  // =======================================================

  sessionStorage.removeItem(
    "swachhlens_citizen_location_saved"
  );
};

  // =========================================================
  // RESTORE SAVED LOCATION
  //
  // IMPORTANT:
  // THIS FUNCTION IS CALLED ONLY AFTER EMAIL VERIFICATION.
  //
  // NO LOCATION IS RESTORED ON INITIAL PAGE LOAD.
  // =========================================================
// =========================================================
// RESTORE SAVED LOCATION AFTER EMAIL VERIFICATION
//
// EXISTING USER:
// OTP verified -> MongoDB -> saved location auto-load
//
// NEW USER:
// OTP verified -> MongoDB record not found -> blank location
// =========================================================
// =========================================================
// RESTORE SAVED LOCATION AFTER EMAIL VERIFICATION
//
// EXISTING USER:
// OTP verified -> MongoDB checked -> saved location restored
//
// NEW USER:
// OTP verified -> MongoDB record not found -> blank location
//
// IMPORTANT:
// Location is NEVER restored on initial page load.
// It is restored ONLY after successful OTP verification.
// =========================================================

const restoreSavedLocationAfterVerification = async (
  normalizedEmail
) => {
  try {
    console.log(
      "🔎 Checking saved citizen location from MongoDB:",
      normalizedEmail
    );

    // =======================================================
    // GET VERIFIED CITIZEN FROM MONGODB
    // =======================================================

    const response = await fetch(
      `${API_BASE}/api/citizen/by-email?email=${encodeURIComponent(
        normalizedEmail
      )}`
    );

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "Invalid response from citizen server."
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to check saved citizen location."
      );
    }

    // =======================================================
    // NEW USER
    // No MongoDB citizen record found
    // =======================================================

    if (!data.found || !data.citizen) {
      console.log(
        "🆕 New citizen: no saved citizen record found."
      );

      clearLocationFields();

      setPreviouslyVerified(false);
      setIsAbove18("");
      setSavedCitizenFromDB(null);

      return false;
    }

    // =======================================================
    // EXISTING VERIFIED USER
    // MongoDB record found
    // =======================================================

    const citizen = data.citizen;

    console.log(
      "✅ Existing citizen found in MongoDB:",
      citizen
    );

    // =======================================================
    // SAVE COMPLETE CITIZEN RECORD IN REACT STATE
    // =======================================================

    setSavedCitizenFromDB(citizen);

    // =======================================================
    // RESTORE SAVED LOCATION
    // =======================================================

    setCountry(citizen.country || "");

    setState(citizen.state || "");

    setDistrict(citizen.district || "");

    setBlock(citizen.block || "");

    setVillageLocality(
      citizen.villageLocality || ""
    );

    setIsAbove18(
  citizen.isAbove18 === true
    ? "yes"
    : citizen.isAbove18 === false
    ? "no"
    : ""
);
    setLocationSubmitted(
      citizen.locationSubmitted === true
    );
// =======================================================
// STEP GUARD STATUS
// Existing verified user's saved location is valid
// only when MongoDB confirms locationSubmitted = true.
// =======================================================

if (citizen.locationSubmitted === true) {
  sessionStorage.setItem(
    "swachhlens_citizen_location_saved",
    "true"
  );
} else {
  sessionStorage.removeItem(
    "swachhlens_citizen_location_saved"
  );
}

    // =======================================================
    // EXISTING VERIFIED USER
    // =======================================================

    setPreviouslyVerified(true);

    // =======================================================
    // SAVE VERIFIED PROFILE LOCALLY
    //
    // MongoDB remains the source of truth.
    // localStorage is only a convenience cache.
    // =======================================================

    const citizenProfile = {
      id: citizen.id || citizen._id || null,

      fullName:
        citizen.fullName || fullName.trim(),

      email:
        citizen.email || normalizedEmail,

      emailVerified:
        citizen.emailVerified === true,
isAbove18:
  typeof citizen.isAbove18 === "boolean"
    ? citizen.isAbove18
    : null,
      country:
        citizen.country || "",

      state:
        citizen.state || "",

      stateCode:
        citizen.stateCode || "",

      district:
        citizen.district || "",

      districtCode:
        citizen.districtCode || "",

      block:
        citizen.block || "",

      blockCode:
        citizen.blockCode || "",

      villageLocality:
        citizen.villageLocality || "",

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
    };

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(citizenProfile)
    );

    localStorage.setItem(
      "swachhlens_citizen_name",
      citizenProfile.fullName
    );

    localStorage.setItem(
      "swachhlens_citizen_email",
      citizenProfile.email
    );

    localStorage.setItem(
      "swachhlens_citizen_verified",
      "true"
    );

    console.log(
      "📍 Saved MongoDB citizen location automatically restored:",
      {
        country: citizenProfile.country,
        state: citizenProfile.state,
        district: citizenProfile.district,
        block: citizenProfile.block,
        villageLocality:
          citizenProfile.villageLocality,
        locationSubmitted:
          citizenProfile.locationSubmitted,
      }
    );

    return true;
  } catch (error) {
    console.error(
      "❌ MongoDB saved citizen location restore error:",
      error
    );

    // =======================================================
    // IMPORTANT:
    // MongoDB lookup failed.
    //
    // Do NOT use old localStorage location.
    // Do NOT pretend this is an existing verified user.
    // Keep location blank.
    // =======================================================

    clearLocationFields();

    setPreviouslyVerified(false);
    setSavedCitizenFromDB(null);

    showMessage(
      error.message ||
        "Unable to load your saved citizen location."
    );

    return false;
  }
};
  // =========================================================
  // CITIZENSHIP CHANGE
  // =========================================================

  const handleCitizenChange = (value) => {
    clearMessage();

    setIsIndianCitizen(value);

    // -------------------------------------------------------
    // RESET PERSONAL DETAILS
    // -------------------------------------------------------

    setFullName("");
    setEmail("");
    setOtp("");

    setOtpSent(false);
    setVerified(false);

    setPreviouslyVerified(false);

    // -------------------------------------------------------
    // RESET LOCATION
    // -------------------------------------------------------

    clearLocationFields();

    // -------------------------------------------------------
    // SESSION
    // -------------------------------------------------------

    sessionStorage.removeItem(
      "swachhlens_citizen_verified"
    );

    sessionStorage.removeItem(
      "swachhlens_citizen_name"
    );

    sessionStorage.removeItem(
      "swachhlens_citizen_email"
    );

    sessionStorage.setItem(
      "swachhlens_indian_citizen",
      value
    );
  };

  // =========================================================
  // CHECK PREVIOUS VERIFIED EMAIL
  // =========================================================

  const checkPreviouslyVerifiedEmail = (
    normalizedEmail
  ) => {
    const savedProfile =
      localStorage.getItem(PROFILE_KEY);

    if (!savedProfile) return false;

    try {
      const profile = JSON.parse(savedProfile);

      return Boolean(
        profile.email &&
          profile.email.toLowerCase() ===
            normalizedEmail.toLowerCase() &&
          profile.emailVerified === true
      );
    } catch (error) {
      console.error(
        "Previous verification check error:",
        error
      );

      localStorage.removeItem(PROFILE_KEY);

      return false;
    }
  };

  // =========================================================
  // SEND OTP
  // =========================================================

  const sendOTP = async () => {
    clearMessage();

    if (isIndianCitizen !== "yes") {
      showMessage(
        "Please confirm that you are an Indian citizen."
      );
      return;
    }

    if (!fullName.trim()) {
      showMessage("Please enter your full name.");
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      showMessage(
        "Please enter a valid email address."
      );
      return;
    }

   try {
  setLoading(true);

  // =======================================================
  // CHECK MONGODB FOR PREVIOUSLY VERIFIED CITIZEN
  // =======================================================

  const existingResponse = await fetch(
    `${API_BASE}/api/citizen/by-email?email=${encodeURIComponent(
      normalizedEmail
    )}`
  );

  let existingData;

  try {
    existingData = await existingResponse.json();
  } catch {
    throw new Error(
      "Invalid response from citizen server."
    );
  }

  if (!existingResponse.ok || !existingData.success) {
    throw new Error(
      existingData.message ||
        "Unable to check your previous verification."
    );
  }

  // =======================================================
  // EXISTING VERIFIED USER
  // DO NOT SEND OTP
  // =======================================================

  if (
    existingData.found &&
    existingData.citizen &&
    existingData.citizen.emailVerified === true
  ) {
    const citizen = existingData.citizen;

    console.log(
      "✅ Previously verified citizen found:",
      citizen.email
    );

    setEmail(normalizedEmail);

    setFullName(
      citizen.fullName || fullName.trim()
    );

    setVerified(true);
    setOtpSent(false);
    setOtp("");

    sessionStorage.setItem(
      "swachhlens_citizen_verified",
      "true"
    );

    sessionStorage.setItem(
      "swachhlens_citizen_name",
      citizen.fullName || fullName.trim()
    );

    sessionStorage.setItem(
      "swachhlens_citizen_email",
      normalizedEmail
    );

    sessionStorage.setItem(
      "swachhlens_indian_citizen",
      "yes"
    );

    await restoreSavedLocationAfterVerification(
      normalizedEmail
    );

    setPreviouslyVerified(true);

    showMessage(
      "This email is already verified. Your saved citizen details have been restored.",
      "success"
    );

    return;
  }

  // =======================================================
  // NEW USER
  // CLEAR LOCATION AND SEND OTP
  // =======================================================

  clearLocationFields();

  // =======================================================
  // SEND NEW OTP
  // =======================================================

  const response = await fetch(
    `${API_BASE}/api/otp/send`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from OTP server."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to send OTP. Please try again."
        );
      }

      setEmail(normalizedEmail);
      setOtpSent(true);
      setOtp("");
      setVerified(false);
      setPreviouslyVerified(false);

      showMessage(
        "OTP has been sent to your email address.",
        "success"
      );
    } catch (error) {
      console.error(
        "Email OTP Error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  //
  // IMPORTANT:
  // LOCATION RESTORATION HAPPENS HERE
  // ONLY AFTER SUCCESSFUL VERIFICATION.
  // =========================================================

  const verifyOTP = async () => {
    clearMessage();

    if (!otpSent) {
      showMessage(
        "Please request a new OTP first."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      showMessage(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/api/otp/verify`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: normalizedEmail,
            otp: otp.trim(),
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from OTP server."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "OTP verification failed."
        );
      }

      // -------------------------------------------------------
      // EMAIL VERIFIED
      // -------------------------------------------------------

      setVerified(true);
      setOtpSent(false);
      setOtp("");
      setEmail(normalizedEmail);

      // -------------------------------------------------------
      // SESSION
      // -------------------------------------------------------

      sessionStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      sessionStorage.setItem(
        "swachhlens_citizen_name",
        fullName.trim()
      );

      sessionStorage.setItem(
        "swachhlens_citizen_email",
        normalizedEmail
      );

      sessionStorage.setItem(
        "swachhlens_indian_citizen",
        "yes"
      );

      // -------------------------------------------------------
      // CRITICAL:
      // RESTORE LOCATION ONLY NOW
      // -------------------------------------------------------

      // -------------------------------------------------------
// CRITICAL:
// CHECK MONGODB ONLY AFTER OTP VERIFICATION
//
// Existing user -> auto-fill saved location
// New user      -> location stays blank
// -------------------------------------------------------

const restored =
  await restoreSavedLocationAfterVerification(
    normalizedEmail
  );

if (restored) {
  showMessage(
    "Email verified successfully. Your saved citizen location has been automatically filled.",
    "success"
  );
} else {
  showMessage(
    "Email verified successfully. Please complete your citizen location details.",
    "success"
  );
}
    } catch (error) {
      console.error(
        "Email OTP Verification Error:",
        error
      );

      showMessage(
        error.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EMAIL CHANGE
  //
  // Changing email means previous verification is invalid.
  // Location is cleared.
  // =========================================================

  const handleEmailChange = (value) => {
  setEmail(value);

  setOtpSent(false);
  setOtp("");
  setVerified(false);
  setPreviouslyVerified(false);

  // New email = new verification flow
  setIsAbove18("");

  clearLocationFields();

  clearMessage();
};

  // =========================================================
  // LOCATION CHANGE
  // =========================================================

  const updateCitizenLocation = (
    field,
    value
  ) => {
    clearMessage();

    if (field === "country") {
      setCountry(value);

      setState("");
      setDistrict("");
      setBlock("");
      setVillageLocality("");

      setDistricts([]);
      setBlocks([]);
      setVillages([]);

      setLocationSubmitted(false);

      return;
    }

    if (field === "state") {
      setState(value);

      setDistrict("");
      setBlock("");
      setVillageLocality("");

      setBlocks([]);
      setVillages([]);

      setLocationSubmitted(false);

      return;
    }

    if (field === "district") {
      setDistrict(value);

      setBlock("");
      setVillageLocality("");

      setVillages([]);

      setLocationSubmitted(false);

      return;
    }

    if (field === "block") {
      setBlock(value);

      setVillageLocality("");

      setLocationSubmitted(false);

      return;
    }

    if (field === "villageLocality") {
      setVillageLocality(value);

      setLocationSubmitted(false);
    }
  };

  // =========================================================
  // SUBMIT CITIZEN LOCATION
  // =========================================================

  const submitCitizenLocation = async () => {
    clearMessage();

    if (!verified) {
      showMessage(
        "Please verify your email address first."
      );
      return;
    }

    if (isIndianCitizen !== "yes") {
      showMessage(
        "Only verified Indian citizens can continue."
      );
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !country ||
      !state ||
      !district ||
      !block ||
      !villageLocality
    ) {
      showMessage(
        "Please complete your name, email and all location details."
      );
      return;
    }

    if (country !== "India") {
      showMessage(
        "SWACHHLENS currently supports citizen reporting in India."
      );
      return;
    }

    try {
      setLocationSubmitting(true);

      const normalizedEmail =
        email.trim().toLowerCase();

      const response = await fetch(
        `${API_BASE}/api/citizen/location`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
body: JSON.stringify({
  fullName: fullName.trim(),
  email: normalizedEmail,
  emailVerified: true,

  // AGE CONFIRMATION
  isAbove18:
    isAbove18 === "yes"
      ? true
      : isAbove18 === "no"
      ? false
      : null,

  // CITIZEN LOCATION
  country: "India",
  state,
  district,
  block,
  villageLocality,
}),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from citizen server."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to save citizen location."
        );
      }

      console.log(
        "✅ Citizen saved to MongoDB:",
        data.citizen
      );

      // -------------------------------------------------------
      // BUILD PROFILE FROM MONGODB RESPONSE
      // -------------------------------------------------------

      const citizen = data.citizen;
setIsAbove18(
  citizen.isAbove18 === true
    ? "yes"
    : citizen.isAbove18 === false
    ? "no"
    : ""
);

      const citizenProfile = {
        fullName: citizen.fullName,
        email: citizen.email,
        emailVerified: citizen.emailVerified,

        country: citizen.country,

        state: citizen.state,
        stateCode: citizen.stateCode,

        district: citizen.district,
        districtCode: citizen.districtCode,

        block: citizen.block,
        blockCode: citizen.blockCode,

        villageLocality:
          citizen.villageLocality,

        villageCode:
          citizen.villageCode,

        latitude:
          citizen.latitude ?? null,

        longitude:
          citizen.longitude ?? null,

        locationSubmitted:
          citizen.locationSubmitted,

        locationSubmittedAt:
          citizen.locationSubmittedAt,
      };

      // -------------------------------------------------------
      // LOCAL STORAGE
      // -------------------------------------------------------

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(citizenProfile)
      );

      localStorage.setItem(
        "swachhlens_citizen_name",
        citizenProfile.fullName
      );

      localStorage.setItem(
        "swachhlens_citizen_email",
        citizenProfile.email
      );

      localStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      // -------------------------------------------------------
      // SESSION
      // -------------------------------------------------------

      sessionStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      sessionStorage.setItem(
        "swachhlens_citizen_name",
        citizenProfile.fullName
      );

      sessionStorage.setItem(
        "swachhlens_citizen_email",
        citizenProfile.email
      );

      sessionStorage.setItem(
        "swachhlens_indian_citizen",
        "yes"
      );
      

      // -------------------------------------------------------
      // UI
      // -------------------------------------------------------
setSavedCitizenFromDB(
  citizenProfile
);

setPreviouslyVerified(true);
setVerified(true);
setLocationSubmitted(true);

// =======================================================
// STEP GUARD STATUS
// Citizen verification + location are now complete.
// =======================================================

sessionStorage.setItem(
  "swachhlens_citizen_verified",
  "true"
);

sessionStorage.setItem(
  "swachhlens_citizen_location_saved",
  "true"
);

showMessage(
  "Citizen email and location saved successfully.",
  "success"
);
    } catch (error) {
      console.error(
        "Citizen location submission error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to save citizen location."
      );
    } finally {
      setLocationSubmitting(false);
    }
  };

  // =========================================================
  // PREVIOUS REPORT STATUS
  // =========================================================

  const openPreviousReportStatus = () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      showMessage(
        "Verified email address is required."
      );
      return;
    }

    sessionStorage.setItem(
      "swachhlens_status_email",
      normalizedEmail
    );

    sessionStorage.setItem(
      "swachhlens_citizen_verified",
      "true"
    );

    scrollTop();

    navigate("/report-analysis-status");
  };

  // =========================================================
  // NEW REPORT
  // =========================================================
const proceedWithNewReport = () => {
  clearMessage();

  // =======================================================
  // EMAIL VERIFICATION REQUIRED
  // =======================================================

  if (!verified) {
    showMessage(
      "Please verify your email address first."
    );
    return;
  }

  // =======================================================
  // LOCATION REQUIRED
  // =======================================================

  if (!locationSubmitted) {
    showMessage(
      "Please complete your citizen location details first."
    );
    return;
  }

  // =======================================================
  // STEP GUARD STATUS
  // =======================================================

  sessionStorage.setItem(
    "swachhlens_citizen_verified",
    "true"
  );

  sessionStorage.setItem(
    "swachhlens_citizen_location_saved",
    "true"
  );

  sessionStorage.setItem(
    "swachhlens_citizen_name",
    fullName.trim()
  );

  sessionStorage.setItem(
    "swachhlens_citizen_email",
    email.trim().toLowerCase()
  );

  sessionStorage.setItem(
    "swachhlens_indian_citizen",
    "yes"
  );

  // =======================================================
  // GO TO WASTE REPORT
  // =======================================================

  scrollTop();

  navigate("/report-waste");
};
  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="citizen-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="citizen-header">

        <span className="page-eyebrow">
          🛡️ CITIZEN VERIFICATION
        </span>

        <h1 className="rainbow-heading">
          Verify Yourself
          <br />
          Before You Report
        </h1>

        <p className="page-description">
          SWACHHLENS requires citizen verification
          before a waste incident can be submitted.
        </p>

        <p className="odia-explanation">
          (କଚରା ଘଟଣା ରିପୋର୍ଟ କରିବା ପୂର୍ବରୁ
          ନାଗରିକଙ୍କ ପରିଚୟ ଏବଂ ଇମେଲ୍ ଯାଞ୍ଚ
          କରାଯିବ।)
        </p>

      </section>

      {/* =====================================================
          STEP INDICATOR
      ===================================================== */}

      <section className="verification-steps">

        <div className="verification-step active">

          <span>01</span>

          <strong>
            Citizen Details
          </strong>

          <small>
            ନାଗରିକ ବିବରଣୀ
          </small>

        </div>

        <div className="step-connector"></div>

        <div
          className={`verification-step ${
            verified ? "active" : ""
          }`}
        >

          <span>02</span>

          <strong>
            Email Verification
          </strong>

          <small>
            ଇମେଲ୍ ଯାଞ୍ଚ
          </small>

        </div>

        <div className="step-connector"></div>

        <div
          className={`verification-step ${
            locationSubmitted
              ? "active next-ready"
              : ""
          }`}
        >

          <span>03</span>

          <strong>
            Waste Report
          </strong>

          <small>
            କଚରା ରିପୋର୍ଟ
          </small>

        </div>

      </section>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <section className="citizen-card">

        {/* ===================================================
            CITIZENSHIP
        =================================================== */}

        <div className="form-section">

          <div className="form-heading">

            <div className="form-icon india-flag-icon">

              <img
                src="/images/india-flag.svg"
                alt="Indian Flag"
              />

            </div>

            <div>

              <span className="small-blue-heading">
                CITIZENSHIP CONFIRMATION
              </span>

              <h2 className="rainbow-heading">
                Are You an Indian Citizen?
              </h2>

              <p className="odia-explanation">
                (ଆପଣ ଜଣେ ଭାରତୀୟ ନାଗରିକ କି?)
              </p>

            </div>

          </div>

          {/* =================================================
              CITIZENSHIP OPTIONS
          ================================================= */}

          <div className="citizenship-options">

            {/* YES */}

            <button
              type="button"
              className={`choice-card ${
                isIndianCitizen === "yes"
                  ? "selected yes"
                  : ""
              }`}
              onClick={() =>
                handleCitizenChange("yes")
              }
            >

              <span className="choice-icon">

                <img
                  src="/images/india-flag.svg"
                  alt="Indian Flag"
                  className="choice-flag-img"
                />

              </span>

              <div>

                <strong>
                  Yes, I am an Indian citizen
                </strong>

                <small>
                  (ହଁ, ମୁଁ ଜଣେ ଭାରତୀୟ ନାଗରିକ)
                </small>

              </div>

              {isIndianCitizen === "yes" && (
                <span className="choice-check">
                  ✓
                </span>
              )}

            </button>

            {/* NO */}

            <button
              type="button"
              className={`choice-card ${
                isIndianCitizen === "no"
                  ? "selected no"
                  : ""
              }`}
              onClick={() =>
                handleCitizenChange("no")
              }
            >

              <span className="choice-icon">
                🌍
              </span>

              <div>

                <strong>
                  No, I am not an Indian citizen
                </strong>

                <small>
                  (ନା, ମୁଁ ଜଣେ ଭାରତୀୟ ନାଗରିକ ନୁହେଁ)
                </small>

              </div>

              {isIndianCitizen === "no" && (
                <span className="choice-check">
                  ✓
                </span>
              )}

            </button>

          </div>

          {/* =================================================
              NON INDIAN WARNING
          ================================================= */}

          {isIndianCitizen === "no" && (
            <div className="citizenship-warning">

              <span className="warning-icon">
                ⚠️
              </span>

              <div>

                <strong>
                  Waste reporting is currently unavailable.
                </strong>

                <p>
                  SWACHHLENS citizen waste reporting is
                  available only for verified Indian citizens.
                </p>

                <p className="odia-explanation">
                  (SWACHHLENS ର ନାଗରିକ କଚରା ରିପୋର୍ଟିଂ
                  ବର୍ତ୍ତମାନ କେବଳ ଯାଞ୍ଚ ହୋଇଥିବା
                  ଭାରତୀୟ ନାଗରିକଙ୍କ ପାଇଁ ଉପଲବ୍ଧ।)
                </p>

              </div>

            </div>
          )}

        </div>

        {/* ===================================================
            INDIAN CITIZEN FLOW
        =================================================== */}

        {isIndianCitizen === "yes" && (
          <>

            <div className="form-divider"></div>

            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}

            <div className="form-section">

              <div className="form-heading">

                <div className="form-icon">
                  👤
                </div>

                <div>

                  <span className="small-blue-heading">
                    PERSONAL DETAILS
                  </span>

                  <h2 className="rainbow-heading">
                    Tell Us Who You Are
                  </h2>

                  <p className="odia-explanation">
                    (ଆପଣଙ୍କ ମୌଳିକ ବିବରଣୀ ଦିଅନ୍ତୁ।)
                  </p>

                </div>

              </div>

              {/* FULL NAME */}

              <div className="field-group">

                <label htmlFor="fullName">
                  Full Name
                  <span>
                    ଆପଣଙ୍କ ପୂର୍ଣ୍ଣ ନାମ
                  </span>
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearMessage();
                  }}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

              {/* EMAIL */}

              <div className="field-group">

                <label htmlFor="email">
                  Email Address
                  <span>
                    ଆପଣଙ୍କ ଇମେଲ୍ ଠିକଣା
                  </span>
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleEmailChange(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                />

              </div>

              {/* SEND OTP */}

              {!verified && (
                <button
                  type="button"
                  className="otp-btn"
                  onClick={sendOTP}
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "📩 Send OTP"}
                </button>
              )}

              {/* OTP */}

              {otpSent && !verified && (
                <div className="otp-section">

                  <div className="otp-info">

                    <span>📧</span>

                    <div>

                      <strong>
                        Enter Verification OTP
                      </strong>

                      <p>
                        A 6-digit OTP has been sent
                        to your email address.
                      </p>

                      <p className="odia-explanation">
                        (ଆପଣଙ୍କ ଇମେଲ୍ ଠିକଣାକୁ
                        ୬ ଅଙ୍କର OTP ପଠାଯାଇଛି।)
                      </p>

                    </div>

                  </div>

                  <div className="field-group">

                    <label htmlFor="otp">
                      OTP
                      <span>
                        ଯାଞ୍ଚ କୋଡ୍
                      </span>
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      autoComplete="one-time-code"
                    />

                  </div>

                  <button
                    type="button"
                    className="verify-btn"
                    onClick={verifyOTP}
                    disabled={loading}
                  >
                    {loading
                      ? "Verifying..."
                      : "✓ Verify Email Address"}
                  </button>

                </div>
              )}

              {/* VERIFIED */}

              {verified && (
                
                
                <div className="verified-box">

                  <div className="verified-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Email Address Verified
                    </strong>

                    <p>
                      Your email address has been
                      successfully verified.
                    </p>

                    <p className="odia-explanation">
                      (ଆପଣଙ୍କ ଇମେଲ୍ ଠିକଣା ସଫଳତାର
                      ସହିତ ଯାଞ୍ଚ ହୋଇଛି।)
                    </p>

                  </div>

                </div>
              )}
{/* =================================================
    AGE CONFIRMATION
    INFORMATION ONLY — NO AGE RESTRICTION
================================================= */}

<div className="age-confirmation-section">

  <div className="form-heading">

    <div className="form-icon">
      🎂
    </div>

    <div>
      <span className="small-blue-heading">
        AGE CONFIRMATION
      </span>

      <h2 className="rainbow-heading">
        Are You Above 18?
      </h2>

      <p className="odia-explanation">
        (ଆପଣଙ୍କ ବୟସ ୧୮ ବର୍ଷରୁ ଅଧିକ କି?)
      </p>
    </div>

  </div>

  <p className="age-confirmation-description">
    This information is collected only for confirmation
    purposes. Citizens of all ages can use SWACHHLENS
    to report waste incidents.
  </p>

  <p className="odia-explanation">
    (ଏହି ସୂଚନା କେବଳ ନିଶ୍ଚିତକରଣ ପାଇଁ ନିଆଯାଉଛି।
    ସମସ୍ତ ବୟସର ନାଗରିକ SWACHHLENS ରେ କଚରା
    ରିପୋର୍ଟ କରିପାରିବେ।)
  </p>

  <div className="age-confirmation-options">

    <button
      type="button"
      className={`age-choice-card ${
        isAbove18 === "yes" ? "selected" : ""
      }`}
      onClick={() => {
        setIsAbove18("yes");
        clearMessage();
      }}
    >
      <span className="age-choice-icon">
        ✓
      </span>

      <div>
        <strong>
          Yes, I am above 18
        </strong>

        <small>
          (ହଁ, ମୋର ବୟସ ୧୮ ବର୍ଷରୁ ଅଧିକ)
        </small>
      </div>

      {isAbove18 === "yes" && (
        <span className="choice-check">
          ✓
        </span>
      )}
    </button>

    <button
      type="button"
      className={`age-choice-card ${
        isAbove18 === "no" ? "selected" : ""
      }`}
      onClick={() => {
        setIsAbove18("no");
        clearMessage();
      }}
    >
      <span className="age-choice-icon">
        👤
      </span>

      <div>
        <strong>
          No, I am below 18
        </strong>

        <small>
          (ନା, ମୋର ବୟସ ୧୮ ବର୍ଷରୁ କମ୍)
        </small>
      </div>

      {isAbove18 === "no" && (
        <span className="choice-check">
          ✓
        </span>
      )}
    </button>

  </div>

  <div className="age-info-note">
    <span>ℹ️</span>

    <div>
      <strong>
        Age does not affect reporting access.
      </strong>

      <p>
        This is only a confirmation question.
        Selecting "No" will not prevent you from
        continuing.
      </p>

      <p className="odia-explanation">
        (ଏହା କେବଳ ଏକ ନିଶ୍ଚିତକରଣ ପ୍ରଶ୍ନ।
        "ଆପଣ ଆଗକୁ
        ଯାଇପାରିବେ।)
      </p>
    </div>
  </div>

</div>
              {/* =================================================
                  CITIZEN LOCATION
                  ONLY AFTER EMAIL VERIFICATION
              ================================================= */}

              {verified && (
                <>

                  <div className="form-divider"></div>

                  <div className="form-section citizen-location-section">

                    <div className="form-heading">

                      <div className="form-icon">
                        📍
                      </div>

                      <div>

                        <span className="small-blue-heading">
                          CITIZEN LOCATION
                        </span>

                        <h2 className="rainbow-heading">
                          Where Do You Live?
                        </h2>

                        <p className="odia-explanation">
                          (ଆପଣ କେଉଁଠାରେ ବସବାସ କରନ୍ତି?)
                        </p>

                      </div>

                    </div>

                    {/* COUNTRY */}

                    <div className="field-group">

                      <label htmlFor="country">
                        Country
                        <span>
                          ଦେଶ
                        </span>
                      </label>

                      <select
                        id="country"
                        value={country}
                        onChange={(e) =>
                          updateCitizenLocation(
                            "country",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select your country
                        </option>

                        <option value="India">
                          India
                        </option>

                      </select>

                    </div>

                    {/* STATE */}

                    <div className="field-group">

                      <label htmlFor="state">
                        State
                        <span>
                          ରାଜ୍ୟ
                        </span>
                      </label>

                      <select
                        id="state"
                        value={state}
                        disabled={
                          country !== "India" ||
                          (locationLoading &&
                            states.length === 0)
                        }
                        onChange={(e) =>
                          updateCitizenLocation(
                            "state",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          {country !== "India"
                            ? "Select India first"
                            : locationLoading
                            ? "Loading states..."
                            : "Select your state"}
                        </option>

                        {states.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* DISTRICT */}

                    <div className="field-group">

                      <label htmlFor="district">
                        District
                        <span>
                          ଜିଲ୍ଲା
                        </span>
                      </label>

                      <select
                        id="district"
                        value={district}
                        disabled={!state}
                        onChange={(e) =>
                          updateCitizenLocation(
                            "district",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          {!state
                            ? "Select state first"
                            : locationLoading
                            ? "Loading districts..."
                            : "Select your district"}
                        </option>

                        {districts.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* BLOCK */}

                    <div className="field-group">

                      <label htmlFor="block">
                        Block
                        <span>
                          ବ୍ଲକ୍
                        </span>
                      </label>

                      <select
                        id="block"
                        value={block}
                        disabled={!district}
                        onChange={(e) =>
                          updateCitizenLocation(
                            "block",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          {!district
                            ? "Select district first"
                            : locationLoading
                            ? "Loading blocks..."
                            : "Select your block"}
                        </option>

                        {blocks.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* VILLAGE / LOCALITY */}

                    <div className="field-group">

                      <label htmlFor="villageLocality">
                        Village / Locality
                        <span>
                          ଗ୍ରାମ / ସ୍ଥାନୀୟ ଅଞ୍ଚଳ
                        </span>
                      </label>

                      <select
                        id="villageLocality"
                        value={villageLocality}
                        disabled={!block}
                        onChange={(e) =>
                          updateCitizenLocation(
                            "villageLocality",
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          {!block
                            ? "Select block first"
                            : locationLoading
                            ? "Loading villages..."
                            : "Select your village / locality"}
                        </option>

                        {villages.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* LOCATION REQUIRED */}

                    {!locationSubmitted && (
                      <div className="location-required-note">

                        <span>📍</span>

                        <div>

                          <strong>
                            Complete Your Location Details
                          </strong>

                          <p>
                            Please select Country,
                            State, District, Block and
                            Village / Locality.
                          </p>

                          <p className="odia-explanation">
                            (ଦେଶ, ରାଜ୍ୟ, ଜିଲ୍ଲା, ବ୍ଲକ୍ ଏବଂ
                            ଗ୍ରାମ / ସ୍ଥାନୀୟ ଅଞ୍ଚଳ
                            ଚୟନ କରନ୍ତୁ।)
                          </p>

                        </div>

                      </div>
                    )}

                    {/* SUBMIT LOCATION */}

                    <button
                      type="button"
                      className="submit-location-btn"
                      disabled={
                        !country ||
                        !state ||
                        !district ||
                        !block ||
                        !villageLocality ||
                        locationSubmitting ||
                        locationSubmitted
                      }
                      onClick={
                        submitCitizenLocation
                      }
                    >
                      {locationSubmitting
                        ? "Saving Location..."
                        : locationSubmitted
                        ? "✓ Location Details Submitted"
                        : "📍 Submit Your Location Details"}
                    </button>

                    {/* LOCATION SUCCESS */}

                    {locationSubmitted && (
                      <div className="location-success-box">

                        <div className="verified-icon">
                          ✓
                        </div>

                        <div>

                          <strong>
                            Location Details Saved Successfully
                          </strong>

                          <p>
                            Your citizen location has
                            been securely saved and can
                            be reused for future
                            SWACHHLENS reports.
                          </p>

                          <p className="odia-explanation">
                            (ଆପଣଙ୍କ ନାଗରିକ ଅବସ୍ଥାନ
                            ବିବରଣୀ ସଫଳତାର ସହିତ
                            ସୁରକ୍ଷିତ ଭାବେ
                            ସଞ୍ଚୟ କରାଯାଇଛି।)
                          </p>

                        </div>

                      </div>
                    )}

                  </div>
                  {/* =================================================
                      PRIVACY
                  ================================================= */}

                  <div className="privacy-mini-card">

                    <span>🔐</span>

                    <div>

                      <strong>
                        Your information is protected
                      </strong>

                      <p>
                        Your personal details are used
                        for verification and responsible
                        report handling.
                      </p>

                      <p>
                        Your location details are stored
                        securely and reused only for
                        SWACHHLENS reporting.
                      </p>

                      <p className="odia-explanation">
                        (ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ଏବଂ ସ୍ଥାନ
                        ସୂଚନାକୁ ସୁରକ୍ଷିତ ଭାବେ
                        ବ୍ୟବହାର କରାଯିବ।)
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      FINAL ACTIONS
                  ================================================= */}

                  {verified && locationSubmitted && (
                    <>
                      <div className="form-divider"></div>

                      <div className="final-action-section">

                        {/* =================================================
                            HEADING
                        ================================================= */}

                        <div className="form-heading">

                          <div className="form-icon">
                            📋
                          </div>

                          <div>

                            <span className="small-blue-heading">
                              REPORT ACCESS
                            </span>

                            <h2 className="rainbow-heading">
                              What Would You Like To Do?
                            </h2>

                            <p className="odia-explanation">
                              (ଆପଣ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?)
                            </p>

                          </div>

                        </div>

                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <p className="final-action-description">
                          Your verified citizen profile and location
                          are complete. Choose an option below.
                        </p>

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div className="previous-user-actions">

                          {/* PREVIOUS REPORT STATUS */}

                          <button
                            type="button"
                            className="rainbow-action-btn"
                            onClick={openPreviousReportStatus}
                          >
                            📊 Previous Report Status
                          </button>

                          {/* CONTINUE TO NEW REPORT */}

                          <button
                            type="button"
                            className="rainbow-action-btn"
                            onClick={proceedWithNewReport}
                          >
                            ➕ Continue to New Report
                          </button>

                        </div>

                      </div>
                    </>
                  )}

                  {/* =================================================
                      MESSAGE
                  ================================================= */}

                  {message && (
                    <div
                      className={`form-message ${messageType}`}
                    >
                      {messageType === "success"
                        ? "✓"
                        : "⚠️"}{" "}
                      {message}
                    </div>
                  )}

                </>
              )}

            </div>

          </>
        )}

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <section className="citizen-footer">

        <div className="footer-lock">
          🔒
        </div>

        <div>

          <strong>
            Step-by-step reporting
          </strong>

          <p>
            You cannot skip required verification
            stages. Complete citizen verification
            and location submission before
            proceeding.
          </p>

          <p className="odia-explanation">
            (ଆବଶ୍ୟକ ଯାଞ୍ଚ ଏବଂ ସ୍ଥାନ ସୂଚନା
            ପଦକ୍ଷେପକୁ ଛାଡି ଆଗକୁ ଯାଇପାରିବେ ନାହିଁ।)
          </p>

        </div>

      </section>

    </main>
  );
}

export default CitizenDetails;