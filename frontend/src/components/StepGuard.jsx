import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./StepGuard.css";
// =========================================================
// SWACHHLENS — STEP GUARD
// =========================================================
//
// FLOW:
//
// Home
//   ↓
// Citizen Details
//   ↓
// Email Verification
//   ↓
// Citizen Location Saved
//   ↓
// Waste Report
//
// IMPORTANT WASTE REPORT RULE:
//
// 1. Direct /report-waste
// 2. Navbar → Waste Report
// 3. Home → Waste Report
// 4. navigate("/report-waste")
// 5. Browser refresh
//
// If verification/location is incomplete:
//
//      STAY ON /report-waste
//
//      Show:
//
//      🔒 Previous Step Required
//      Please complete the previous step...
//      Odia message
//      ← Complete Previous Step
//
// Button → /citizen-details
//
// NEVER automatically redirect blocked Waste Report
// to Citizen Details.
//
// Previously verified users are allowed.
// =========================================================


// =========================================================
// WASTE REPORT BLOCKED SCREEN
// =========================================================

function WasteReportBlocked({
  message,
  messageOdia,
}) {
  const navigate = useNavigate();

  return (
    <main className="step-guard-page">

      <section className="step-guard-card">

        {/* ===================================================
            ICON
        =================================================== */}

        <div className="step-guard-icon">
          🔒
        </div>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h1 className="step-guard-title">
          Previous Step Required
        </h1>


        {/* ===================================================
            MAIN MESSAGE
        =================================================== */}

        <p className="step-guard-message">
          {message}
        </p>


        {/* ===================================================
            ODIA MESSAGE
        =================================================== */}

        <p className="step-guard-odia">
          {messageOdia}
        </p>


        {/* ===================================================
            COMPLETE PREVIOUS STEP
        =================================================== */}

        <button
          type="button"
          className="step-guard-button"
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "auto",
            });

            navigate("/citizen-details");
          }}
        >
          ← Complete Previous Step
        </button>

      </section>

    </main>
  );
}


// =========================================================
// MAIN STEP GUARD
// =========================================================

function StepGuard({
  requiredStep,
  children,
}) {
  const location = useLocation();

  // =======================================================
  // SESSION STATUS
  // =======================================================

  const homeStarted =
    sessionStorage.getItem(
      "swachhlensHomeStarted"
    ) === "true";


  const citizenVerified =
    sessionStorage.getItem(
      "swachhlens_citizen_verified"
    ) === "true";


  const citizenLocationSaved =
    sessionStorage.getItem(
      "swachhlens_citizen_location_saved"
    ) === "true";


  // =======================================================
  // PREVIOUSLY VERIFIED USER
  // =======================================================
  //
  // IMPORTANT:
  //
  // If citizen verification + location were already saved,
  // allow the user even if the current Home journey flag
  // is not freshly created.
  //
  // This preserves previously verified users.
  // =======================================================

  const previousVerifiedUser =
    citizenVerified &&
    citizenLocationSaved;


  // =======================================================
  // DEFAULT VALUES
  // =======================================================

  let allowed = false;

  let redirectTo = "/";

  let blockedMessage =
    "Please complete the previous step.";

  let blockedMessageOdia =
    "(ପୂର୍ବ ପଦକ୍ଷେପଟି ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।)";


  // =======================================================
  // STEP CONTROL
  // =======================================================

  switch (requiredStep) {

    // =====================================================
    // HOME
    // =====================================================

    case "home":

      allowed = true;

      break;


    // =====================================================
    // ABOUT
    // =====================================================

    case "about":

      allowed = true;

      break;


    // =====================================================
    // CITIZEN DETAILS
    // =====================================================

    case "citizen":

      // -----------------------------------------------------
      // Citizen Details must never show the
      // Previous Step Required screen.
      // -----------------------------------------------------

      if (
        homeStarted ||
        previousVerifiedUser
      ) {

        allowed = true;

      } else {

        allowed = false;

        redirectTo = "/";

      }

      break;


    // =====================================================
    // WASTE REPORT
    // =====================================================

    case "waste-report":

      // ===================================================
      // THIS IS THE IMPORTANT PROTECTION.
      //
      // Waste Report is allowed ONLY when:
      //
      // citizenVerified === true
      // AND
      // citizenLocationSaved === true
      //
      // Previously verified users are also allowed.
      //
      // If either is false:
      //
      // NEVER REDIRECT.
      //
      // Stay on /report-waste and render the blocked
      // screen below.
      // ===================================================

      if (
        citizenVerified &&
        citizenLocationSaved
      ) {

        allowed = true;

      } else {

        allowed = false;

        // -------------------------------------------------
        // KEEP URL
        // -------------------------------------------------

        


        // -------------------------------------------------
        // ENGLISH MESSAGE
        // -------------------------------------------------

        blockedMessage =
          "Please complete the previous step before reporting waste.";


        // -------------------------------------------------
        // ODIA MESSAGE
        // -------------------------------------------------

        blockedMessageOdia =
          "(ଆବର୍ଜନା ରିପୋର୍ଟ କରିବା ପୂର୍ବରୁ ପୂର୍ବ ପଦକ୍ଷେପଟି ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।)";
      }

      break;


    // =====================================================
// REPORT ANALYSIS & STATUS
// =====================================================

case "analysis-status":

  // Direct access allowed.
  // If there is no saved report,
  // ReportAnalysisStatus.jsx will ask for
  // Report ID + Email.

  allowed = true;

  break;

    // =====================================================
    // ADMIN
    // =====================================================

    case "admin":

      if (
        citizenVerified &&
        citizenLocationSaved
      ) {

        allowed = true;

      } else {

        redirectTo = "/";

        blockedMessage =
          "Access to the Admin Panel is restricted.";

        blockedMessageOdia =
          "(ଆଡମିନ୍ ପ୍ୟାନେଲ୍ ପ୍ରବେଶ ସୀମିତ ଅଟେ।)";

      }

      break;


    // =====================================================
    // UNKNOWN
    // =====================================================

    default:

      allowed = false;

      redirectTo = "/";

      break;
  }


  // =========================================================
  // WASTE REPORT — BLOCKED SCREEN
  // =========================================================
  //
  // VERY IMPORTANT:
  //
  // NO <Navigate> HERE.
  //
  // So browser remains:
  //
  // /report-waste
  //
  // =========================================================

  if (
    requiredStep === "waste-report" &&
    !allowed
  ) {

    return (
      <WasteReportBlocked
        message={blockedMessage}
        messageOdia={blockedMessageOdia}
      />
    );
  }


  // =========================================================
  // OTHER BLOCKED ROUTES
  // =========================================================

  if (!allowed) {

    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          blocked: true,
          from: location.pathname,
          message: blockedMessage,
          messageOdia: blockedMessageOdia,
        }}
      />
    );
  }


  // =========================================================
  // ALLOWED
  // =========================================================

  return children;
}


export default StepGuard;