import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenId.css";

// =====================================================
// API
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";

// =====================================================
// COMPONENT
// =====================================================

function CitizenId({ embedded = false, onVerified }) {
  const navigate = useNavigate();

  const [citizenIdInput, setCitizenIdInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [citizenIdError, setCitizenIdError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE CONTINUE
  // =====================================================

  const handleContinue = async () => {
    // ---------------------------------------------------
    // CLEAR OLD ERRORS
    // ---------------------------------------------------

    setCitizenIdError("");
    setEmailError("");

    // ---------------------------------------------------
    // NORMALIZE INPUT
    // ---------------------------------------------------

    const enteredCitizenId =
      citizenIdInput.trim();

    const enteredEmail =
      emailInput.trim().toLowerCase();

    // =====================================================
    // CITIZEN ID REQUIRED
    // =====================================================

    if (!enteredCitizenId) {
      setCitizenIdError(
        "Please enter your Citizen ID."
      );
      return;
    }

    // =====================================================
    // EMAIL REQUIRED
    // =====================================================

    if (!enteredEmail) {
      setEmailError(
        "Please enter your registered email address."
      );
      return;
    }

    // =====================================================
    // EMAIL FORMAT
    // =====================================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(enteredEmail)) {
      setEmailError(
        "Please enter a valid email address."
      );
      return;
    }

    // =====================================================
    // PREVENT DOUBLE CLICK
    // =====================================================

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      console.log(
        "========================================"
      );

      console.log(
        "🔐 CITIZEN VERIFICATION STARTED"
      );

      console.log(
        "🪪 Citizen ID:",
        enteredCitizenId
      );

      console.log(
        "📧 Email:",
        enteredEmail
      );

      console.log(
        "🌐 API:",
        `${API_BASE}/api/citizen/by-email`
      );

      console.log(
        "========================================"
      );

      // ===================================================
      // IMPORTANT:
      // DO NOT TRUST FRONTEND INPUT.
      //
      // Check MongoDB using registered email.
      // ===================================================

      const response = await fetch(
        `${API_BASE}/api/citizen/by-email?email=${encodeURIComponent(
          enteredEmail
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      // ===================================================
      // PARSE RESPONSE
      // ===================================================

      let data;

      try {
        data = await response.json();
      } catch (error) {
        console.error(
          "❌ Invalid citizen server response:",
          error
        );

        throw new Error(
          "Invalid response from citizen server."
        );
      }

      console.log(
        "📥 Citizen verification response:",
        data
      );

      // ===================================================
      // SERVER ERROR
      // ===================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to verify citizen details."
        );
      }

      // ===================================================
      // API SUCCESS CHECK
      // ===================================================

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to verify citizen details."
        );
      }

      // ===================================================
      // CITIZEN NOT FOUND
      // ===================================================

      if (
        !data.found ||
        !data.citizen
      ) {
        console.warn(
          "❌ Citizen not found for email:",
          enteredEmail
        );

        setEmailError(
          "No registered citizen account was found with this email address."
        );

        return;
      }

      // ===================================================
      // MONGODB CITIZEN RECORD
      // ===================================================

      const citizen = data.citizen;

      console.log(
        "👤 MongoDB citizen:",
        citizen
      );

      // ===================================================
      // GET REGISTERED CITIZEN ID
      // ===================================================

      const registeredCitizenId =
        String(
          citizen.citizenId ||
            citizen.id ||
            citizen._id ||
            ""
        ).trim();

      // ===================================================
      // GET REGISTERED EMAIL
      // ===================================================

      const registeredEmail =
        String(
          citizen.email || ""
        )
          .trim()
          .toLowerCase();

      // ===================================================
      // EMAIL VERIFICATION STATUS
      // ===================================================

      const emailVerified =
        citizen.emailVerified === true;

      // ===================================================
      // CITIZEN ID MATCH
      // ===================================================

      const citizenIdMatches =
        registeredCitizenId.toLowerCase() ===
        enteredCitizenId.toLowerCase();

      // ===================================================
      // EMAIL MATCH
      // ===================================================

      const emailMatches =
        registeredEmail === enteredEmail;

      // ===================================================
      // DEBUG
      // =====================================================

      console.log(
        "🔎 VERIFICATION RESULT"
      );

      console.log(
        "Registered Citizen ID:",
        registeredCitizenId
      );

      console.log(
        "Entered Citizen ID:",
        enteredCitizenId
      );

      console.log(
        "Citizen ID Match:",
        citizenIdMatches
      );

      console.log(
        "Registered Email:",
        registeredEmail
      );

      console.log(
        "Entered Email:",
        enteredEmail
      );

      console.log(
        "Email Match:",
        emailMatches
      );

      console.log(
        "Email Verified:",
        emailVerified
      );

      // ===================================================
      // CITIZEN ID DOES NOT MATCH
      // ===================================================

      if (!citizenIdMatches) {
        console.warn(
          "❌ Citizen ID mismatch."
        );

        setCitizenIdError(
          "The Citizen ID does not match the registered email address."
        );

        return;
      }

      // ===================================================
      // EMAIL DOES NOT MATCH
      // ===================================================

      if (!emailMatches) {
        console.warn(
          "❌ Email mismatch."
        );

        setEmailError(
          "The email address does not match the registered Citizen ID."
        );

        return;
      }

      // ===================================================
      // EMAIL NOT VERIFIED
      // ===================================================

      if (!emailVerified) {
        console.warn(
          "❌ Citizen email is not verified."
        );

        setEmailError(
          "This citizen account has not completed email verification."
        );

        return;
      }

      // ===================================================
      // LOCATION CHECK
      //
      // CitizenDetails saves location before creating
      // / using Citizen ID.
      //
      // We don't make location mandatory here because
      // backend citizen verification is the primary check.
      // ===================================================

      // ===================================================
      // EVERYTHING VERIFIED
      // ===================================================

      console.log(
        "========================================"
      );

      console.log(
        "✅ CITIZEN VERIFICATION SUCCESSFUL"
      );

      console.log(
        "🪪 Citizen ID:",
        registeredCitizenId
      );

      console.log(
        "📧 Email:",
        registeredEmail
      );

      console.log(
        "========================================"
      );

      // ===================================================
      // ONLY NOW SAVE VERIFIED SESSION
      // ===================================================

      sessionStorage.setItem(
        "swachhlens_citizen_id",
        registeredCitizenId
      );

      sessionStorage.setItem(
        "swachhlens_citizen_email",
        registeredEmail
      );

      sessionStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      // ---------------------------------------------------
      // SAVE NAME IF AVAILABLE
      // ---------------------------------------------------

      if (citizen.fullName) {
        sessionStorage.setItem(
          "swachhlens_citizen_name",
          citizen.fullName
        );
      }

      // ---------------------------------------------------
      // SAVE INDIAN CITIZEN STATUS
      // ---------------------------------------------------

      sessionStorage.setItem(
        "swachhlens_indian_citizen",
        "yes"
      );

      // ===================================================
      // OPTIONAL LOCAL STORAGE CACHE
      // ===================================================

      localStorage.setItem(
        "swachhlens_citizen_id",
        registeredCitizenId
      );

      localStorage.setItem(
        "swachhlens_citizen_email",
        registeredEmail
      );

      if (citizen.fullName) {
        localStorage.setItem(
          "swachhlens_citizen_name",
          citizen.fullName
        );
      }

      localStorage.setItem(
        "swachhlens_citizen_verified",
        "true"
      );

      // ===================================================
      // CLEAR ERRORS
      // ===================================================

      setCitizenIdError("");
      setEmailError("");

      // ===================================================
      // EMBEDDED MODE
      //
      // ReportWaste.jsx uses CitizenId as an embedded
      // verification component.
      // ===================================================

      if (embedded) {
        if (typeof onVerified === "function") {
          onVerified({
            citizenId: registeredCitizenId,
            email: registeredEmail,
            citizen,
          });
        }

        return;
      }

      // ===================================================
      // NORMAL MODE
      // ===================================================

      navigate("/citizen-details");
    } catch (error) {
      console.error(
        "❌ Citizen verification error:",
        error
      );

      // ===================================================
      // IMPORTANT:
      // NEVER MARK VERIFIED IF API FAILED
      // ===================================================

      sessionStorage.removeItem(
        "swachhlens_citizen_verified"
      );

      sessionStorage.removeItem(
        "swachhlens_citizen_id"
      );

      sessionStorage.removeItem(
        "swachhlens_citizen_email"
      );

      // ===================================================
      // SHOW ERROR
      // ===================================================

      setEmailError(
        error.message ||
          "Unable to verify citizen details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="citizen-id-page">

      {/* =================================================
          STATIC TOP 5
      ================================================= */}

      <div className="citizen-top-toys">

        {/* INDIA FLAG */}

        <div className="top-toy-plate">

          <div className="top-india-flag">

            <div className="flag-saffron"></div>

            <div className="flag-white">

              <span className="ashoka-wheel">
                ☸️
              </span>

            </div>

            <div className="flag-green"></div>

          </div>

        </div>

        {/* SWACHHLENS */}

        <div className="top-toy-plate">

          <div className="top-brand-item">

            <div className="top-brand-icon">
              ♻️
            </div>

            <strong>
              SWACHHLENS
            </strong>

          </div>

        </div>

        {/* GREEN SOCIETY */}

        <div className="top-toy-plate">

          <div className="top-brand-item">

            <div className="top-brand-icon">
              🌱
            </div>

            <strong>
              GREEN SOCIETY
            </strong>

          </div>

        </div>

        {/* TOY */}

        <div className="top-toy-plate">

          <span className="top-toy-icon">
            🗑️
          </span>

        </div>

        {/* TOY */}

        <div className="top-toy-plate">

          <span className="top-toy-icon">
            ✨
          </span>

        </div>

      </div>

      {/* =================================================
          MAIN HEADING
      ================================================= */}

      <div className="citizen-heading">

        <div className="heading-icon">
          🆔
        </div>

        <h1>
          Citizen Verification
        </h1>

        <h3>
          ନାଗରିକ ଯାଞ୍ଚ
        </h3>

        <p>
          Enter your Citizen ID and registered
          email to continue with citizen verification.
        </p>

        <p className="odia-main-text">
          ନାଗରିକ ଯାଞ୍ଚ ଜାରି ରଖିବା ପାଇଁ
          ଆପଣଙ୍କ Citizen ID ଏବଂ ପଞ୍ଜୀକୃତ
          ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ।
        </p>

      </div>

      {/* =================================================
          CLEAN SOCIETY MESSAGE
      ================================================= */}

      <div className="clean-message">

        <span className="clean-message-icon">
          🧹
        </span>

        <div>

          <strong>
            Make Your Society Clean
          </strong>

          <span>
            ଆପଣଙ୍କ ସମାଜକୁ ସ୍ୱଚ୍ଛ ରଖନ୍ତୁ
          </span>

        </div>

        <span className="clean-message-icon">
          🌱
        </span>

      </div>

      {/* =================================================
          PLATES
      ================================================= */}

      <div className="citizen-plates">

        {/* =================================================
            PLATE 1 — EXISTING CITIZEN
        ================================================= */}

        <div className="citizen-plate">

          <div className="plate-top">

            <div className="plate-icon">
              🆔
            </div>

            <div>

              <h2>
                Enter Your Citizen ID
              </h2>

              <span>
                ଆପଣଙ୍କ Citizen ID ପ୍ରବେଶ କରନ୍ତୁ
              </span>

            </div>

          </div>

          <p className="plate-description">
            Already registered with
            SWACHHLENS? Enter your Citizen ID
            and registered email below to continue.
          </p>

          <p className="plate-odia">
            SWACHHLENS ରେ ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ
            ଅଛନ୍ତି? ଜାରି ରଖିବା ପାଇଁ ତଳେ
            ଆପଣଙ୍କ Citizen ID ଏବଂ ପଞ୍ଜୀକୃତ
            ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ।
          </p>

          {/* CITIZEN ID INPUT */}

          <div className="citizen-input-wrapper">

            <span>
              🆔
            </span>

            <input
              type="text"
              value={citizenIdInput}
              onChange={(e) => {
                setCitizenIdInput(
                  e.target.value
                );

                setCitizenIdError("");
              }}
              placeholder="Enter your Citizen ID"
              autoComplete="off"
              disabled={loading}
            />

          </div>

          {/* CITIZEN ID ERROR */}

          {citizenIdError && (
            <div className="citizen-id-error">

              <span>
                ⚠️
              </span>

              <span>
                {citizenIdError}
              </span>

            </div>
          )}

          {/* EMAIL LABEL */}

          <div className="citizen-email-label">

            <span>
              📧
            </span>

            <span>
              Email Address / ଇମେଲ୍ ଠିକଣା
            </span>

          </div>

          {/* EMAIL INPUT */}

          <div className="citizen-email-wrapper">

            <span>
              📧
            </span>

            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(
                  e.target.value
                );

                setEmailError("");
              }}
              placeholder="Enter your registered email"
              autoComplete="email"
              disabled={loading}
            />

          </div>

          {/* EMAIL ERROR */}

          {emailError && (
            <div className="citizen-email-error">

              <span>
                ⚠️
              </span>

              <span>
                {emailError}
              </span>

            </div>
          )}

          {/* BUTTON */}

          <button
            type="button"
            className="citizen-primary-button"
            onClick={handleContinue}
            disabled={loading}
          >

            <span>
              {loading
                ? "Verifying..."
                : "Enter & Continue"}
            </span>

            <span>
              {loading ? "⏳" : "→"}
            </span>

          </button>

          <p className="button-odia">
            {loading
              ? "ଯାଞ୍ଚ କରାଯାଉଛି..."
              : "ପ୍ରବେଶ କରି ଜାରି ରଖନ୍ତୁ"}
          </p>

        </div>

        {/* =================================================
            OR DIVIDER
        ================================================= */}

        <div className="citizen-or">

          <span></span>

          <div>
            ✨ OR / କିମ୍ବା ✨
          </div>

          <span></span>

        </div>

        {/* =================================================
            PLATE 2 — NEW USER
        ================================================= */}

        <div className="citizen-plate new-user-plate">

          <div className="plate-top">

            <div className="plate-icon new-icon">
              👤
            </div>

            <div>

              <h2>
                Are You a New User?
              </h2>

              <span>
                ଆପଣ ଜଣେ ନୂତନ ବ୍ୟବହାରକାରୀ କି?
              </span>

            </div>

          </div>

          <p className="plate-description">
            Don't have a Citizen ID yet?
            Verify yourself first and create
            your citizen profile.
          </p>

          <p className="plate-odia">
            ଏପର୍ଯ୍ୟନ୍ତ Citizen ID ନାହିଁ?
            ପ୍ରଥମେ ଆପଣଙ୍କୁ ଯାଞ୍ଚ କରି
            ନାଗରିକ ପ୍ରୋଫାଇଲ୍ ସୃଷ୍ଟି କରନ୍ତୁ।
          </p>

          <button
            type="button"
            className="citizen-secondary-button"
            onClick={() =>
              navigate("/citizen-details")
            }
            disabled={loading}
          >

            <span>
              👤 Continue to Verify Citizen
            </span>

            <span>
              →
            </span>

          </button>

          <p className="button-odia">
            ନାଗରିକ ଯାଞ୍ଚ ପାଇଁ ଜାରି ରଖନ୍ତୁ
          </p>

        </div>

      </div>

      {/* =================================================
          BOTTOM CLEAN INDIA
      ================================================= */}

      <div className="clean-india-section">

        <div className="clean-india-icon">
          🇮🇳
        </div>

        <div>

          <strong>
            Clean India • Green India
          </strong>

          <span>
            ସ୍ୱଚ୍ଛ ଭାରତ • ସବୁଜ ଭାରତ
          </span>

        </div>

        <div className="clean-india-icon">
          🌱
        </div>

      </div>

      {/* =================================================
          SECURITY
      ================================================= */}

      <div className="citizen-security">

        <span>
          🔍
        </span>

        <span>
          Your information is securely
          handled by SWACHHLENS.
        </span>

        <span className="security-odia">
          ଆପଣଙ୍କ ସୂଚନା SWACHHLENS ଦ୍ୱାରା
          ସୁରକ୍ଷିତ ଭାବରେ ପରିଚାଳିତ ହୁଏ।
        </span>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="citizen-footer">

        <span>
          ♻️ SWACHHLENS
        </span>

        <span>
          •
        </span>

        <span>
          Clean Today, Better Tomorrow
        </span>

      </div>

    </div>
  );
}

export default CitizenId;