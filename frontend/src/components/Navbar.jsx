import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // =========================================================
  // CURRENT PAGE ACTIVE STATE
  // =========================================================

  const isCurrentPage = (path) => {
    return (
      location.pathname.toLowerCase() ===
      path.toLowerCase()
    );
  };

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================================
  // SCROLL TO TOP
  // =========================================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  // =========================================================
  // PROTECTED NAVIGATION
  // =========================================================

  const handleProtectedNavigation = (
    path,
    requiredStep
  ) => {
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

    const previousVerifiedUser =
      citizenVerified &&
      citizenLocationSaved;

    // =======================================================
    // ACCESS CONTROL
    // =======================================================

    let allowed = false;

    switch (requiredStep) {
      case "citizen":

        allowed =
          homeStarted ||
          previousVerifiedUser;

        break;

      case "waste-report":

        allowed =
          citizenVerified &&
          citizenLocationSaved;

        break;

      case "admin":

        allowed =
          citizenVerified &&
          citizenLocationSaved;

        break;

      default:

        allowed = false;

        break;
    }

    // =======================================================
    // ALLOWED
    // =======================================================

    if (allowed) {
      scrollToTop();

      closeMenu();

      navigate(path);

      return;
    }

    // =======================================================
    // BLOCKED
    // =======================================================

    let redirectTo = "/";

    let message =
      "Please complete the previous step.";

    let messageOdia =
      "(ଦୟାକରି ପୂର୍ବ ପଦକ୍ଷେପଟି ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।)";

    // =======================================================
    // WASTE REPORT
    // =======================================================

    if (
      requiredStep === "waste-report"
    ) {
      /*
        IMPORTANT:

        Waste Report MUST remain on:

        /report-waste

        StepGuard will show the blocked screen there.
      */

      redirectTo = "/report-waste";

      message =
        "Please complete the previous step before reporting waste.";

      messageOdia =
        "(ଆବର୍ଜନା ରିପୋର୍ଟ କରିବା ପୂର୍ବରୁ ପୂର୍ବ ପଦକ୍ଷେପଟି ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।)";
    }

    // =======================================================
    // HOME NOT STARTED
    // =======================================================

    else if (!homeStarted) {

      redirectTo = "/";

      message =
        "Please start the reporting journey from the Home page.";

      messageOdia =
        "(ହୋମ୍ ପେଜ୍‌ରୁ ରିପୋର୍ଟିଂ ପ୍ରକ୍ରିୟା ଆରମ୍ଭ କରନ୍ତୁ।)";
    }

    // =======================================================
    // CITIZEN NOT VERIFIED
    // =======================================================

    else if (!citizenVerified) {

      redirectTo = "/citizen-details";

      message =
        "Please complete citizen verification first.";

      messageOdia =
        "(ଦୟାକରି ପ୍ରଥମେ ନାଗରିକ ଯାଞ୍ଚ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।)";
    }

    // =======================================================
    // CITIZEN LOCATION NOT SAVED
    // =======================================================

    else if (!citizenLocationSaved) {

      redirectTo = "/citizen-details";

      message =
        "Please save your citizen location first.";

      messageOdia =
        "(ଦୟାକରି ପ୍ରଥମେ ଆପଣଙ୍କ ନାଗରିକ ସ୍ଥାନ ସେଭ୍ କରନ୍ତୁ।)";
    }

    // =======================================================
    // REDIRECT
    // =======================================================

    closeMenu();

    navigate(
      redirectTo,
      {
        replace: false,

        state: {
          blocked: true,
          from: path,
          requiredStep,
          message,
          messageOdia,
        },
      }
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={() => {
            closeMenu();
            scrollToTop();
          }}
        >
          <span className="logo-icon">
            ♻️
          </span>

          <div className="logo-text">
            <strong>
              SWACHHLENS
            </strong>

            <small>
              AI Waste Intelligence
            </small>
          </div>
        </NavLink>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className={`mobile-menu-btn ${
            menuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div
          className={`navbar-links ${
            menuOpen ? "mobile-open" : ""
          }`}
        >

          {/* ===============================================
              HOME
          =============================================== */}

          <NavLink
            to="/"
            end
            onClick={() => {
              closeMenu();
              scrollToTop();
            }}
            className={({ isActive }) =>
              `nav-btn ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">
              🏠
            </span>

            <span>
              Home
            </span>
          </NavLink>

          {/* ===============================================
              CITIZEN DETAILS
          =============================================== */}
<button
  type="button"
  className={`nav-btn ${
    isCurrentPage(
      "/citizen-details"
    )
      ? "active"
      : ""
  }`}
  onClick={() => {
    closeMenu();
    scrollToTop();
    navigate("/citizen-details");
  }}
>
  <span className="nav-icon">
    👤
  </span>

  <span>
    Citizen Details
  </span>
</button>
          {/* ===============================================
              WASTE REPORT
          =============================================== */}

          <button
            type="button"
            className={`nav-btn ${
              isCurrentPage(
                "/report-waste"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleProtectedNavigation(
                "/report-waste",
                "waste-report"
              )
            }
          >
            <span className="nav-icon">
              ♻️
            </span>

            <span>
              Waste Report
            </span>
          </button>
{/* ===============================================
    RESPONSE CENTER
=============================================== */}

<button
  type="button"
  className={`nav-btn ${
    isCurrentPage("/admin") ||
    isCurrentPage("/response-center")
      ? "active"
      : ""
  }`}
  onClick={() => {
    closeMenu();
    scrollToTop();

    navigate("/response-center");
  }}
>
  <span className="nav-icon">
    🏛️
  </span>

  <span>
    Response Center
  </span>
</button>
          {/* ===============================================
              REPORT ANALYSIS & STATUS
          =============================================== */}

          <button
            type="button"
            className={`nav-btn ${
              isCurrentPage(
                "/report-analysis-status"
              )
                ? "active"
                : ""
            }`}
            onClick={() => {

              closeMenu();

              scrollToTop();

              /*
                IMPORTANT:

                Report Analysis & Status is a
                direct-access page.

                It accepts:

                Report ID + Email

                Therefore it does NOT require:

                homeStarted
                citizenVerified
                citizenLocationSaved
              */

              navigate(
                "/report-analysis-status"
              );

            }}
          >
            <span className="nav-icon">
              📊
            </span>

            <span>
              Report Analysis &amp; Status
            </span>
          </button>

          {/* ===============================================
              SWACHHLENS ADMIN
          =============================================== */}

          <button
            type="button"
            className={`nav-btn ${
              isCurrentPage("/swachhlens-admin")
                ? "active"
                : ""
            }`}
            onClick={() => {
              closeMenu();
              scrollToTop();
              navigate("/swachhlens-admin");
            }}
          >
            <span className="nav-icon">
              🛡️
            </span>

            <span>
              SWACHHLENS Admin
            </span>
          </button>

          {/* ===============================================
              ABOUT
          =============================================== */}

          <NavLink
            to="/about"
            onClick={() => {
              closeMenu();
              scrollToTop();
            }}
            className={({ isActive }) =>
              `nav-btn ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">
              ℹ️
            </span>

            <span>
              About
            </span>
          </NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;