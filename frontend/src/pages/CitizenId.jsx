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
              â˜¸ï¸
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
            â™»ï¸
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
            ðŸŒ±
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
          ðŸ—‘ï¸
        </span>

      </div>


      {/* =================================================
          5. TOY
      ================================================= */}

      <div className="top-toy-plate">

        <span className="top-toy-icon">
          âœ¨
        </span>

      </div>

    </div>


        {/* =================================================
            MAIN HEADING
        ================================================= */}

        <div className="citizen-heading">
          <div className="heading-icon">
            ðŸ†”
          </div>

          <h1>
            Citizen Verification
          </h1>

          <h3>
            à¬¨à¬¾à¬—à¬°à¬¿à¬• à¬¯à¬¾à¬žà­à¬š
          </h3>

          <p>
            Enter your Citizen ID and registered
            email to continue with citizen verification.
          </p>

          <p className="odia-main-text">
            à¬¨à¬¾à¬—à¬°à¬¿à¬• à¬¯à¬¾à¬žà­à¬š à¬œà¬¾à¬°à¬¿ à¬°à¬–à¬¿à¬¬à¬¾ à¬ªà¬¾à¬‡à¬
            à¬†à¬ªà¬£à¬™à­à¬• Citizen ID à¬à¬¬à¬‚ à¬ªà¬žà­à¬œà­€à¬•à­ƒà¬¤
            à¬‡à¬®à­‡à¬²à­ à¬ªà­à¬°à¬¬à­‡à¬¶ à¬•à¬°à¬¨à­à¬¤à­à¥¤
          </p>
        </div>

        {/* =================================================
            CLEAN SOCIETY MESSAGE
        ================================================= */}

        <div className="clean-message">
          <span className="clean-message-icon">
            ðŸ§¹
          </span>

          <div>
            <strong>
              Make Your Society Clean
            </strong>

            <span>
              à¬†à¬ªà¬£à¬™à­à¬• à¬¸à¬®à¬¾à¬œà¬•à­ à¬¸à­à­±à¬šà­à¬› à¬°à¬–à¬¨à­à¬¤à­
            </span>
          </div>

          <span className="clean-message-icon">
            ðŸŒ±
          </span>
        </div>

        {/* =================================================
            PLATES
        ================================================= */}

        <div className="citizen-plates">

          {/* =================================================
              PLATE 1 â€” EXISTING CITIZEN
          ================================================= */}

          <div className="citizen-plate">

            <div className="plate-top">

              <div className="plate-icon">
                ðŸ†”
              </div>

              <div>
                <h2>
                  Enter Your Citizen ID
                </h2>

                <span>
                  à¬†à¬ªà¬£à¬™à­à¬• Citizen ID à¬ªà­à¬°à¬¬à­‡à¬¶ à¬•à¬°à¬¨à­à¬¤à­
                </span>
              </div>

            </div>

            <p className="plate-description">
              Already registered with
              SWACHHLENS? Enter your Citizen ID
              and registered email below to continue.
            </p>

            <p className="plate-odia">
              SWACHHLENS à¬°à­‡ à¬ªà­‚à¬°à­à¬¬à¬°à­ à¬ªà¬žà­à¬œà­€à¬•à­ƒà¬¤
              à¬…à¬›à¬¨à­à¬¤à¬¿? à¬œà¬¾à¬°à¬¿ à¬°à¬–à¬¿à¬¬à¬¾ à¬ªà¬¾à¬‡à¬ à¬¤à¬³à­‡
              à¬†à¬ªà¬£à¬™à­à¬• Citizen ID à¬à¬¬à¬‚ à¬ªà¬žà­à¬œà­€à¬•à­ƒà¬¤
              à¬‡à¬®à­‡à¬²à­ à¬ªà­à¬°à¬¬à­‡à¬¶ à¬•à¬°à¬¨à­à¬¤à­à¥¤
            </p>

            {/* =================================================
                CITIZEN ID INPUT
            ================================================= */}

            <div className="citizen-input-wrapper">

              <span>
                ðŸ†”
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
                  âš ï¸
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
                ðŸ“§
              </span>

              <span>
                Email Address / à¬‡à¬®à­‡à¬²à­ à¬ à¬¿à¬•à¬£à¬¾
              </span>

            </div>

            {/* =================================================
                EMAIL INPUT
            ================================================= */}

            <div className="citizen-email-wrapper">

              <span>
                ðŸ“§
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
                  âš ï¸
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
                â†’
              </span>

            </button>

            <p className="button-odia">
              à¬ªà­à¬°à¬¬à­‡à¬¶ à¬•à¬°à¬¿ à¬œà¬¾à¬°à¬¿ à¬°à¬–à¬¨à­à¬¤à­
            </p>

          </div>

          {/* =================================================
              OR DIVIDER
          ================================================= */}

          <div className="citizen-or">

            <span></span>

            <div>
              âœ¨ OR / à¬•à¬¿à¬®à­à¬¬à¬¾ âœ¨
            </div>

            <span></span>

          </div>

          {/* =================================================
              PLATE 2 â€” NEW USER
          ================================================= */}

          <div className="citizen-plate new-user-plate">

            <div className="plate-top">

              <div className="plate-icon new-icon">
                ðŸ‘¤
              </div>

              <div>

                <h2>
                  Are You a New User?
                </h2>

                <span>
                  à¬†à¬ªà¬£ à¬œà¬£à­‡ à¬¨à­‚à¬¤à¬¨ à¬¬à­à­Ÿà¬¬à¬¹à¬¾à¬°à¬•à¬¾à¬°à­€ à¬•à¬¿?
                </span>

              </div>

            </div>

            <p className="plate-description">
              Don't have a Citizen ID yet?
              Verify yourself first and create
              your citizen profile.
            </p>

            <p className="plate-odia">
              à¬à¬ªà¬°à­à¬¯à­à­Ÿà¬¨à­à¬¤ Citizen ID à¬¨à¬¾à¬¹à¬¿à¬?
              à¬ªà­à¬°à¬¥à¬®à­‡ à¬†à¬ªà¬£à¬™à­à¬•à­ à¬¯à¬¾à¬žà­à¬š à¬•à¬°à¬¿
              à¬¨à¬¾à¬—à¬°à¬¿à¬• à¬ªà­à¬°à­‹à¬«à¬¾à¬‡à¬²à­ à¬¸à­ƒà¬·à­à¬Ÿà¬¿ à¬•à¬°à¬¨à­à¬¤à­à¥¤
            </p>

            <button
              type="button"
              className="citizen-secondary-button"
              onClick={() =>
                navigate("/citizen-details")
              }
            >

              <span>
                ðŸ‘¤ Continue to Verify Citizen
              </span>

              <span>
                â†’
              </span>

            </button>

            <p className="button-odia">
              à¬¨à¬¾à¬—à¬°à¬¿à¬• à¬¯à¬¾à¬žà­à¬š à¬ªà¬¾à¬‡à¬ à¬œà¬¾à¬°à¬¿ à¬°à¬–à¬¨à­à¬¤à­
            </p>

          </div>

        </div>

        {/* =================================================
            BOTTOM CLEAN INDIA
        ================================================= */}

        <div className="clean-india-section">

          <div className="clean-india-icon">
            ðŸ‡®ðŸ‡³
          </div>

          <div>

            <strong>
              Clean India â€¢ Green India
            </strong>

            <span>
              à¬¸à­à­±à¬šà­à¬› à¬­à¬¾à¬°à¬¤ â€¢ à¬¸à¬¬à­à¬œ à¬­à¬¾à¬°à¬¤
            </span>

          </div>

          <div className="clean-india-icon">
            ðŸŒ±
          </div>

        </div>

        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="citizen-security">

          <span>
            ðŸ”
          </span>

          <span>
            Your information is securely
            handled by SWACHHLENS.
          </span>

          <span className="security-odia">
            à¬†à¬ªà¬£à¬™à­à¬• à¬¸à­‚à¬šà¬¨à¬¾ SWACHHLENS à¬¦à­à­±à¬¾à¬°à¬¾
            à¬¸à­à¬°à¬•à­à¬·à¬¿à¬¤ à¬­à¬¾à¬¬à¬°à­‡ à¬ªà¬°à¬¿à¬šà¬¾à¬³à¬¿à¬¤ à¬¹à­à¬à¥¤
          </span>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="citizen-footer">

          <span>
            â™»ï¸ SWACHHLENS
          </span>

          <span>
            â€¢
          </span>

          <span>
            Clean Today, Better Tomorrow
          </span>

        </div>

      </div>
    
  );
}

export default CitizenId;
