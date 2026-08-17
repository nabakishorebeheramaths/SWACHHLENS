import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenId.css";

function CitizenId({ embedded = false, onVerified }) {
  const navigate = useNavigate();

  const [citizenIdInput, setCitizenIdInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [citizenIdError, setCitizenIdError] = useState("");
  const [emailError, setEmailError] = useState("");

 // =====================================================
// HANDLE CONTINUE
// =====================================================

const handleContinue = () => {
  const enteredCitizenId = citizenIdInput.trim();
  const enteredEmail = emailInput.trim();

  // =====================================================
  // CITIZEN ID VALIDATION
  // =====================================================

  if (!enteredCitizenId) {
    setCitizenIdError("Please enter your Citizen ID.");
    setEmailError("");
    return;
  }

  // =====================================================
  // EMAIL VALIDATION
  // =====================================================

  if (!enteredEmail) {
    setEmailError(
      "Please enter your registered email address."
    );

    setCitizenIdError("");
    return;
  }

  // =====================================================
  // EMAIL FORMAT VALIDATION
  // =====================================================

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(enteredEmail)) {
    setEmailError(
      "Please enter a valid email address."
    );

    setCitizenIdError("");
    return;
  }

  // =====================================================
  // SAVE CITIZEN ID
  // =====================================================

  sessionStorage.setItem(
    "swachhlens_citizen_id",
    enteredCitizenId
  );

  // =====================================================
  // SAVE EMAIL
  // =====================================================

  sessionStorage.setItem(
    "swachhlens_citizen_email",
    enteredEmail
  );

  // =====================================================
  // MARK CITIZEN AS VERIFIED
  // =====================================================

  sessionStorage.setItem(
    "swachhlens_citizen_verified",
    "true"
  );

  // =====================================================
  // CLEAR ERRORS
  // =====================================================

  setCitizenIdError("");
  setEmailError("");

  // =====================================================
  // EMBEDDED MODE
  // SHOW REPORT WASTE PAGE
  // =====================================================

  if (embedded) {
  if (onVerified) {
    onVerified();
  }

  return;
}
  // =====================================================
  // NORMAL CITIZEN ID PAGE
  // =====================================================

  navigate("/citizen-details");
};
  // =====================================================
// MAIN RENDER
// =====================================================

return (
  <div className="citizen-id-page">

    {/* =================================================
        STATIC TOP 5
        ONLY THESE 5 ITEMS
    ================================================= */}

    <div className="citizen-top-toys">

      {/* =================================================
          1. INDIA FLAG
      ================================================= */}

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


      {/* =================================================
          2. SWACHHLENS
      ================================================= */}

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


      {/* =================================================
          3. GREEN SOCIETY
      ================================================= */}

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


      {/* =================================================
          4. TOY
      ================================================= */}

      <div className="top-toy-plate">

        <span className="top-toy-icon">
          🗑️
        </span>

      </div>


      {/* =================================================
          5. TOY
      ================================================= */}

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

            {/* =================================================
                CITIZEN ID INPUT
            ================================================= */}

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
              />

            </div>

            {/* =================================================
                CITIZEN ID ERROR
            ================================================= */}

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

            {/* =================================================
                EMAIL ADDRESS LABEL
            ================================================= */}

            <div className="citizen-email-label">

              <span>
                📧
              </span>

              <span>
                Email Address / ଇମେଲ୍ ଠିକଣା
              </span>

            </div>

            {/* =================================================
                EMAIL INPUT
            ================================================= */}

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
              />

            </div>

            {/* =================================================
                EMAIL ERROR
            ================================================= */}

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

            {/* =================================================
                BUTTON
            ================================================= */}

            <button
              type="button"
              className="citizen-primary-button"
              onClick={handleContinue}
            >

              <span>
                Enter & Continue
              </span>

              <span>
                →
              </span>

            </button>

            <p className="button-odia">
              ପ୍ରବେଶ କରି ଜାରି ରଖନ୍ତୁ
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
            🔐
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