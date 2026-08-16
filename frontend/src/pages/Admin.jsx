import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";

function Admin() {

  const navigate =
    useNavigate();

  // =================================================
  // RESPONSE CENTER ACCESS
  // =================================================

  const [
    reportIdInput,
    setReportIdInput,
  ] = useState("");

  const [
    reportVerified,
    setReportVerified,
  ] = useState(false);

  const [
    reportVerificationLoading,
    setReportVerificationLoading,
  ] = useState(false);

  const [
    reportVerificationError,
    setReportVerificationError,
  ] = useState("");


  // =================================================
  // ORGANIZATION STATE
  // =================================================

  const [
    organizations,
    setOrganizations,
  ] = useState([]);

  const [
    organizationsLoading,
    setOrganizationsLoading,
  ] = useState(false);

  const [
    organizationsError,
    setOrganizationsError,
  ] = useState("");

  const [
    showAllOrganizations,
    setShowAllOrganizations,
  ] = useState(false);


  // =================================================
  // SUGGESTION STATE
  // =================================================

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const [
    suggestionsLoading,
    setSuggestionsLoading,
  ] = useState(false);

  const [
    suggestionsError,
    setSuggestionsError,
  ] = useState("");

  const [
    suggestionsLoaded,
    setSuggestionsLoaded,
  ] = useState(false);

  const [
    selectedOrganizationId,
    setSelectedOrganizationId,
  ] = useState(null);


  // =================================================
  // VERIFY REPORT ID
  // =================================================

  const verifyReportId =
    async () => {

      setReportVerificationError("");

      const normalizedReportId =
        reportIdInput
          .trim()
          .toUpperCase();

      if (!normalizedReportId) {

        setReportVerificationError(
          "Please enter your Report ID first."
        );

        return;
      }

      try {

        setReportVerificationLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/waste-reports`
          );

        let data;

        try {

          data =
            await response.json();

        } catch {

          throw new Error(
            "Invalid response from report server."
          );
        }

        if (
          !response.ok ||
          !data?.success ||
          !Array.isArray(
            data?.reports
          )
        ) {

          throw new Error(
            data?.message ||
              "Unable to verify Report ID."
          );
        }

        const matchedReport =
          data.reports.find(
            (report) =>
              String(
                report?.reportId || ""
              )
                .trim()
                .toUpperCase() ===
              normalizedReportId
          );

        if (!matchedReport) {

          setReportVerificationError(
            "Report ID not found. Please check your Report ID and try again."
          );

          return;
        }

        // ------------------------------------------------
        // SAVE VERIFIED REPORT ID
        // ------------------------------------------------

        sessionStorage.setItem(
          "swachhlens_response_center_report_id",
          matchedReport.reportId
        );

        sessionStorage.setItem(
          "swachhlens_response_center_access",
          "true"
        );

        setReportIdInput(
          matchedReport.reportId
        );

        setReportVerified(
          true
        );

        // ------------------------------------------------
        // RESET OLD SUGGESTIONS
        // ------------------------------------------------

        setSuggestions([]);

        setSuggestionsLoaded(
          false
        );

        setSuggestionsError(
          ""
        );

        setSelectedOrganizationId(
          null
        );

      } catch (error) {

        console.error(
          "❌ Response Center Report Verification Error:",
          error
        );

        setReportVerificationError(
          error.message ||
            "Unable to verify Report ID."
        );

      } finally {

        setReportVerificationLoading(
          false
        );

      }
    };


  // =================================================
  // RESTORE VERIFIED REPORT CENTER ACCESS
  // =================================================

  useEffect(() => {

    const savedReportId =
      sessionStorage.getItem(
        "swachhlens_response_center_report_id"
      );

    const savedAccess =
      sessionStorage.getItem(
        "swachhlens_response_center_access"
      ) === "true";

    if (
      savedReportId &&
      savedAccess
    ) {

      setReportIdInput(
        savedReportId
      );

      setReportVerified(
        true
      );

    }

  }, []);


  // =================================================
  // LOAD ALL ORGANIZATIONS
  // =================================================

  useEffect(() => {

    if (!reportVerified) {
      return;
    }

    const loadOrganizations =
      async () => {

        try {

          setOrganizationsLoading(
            true
          );

          setOrganizationsError("");

          const response =
            await fetch(
              `${API_BASE_URL}/api/organizations`
            );

          let data;

          try {

            data =
              await response.json();

          } catch {

            throw new Error(
              "Invalid response from organization server."
            );
          }

          if (
            !response.ok ||
            !data?.success ||
            !Array.isArray(
              data?.organizations
            )
          ) {

            throw new Error(
              data?.message ||
                "Unable to load organizations."
            );
          }

          setOrganizations(
            data.organizations
          );

        } catch (error) {

          console.error(
            "❌ Organization Loading Error:",
            error
          );

          setOrganizationsError(
            error.message ||
              "Unable to load organizations."
          );

        } finally {

          setOrganizationsLoading(
            false
          );

        }
      };

    loadOrganizations();

  }, [reportVerified]);


  // =================================================
  // FIND SMART ORGANIZATION SUGGESTIONS
  // =================================================

  const findOrganizationSuggestions =
    async () => {

      const normalizedReportId =
        reportIdInput
          .trim();

      if (!normalizedReportId) {

        setSuggestionsError(
          "Please enter a valid Report ID."
        );

        return;
      }

      try {

        setSuggestionsLoading(
          true
        );

        setSuggestionsError("");

        setSuggestionsLoaded(
          false
        );

        setSelectedOrganizationId(
          null
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/response/suggestions/${encodeURIComponent(
              normalizedReportId
            )}`
          );

        let data;

        try {

          data =
            await response.json();

        } catch {

          throw new Error(
            "Invalid response from response intelligence server."
          );

        }

        if (
          !response.ok ||
          !data?.success ||
          !Array.isArray(
            data?.suggestions
          )
        ) {

          throw new Error(
            data?.message ||
              "Unable to generate organization suggestions."
          );

        }

        setSuggestions(
          data.suggestions
        );

        setSuggestionsLoaded(
          true
        );

      } catch (error) {

        console.error(
          "❌ Organization Suggestion Error:",
          error
        );

        setSuggestions([]);

        setSuggestionsError(
          error.message ||
            "Unable to generate organization suggestions."
        );

      } finally {

        setSuggestionsLoading(
          false
        );

      }
    };


  // =================================================
  // SUBMIT SELECTED ORGANIZATION
  // =================================================

  const submitSelectedOrganization =
    () => {

      if (
        !selectedOrganizationId
      ) {
        return;
      }

      const selectedOrganization =
        suggestions.find(
          (organization) =>
            String(
              organization.organizationId
            ) ===
            String(
              selectedOrganizationId
            )
        );

      if (
        !selectedOrganization
      ) {

        setSuggestionsError(
          "Selected organization could not be found."
        );

        return;
      }

      // ------------------------------------------------
      // SAVE SELECTED ORGANIZATION
      // ------------------------------------------------

      sessionStorage.setItem(
        "swachhlens_selected_response_organization",
        JSON.stringify(
          selectedOrganization
        )
      );

      sessionStorage.setItem(
        "swachhlens_response_request_report_id",
        reportIdInput.trim()
      );

      // ------------------------------------------------
      // NEXT PAGE
      // ------------------------------------------------

      navigate(
        "/response-request"
      );
    };


  // =================================================
  // CHANGE REPORT ID
  // =================================================

  const changeReportId =
    () => {

      sessionStorage.removeItem(
        "swachhlens_response_center_report_id"
      );

      sessionStorage.removeItem(
        "swachhlens_response_center_access"
      );

      sessionStorage.removeItem(
        "swachhlens_selected_response_organization"
      );

      sessionStorage.removeItem(
        "swachhlens_response_request_report_id"
      );

      setReportVerified(
        false
      );

      setReportIdInput(
        ""
      );

      setReportVerificationError(
        ""
      );

      setSuggestions([]);

      setSuggestionsLoaded(
        false
      );

      setSuggestionsError(
        ""
      );

      setSelectedOrganizationId(
        null
      );

    };


  // =================================================
  // CONTINUE TO NEW REPORT
  // HOME PAGE
  // =================================================

  const continueToNewReport =
    () => {

      sessionStorage.removeItem(
        "swachhlens_response_center_report_id"
      );

      sessionStorage.removeItem(
        "swachhlens_response_center_access"
      );

      sessionStorage.removeItem(
        "swachhlens_selected_response_organization"
      );

      sessionStorage.removeItem(
        "swachhlens_response_request_report_id"
      );

      navigate(
        "/"
      );

    };


  // =================================================
  // VISIBLE ORGANIZATIONS
  // =================================================

  const visibleOrganizations =
    showAllOrganizations
      ? organizations
      : organizations.slice(
          0,
          8
        );


  // =================================================
  // RESPONSE CENTER ACCESS GATE
  // =================================================

  if (!reportVerified) {

    return (
      <main className="response-center-page">

        <section className="response-center-card">

          <div className="response-center-header">

            <span className="response-center-badge">
              ♻️ SWACHHLENS RESPONSE CENTER
            </span>

            <h1>
              Enter Your Report ID
            </h1>

            <p>
              Enter your valid SWACHHLENS Report ID
              to enter our Response Center.
            </p>

            <p>
              (ଆମ Response Center ରେ ପ୍ରବେଶ କରିବା ପାଇଁ
              ଆପଣଙ୍କର ସଠିକ୍ SWACHHLENS Report ID ପ୍ରବେଶ କରନ୍ତୁ।)
            </p>

          </div>


          <section className="find-organization-section">

            <div className="section-header">

              <div>

                <span>
                  SECURE REPORT ACCESS
                </span>

                <h2>
                  Verify Your Report
                </h2>

                <p>
                  Your Report ID is required before
                  accessing organization response services.
                </p>

              </div>

              <span className="smart-match-badge">
                🔐 VERIFIED ACCESS
              </span>

            </div>


            <div className="report-id-search-box">

              <label>
                Report ID
              </label>

              <div className="report-id-search-form">

                <div className="report-id-input-wrapper">

                  <span>
                    #
                  </span>

                  <input
                    type="text"
                    value={reportIdInput}
                    onChange={(event) => {

                      setReportIdInput(
                        event.target.value
                      );

                      setReportVerificationError(
                        ""
                      );

                    }}
                    onKeyDown={(event) => {

                      if (
                        event.key === "Enter"
                      ) {

                        verifyReportId();

                      }

                    }}
                    placeholder="Enter your Report ID"
                    autoComplete="off"
                  />

                </div>

                <button
                  type="button"
                  className="find-organization-button"
                  onClick={
                    verifyReportId
                  }
                  disabled={
                    reportVerificationLoading
                  }
                >

                  {reportVerificationLoading
                    ? "Verifying..."
                    : "🔐 Enter Response Center"}

                </button>

              </div>


              {reportVerificationError && (

                <div
                  style={{
                    marginTop: "12px",
                    padding: "11px 14px",
                    borderRadius: "12px",
                    background:
                      "#fff0f3",
                    border:
                      "1px solid #ff2d55",
                    color:
                      "#000000",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  ⚠️{" "}
                  {reportVerificationError}
                </div>

              )}


              <small>
                Only a valid SWACHHLENS Report ID can
                enter the Response Center.
              </small>

            </div>


            {/* =================================================
                CONTINUE TO NEW REPORT
            ================================================= */}

            <div className="organization-suggestion-placeholder">

              <div className="suggestion-icon">
                ♻️
              </div>

              <h3>
                Don't have a Report ID?
              </h3>

              <p>
                Create a new waste report first to
                receive your Report ID.
              </p>

              <p>
                (ଆପଣଙ୍କ ପାଖରେ Report ID ନାହିଁ କି?
                ପ୍ରଥମେ ଏକ ନୂଆ ଆବର୍ଜନା ରିପୋର୍ଟ କରନ୍ତୁ
                ଏବଂ Report ID ପାଆନ୍ତୁ।)
              </p>

              <button
                type="button"
                className="view-more-organizations"
                onClick={
                  continueToNewReport
                }
              >
                ➕ Continue to New Report →
              </button>

            </div>

          </section>

        </section>

      </main>
    );

  }


  // =================================================
  // RESPONSE CENTER
  // =================================================

  return (
    <main className="response-center-page">

      <section className="response-center-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="response-center-header">

          <span className="response-center-badge">
            ♻️ SWACHHLENS RESPONSE CENTER
          </span>

          <h1>
            Response Center
          </h1>

          <p>
            Find the right organization to respond to
            your waste report.
          </p>

          <p>
            📌 Report ID:
            {" "}
            <strong>
              {reportIdInput}
            </strong>
          </p>

          <p>
            (ଆପଣଙ୍କ ଆବର୍ଜନା ରିପୋର୍ଟ ପାଇଁ ଉପଯୁକ୍ତ
            ସଂଗଠନ ଖୋଜନ୍ତୁ।)
          </p>

        </div>


        {/* =================================================
            ORGANIZATION NETWORK
        ================================================= */}

        <section className="organization-network-section">

          <div className="section-header">

            <div>

              <span>
                ORGANIZATION NETWORK
              </span>

              <h2>
                Available Organizations
              </h2>

              <p>
                Browse organizations available through
                the SWACHHLENS network.
              </p>

            </div>

            <span className="organization-live-status">
              ● LIVE
            </span>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {organizationsLoading && (

            <div className="organization-grid">

              {[1, 2, 3, 4].map(
                (item) => (

                  <article
                    className="organization-card"
                    key={item}
                  >

                    <div className="organization-card-icon">
                      🏛️
                    </div>

                    <div className="organization-card-content">

                      <h3>
                        Loading organization...
                      </h3>

                      <span>
                        📍 Loading location...
                      </span>

                      <strong>
                        ⭐ —
                      </strong>

                    </div>

                  </article>

                )
              )}

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {!organizationsLoading &&
            organizationsError && (

              <div className="organization-suggestion-placeholder">

                <div className="suggestion-icon">
                  ⚠️
                </div>

                <h3>
                  Unable to load organizations
                </h3>

                <p>
                  {organizationsError}
                </p>

              </div>

            )}


          {/* =================================================
              ORGANIZATIONS
          ================================================= */}

          {!organizationsLoading &&
            !organizationsError &&
            organizations.length > 0 && (

              <div className="organization-grid">

                {visibleOrganizations.map(
                  (
                    organization,
                    index
                  ) => (

                    <article
                      className="organization-card"
                      key={
                        organization._id ||
                        `${organization.organizationName}-${index}`
                      }
                    >

                      <div className="organization-card-icon">
                        🏛️
                      </div>

                      <div className="organization-card-content">

                        <h3>
                          {
                            organization.organizationName ||
                            "Organization"
                          }
                        </h3>

                        <span>
                          📍{" "}
                          {
                            organization.location?.city ||
                            "Location"
                          }

                          {organization.location?.district
                            ? `, ${organization.location.district}`
                            : ""}

                          {organization.location?.state
                            ? `, ${organization.location.state}`
                            : ""}
                        </span>

                        <strong>
                          ⭐{" "}
                          {
                            organization.rating ??
                            "—"
                          }
                        </strong>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}


          {/* =================================================
              NO ORGANIZATIONS
          ================================================= */}

          {!organizationsLoading &&
            !organizationsError &&
            organizations.length === 0 && (

              <div className="organization-suggestion-placeholder">

                <div className="suggestion-icon">
                  🏛️
                </div>

                <h3>
                  No organizations available
                </h3>

                <p>
                  Organizations will appear here
                  once they are available in the
                  SWACHHLENS network.
                </p>

              </div>

            )}


          {/* =================================================
              VIEW MORE
          ================================================= */}

          {!organizationsLoading &&
            !organizationsError &&
            organizations.length > 8 && (

              <button
                type="button"
                className="view-more-organizations"
                onClick={() =>
                  setShowAllOrganizations(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showAllOrganizations
                  ? "Show Less ↑"
                  : "View More Organizations →"}
              </button>

            )}

        </section>


        {/* =================================================
            FIND YOUR ORGANIZATION
        ================================================= */}

        <section className="find-organization-section">

          <div className="section-header">

            <div>

              <span>
                SMART ORGANIZATION MATCHING
              </span>

              <h2>
                Find Your Organization
              </h2>

              <p>
                Your report details will be analyzed to
                recommend suitable response organizations.
              </p>

            </div>

            <span className="smart-match-badge">
              AI MATCH
            </span>

          </div>


          {/* =================================================
              VERIFIED REPORT ID
          ================================================= */}

          <div className="report-id-search-box">

            <label>
              Report ID
            </label>

            <div className="report-id-search-form">

              <div className="report-id-input-wrapper">

                <span>
                  #
                </span>

                <input
                  type="text"
                  value={reportIdInput}
                  readOnly
                  autoComplete="off"
                />

              </div>

              <button
                type="button"
                className="find-organization-button"
                onClick={
                  findOrganizationSuggestions
                }
                disabled={
                  suggestionsLoading
                }
              >
                {suggestionsLoading
                  ? "Finding Organizations..."
                  : "🔎 Find Organizations"}
              </button>

            </div>

            <small>
              SWACHHLENS will analyze your report's
              location, waste type and response-support
              factors to generate suitable suggestions.
            </small>

          </div>


          {/* =================================================
              SUGGESTION ERROR
          ================================================= */}

          {suggestionsError && (

            <div
              className="organization-suggestion-placeholder"
            >

              <div className="suggestion-icon">
                ⚠️
              </div>

              <h3>
                Unable to generate suggestions
              </h3>

              <p>
                {suggestionsError}
              </p>

            </div>

          )}


          {/* =================================================
              LOADING SUGGESTIONS
          ================================================= */}

          {suggestionsLoading && (

            <div
              className="organization-suggestion-placeholder"
            >

              <div className="suggestion-icon">
                🤖
              </div>

              <h3>
                Finding suitable organizations...
              </h3>

              <p>
                SWACHHLENS is analyzing your report and
                matching organizations according to
                location, waste type and response support.
              </p>

              <p>
                (ଆପଣଙ୍କ ରିପୋର୍ଟ ଅନୁଯାୟୀ ଉପଯୁକ୍ତ
                ସଂଗଠନ ଖୋଜାଯାଉଛି।)
              </p>

            </div>

          )}


          {/* =================================================
              NO MATCHES
          ================================================= */}

          {suggestionsLoaded &&
            !suggestionsLoading &&
            !suggestionsError &&
            suggestions.length === 0 && (

              <div
                className="organization-suggestion-placeholder"
              >

                <div className="suggestion-icon">
                  🔎
                </div>

                <h3>
                  No suitable organization found
                </h3>

                <p>
                  No active organization currently matches
                  the available response factors for this report.
                </p>

                <p>
                  (ଏହି ରିପୋର୍ଟ ପାଇଁ ବର୍ତ୍ତମାନ କୌଣସି
                  ଉପଯୁକ୍ତ ସଂଗଠନ ମିଳିଲା ନାହିଁ।)
                </p>

              </div>

            )}


          {/* =================================================
              SMART SUGGESTIONS
          ================================================= */}

          {suggestionsLoaded &&
            !suggestionsLoading &&
            !suggestionsError &&
            suggestions.length > 0 && (

              <div
                style={{
                  marginTop: "18px",
                }}
              >

                <div
                  className="section-header"
                  style={{
                    marginBottom: "14px",
                  }}
                >

                  <div>

                    <span>
                      RECOMMENDED RESPONSE PARTNERS
                    </span>

                    <h2>
                      Suggested Organizations
                    </h2>

                    <p>
                      Select exactly one organization
                      for your report response.
                    </p>

                  </div>

                  <span className="smart-match-badge">
                    {suggestions.length} MATCH
                    {suggestions.length === 1
                      ? ""
                      : "ES"}
                  </span>

                </div>


                <div className="organization-grid">

                  {suggestions.map(
                    (
                      organization,
                      index
                    ) => {

                      const selected =
                        selectedOrganizationId ===
                        String(
                          organization.organizationId
                        );

                      return (
                        <button
                          type="button"
                          key={
                            organization.organizationId ||
                            `${organization.organizationName}-${index}`
                          }
                          onClick={() => {

                            setSelectedOrganizationId(
                              String(
                                organization.organizationId
                              )
                            );

                          }}
                          style={{
                            all: "unset",
                            cursor: "pointer",
                            display: "block",
                            minWidth: 0,
                          }}
                        >

                          <article
                            className="organization-card"
                            style={{
                              height: "100%",

                              border:
                                selected
                                  ? "3px solid #ff2d55"
                                  : undefined,

                              boxShadow:
                                selected
                                  ? "0 0 0 3px rgba(255,45,85,0.15), 0 16px 36px rgba(203,72,133,0.18)"
                                  : undefined,
                            }}
                          >

                            <div className="organization-card-icon">
                              {selected
                                ? "✅"
                                : "🏛️"}
                            </div>

                            <div className="organization-card-content">

                              <h3>
                                {
                                  organization.organizationName ||
                                  "Organization"
                                }
                              </h3>

                              <span>
                                📍{" "}
                                {
                                  organization.location?.city ||
                                  "Location"
                                }

                                {organization.location?.district
                                  ? `, ${organization.location.district}`
                                  : ""}

                                {organization.location?.state
                                  ? `, ${organization.location.state}`
                                  : ""}
                              </span>

                              <strong>
                                ⭐{" "}
                                {
                                  organization.rating ??
                                  "—"
                                }
                              </strong>

                            </div>

                          </article>

                        </button>
                      );

                    }
                  )}

                </div>


                {/* =================================================
                    SELECTION STATUS
                ================================================= */}

                <div
                  className="report-id-search-box"
                  style={{
                    marginTop: "18px",
                  }}
                >

                  <label>
                    Organization Selection
                  </label>

                  {selectedOrganizationId ? (

                    <>

                      <small
                        style={{
                          marginTop: 0,
                          color: "#000000",
                          fontSize: "12px",
                          fontWeight: "900",
                        }}
                      >
                        ✅ One organization selected successfully.
                      </small>

                      <button
                        type="button"
                        className="find-organization-button"
                        style={{
                          width: "100%",
                          marginTop: "14px",
                        }}
                        onClick={
                          submitSelectedOrganization
                        }
                      >
                        ➡️ Submit Report
                      </button>

                    </>

                  ) : (

                    <small
                      style={{
                        marginTop: 0,
                        color: "#000000",
                        fontSize: "12px",
                        fontWeight: "900",
                      }}
                    >
                      ⚠️ Please select exactly one organization
                      from the suggestions above.
                    </small>

                  )}

                </div>

              </div>

            )}

        </section>


        {/* =================================================
            CHANGE REPORT ID
        ================================================= */}

        <button
          type="button"
          className="view-more-organizations"
          onClick={
            changeReportId
          }
        >
          🔄 Change Report ID
        </button>

      </section>

    </main>
  );
}

export default Admin;