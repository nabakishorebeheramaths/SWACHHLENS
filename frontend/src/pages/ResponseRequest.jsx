import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./ResponseRequest.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";

function ResponseRequest() {

  const navigate =
    useNavigate();


  // =========================================================
  // SELECTED ORGANIZATION
  // =========================================================

  const [
    selectedOrganization,
    setSelectedOrganization,
  ] = useState(null);


  // =========================================================
  // REPORT DATA
  // =========================================================

  const [
    reportData,
    setReportData,
  ] = useState(null);


  // =========================================================
  // PAGE LOADING
  // =========================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    pageError,
    setPageError,
  ] = useState("");


  // =========================================================
  // FEEDBACK
  // =========================================================

  const [
    feedbackReason,
    setFeedbackReason,
  ] = useState("");


  const [
    additionalFeedback,
    setAdditionalFeedback,
  ] = useState("");


  // =========================================================
  // APPOINTMENT
  // =========================================================

  const [
    appointmentRequired,
    setAppointmentRequired,
  ] = useState(false);


  const [
    appointmentDate,
    setAppointmentDate,
  ] = useState("");


  const [
    appointmentTime,
    setAppointmentTime,
  ] = useState("");


  const [
    appointmentNote,
    setAppointmentNote,
  ] = useState("");


  // =========================================================
  // FINAL SUBMIT
  // =========================================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    submitError,
    setSubmitError,
  ] = useState("");


  // =========================================================
  // LOAD SELECTED ORGANIZATION + REPORT
  // =========================================================

  useEffect(() => {

    const loadResponseData =
      async () => {

        try {

          setLoading(true);

          setPageError("");


          // -------------------------------------------------
          // GET SELECTED ORGANIZATION
          // -------------------------------------------------

          const savedOrganization =
            sessionStorage.getItem(
              "swachhlens_selected_response_organization"
            );


          const savedReportId =
            sessionStorage.getItem(
              "swachhlens_response_center_report_id"
            );


          if (
            !savedOrganization ||
            !savedReportId
          ) {

            throw new Error(
              "Selected organization or Report ID is missing."
            );

          }


          let organization;


          try {

            organization =
              JSON.parse(
                savedOrganization
              );

          } catch {

            throw new Error(
              "Unable to read selected organization."
            );

          }


          setSelectedOrganization(
            organization
          );


          // -------------------------------------------------
          // LOAD ACTUAL REPORT FROM RESPONSE API
          // -------------------------------------------------

          const response =
            await fetch(
              `${API_BASE_URL}/api/response/report/${encodeURIComponent(
                savedReportId
              )}`,
              {
                method: "GET",
                credentials: "include",
              }
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
            !data?.report
          ) {

            throw new Error(
              data?.message ||
                "Unable to load report details."
            );

          }


          setReportData(
            data.report
          );

        } catch (error) {

          console.error(
            "❌ Response Request Loading Error:",
            error
          );


          setPageError(
            error.message ||
              "Unable to load response request details."
          );

        } finally {

          setLoading(false);

        }

      };


    loadResponseData();

  }, []);


  // =========================================================
  // FEEDBACK OPTIONS
  // =========================================================

  const feedbackOptions = [

    "It is suitable for my report",

    "It serves my waste location",

    "It supports this type of waste",

    "It appears capable of handling the issue",

    "It is the most suitable available organization",

  ];


  // =========================================================
  // FINAL SUBMIT
  // =========================================================

  const handleFinalSubmit =
    async () => {

      setSubmitError("");


      // -----------------------------------------------------
      // BASIC VALIDATION
      // -----------------------------------------------------

      if (
        !selectedOrganization
      ) {

        setSubmitError(
          "Selected organization is missing."
        );

        return;

      }


      if (
        !reportData
      ) {

        setSubmitError(
          "Report details are missing."
        );

        return;

      }


      if (
        !feedbackReason
      ) {

        setSubmitError(
          "Please select one feedback reason."
        );

        return;

      }


      if (
        appointmentRequired &&
        !appointmentDate
      ) {

        setSubmitError(
          "Please select an appointment date."
        );

        return;

      }

if (
  appointmentRequired &&
  !/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(
    appointmentTime
  )
) {
  setSubmitError(
    "Please enter a valid appointment time in hh:mm AM/PM format."
  );

  return;
}


      try {

        setSubmitting(true);


        // ---------------------------------------------------
        // FINAL RESPONSE REQUEST PAYLOAD
        // ---------------------------------------------------

        const payload = {

          reportId:
            reportData.reportId,

          organizationId:
            selectedOrganization.organizationId,

          organizationName:
            selectedOrganization.organizationName,

          feedback: {

            reason:
              feedbackReason,

            additionalFeedback:
              additionalFeedback.trim(),

          },


          appointment: {

            requested:
              appointmentRequired,

            date:
              appointmentRequired
                ? appointmentDate
                : null,

            time:
              appointmentRequired
                ? appointmentTime
                : null,

            note:
              appointmentRequired
                ? appointmentNote.trim()
                : "",

          },

        };


        // ---------------------------------------------------
        // SAVE TEMPORARY REQUEST
        // ---------------------------------------------------

        sessionStorage.setItem(
          "swachhlens_response_request_payload",
          JSON.stringify(
            payload
          )
        );


        // ---------------------------------------------------
        // FINAL BACKEND SUBMISSION
        // ---------------------------------------------------

        const response =
          await fetch(
            `${API_BASE_URL}/api/response/request`,
            {

              method:
                "POST",

              credentials:
                "include",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify(
                  payload
                ),

            }
          );


        let data;


        try {

          data =
            await response.json();

        } catch {

          throw new Error(
            "Invalid response from response request server."
          );

        }


        // ---------------------------------------------------
        // BACKEND ERROR
        // ---------------------------------------------------

        if (
          !response.ok ||
          !data?.success
        ) {

          throw new Error(
            data?.message ||
              "Unable to submit response request."
          );

        }


        // ---------------------------------------------------
        // SAVE FINAL RESPONSE REQUEST RESULT
        // ---------------------------------------------------

        if (
          data.responseRequest
        ) {

          sessionStorage.setItem(
            "swachhlens_response_request",
            JSON.stringify(
              data.responseRequest
            )
          );

        }


        // ---------------------------------------------------
        // SAVE FINAL SUBMISSION STATUS
        // ---------------------------------------------------

        sessionStorage.setItem(
          "swachhlens_response_request_submitted",
          "true"
        );


        // ---------------------------------------------------
        // SUCCESS PAGE / STATUS
        // ---------------------------------------------------

        navigate(
          "/report-analysis-status"
        );


      } catch (error) {

        console.error(
          "❌ Final Response Request Error:",
          error
        );


        setSubmitError(
          error.message ||
            "Unable to submit your response request."
        );

      } finally {

        setSubmitting(false);

      }

    };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading
  ) {

    return (
      <main className="response-request-page">

        <section className="response-request-card">

          <div className="response-request-loading">

            <div className="response-request-loading-icon">
              ♻️
            </div>

            <h2>
              Loading Response Request...
            </h2>

            <p>
              Your selected organization and report
              details are being prepared.
            </p>

            <p>
              (ଆପଣଙ୍କ ଚୟନିତ ସଂଗଠନ ଓ ରିପୋର୍ଟ
              ବିବରଣୀ ପ୍ରସ୍ତୁତ କରାଯାଉଛି।)
            </p>

          </div>

        </section>

      </main>
    );

  }


  // =========================================================
  // PAGE ERROR
  // =========================================================

  if (
    pageError ||
    !selectedOrganization ||
    !reportData
  ) {

    return (
      <main className="response-request-page">

        <section className="response-request-card">

          <div className="response-request-error">

            <div className="response-request-error-icon">
              ⚠️
            </div>

            <h2>
              Unable to Open Response Request
            </h2>

            <p>
              {
                pageError ||
                "Required response information is missing."
              }
            </p>

            <button
              type="button"
              className="response-request-secondary-btn"
              onClick={() =>
                navigate(
                  "/admin"
                )
              }
            >
              ← Back to Response Center
            </button>

          </div>

        </section>

      </main>
    );

  }


  // =========================================================
  // REPORT AI DATA
  // =========================================================

  const aiAnalysis =
    reportData.aiAnalysis ||
    {};


  const wasteLocation =
    reportData.wasteLocation ||
    reportData.location ||
    {};


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="response-request-page">

      <section className="response-request-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="response-request-header">

          <span className="response-request-badge">
            ♻️ SWACHHLENS RESPONSE REQUEST
          </span>

          <h1>
            Final Response Request
          </h1>

          <p>
            Review your selected organization, report
            details and request options before final submission.
          </p>

          <p>
            (ଅନ୍ତିମ ଦାଖଲ ପୂର୍ବରୁ ଆପଣଙ୍କ ଚୟନିତ ସଂଗଠନ,
            ରିପୋର୍ଟ ଏବଂ ଅନୁରୋଧ ବିବରଣୀ ଯାଞ୍ଚ କରନ୍ତୁ।)
          </p>

        </div>


        {/* =================================================
            SELECTED ORGANIZATION
        ================================================= */}

        <section className="response-request-section">

          <div className="response-request-section-header">

            <div>

              <span>
                SELECTED ORGANIZATION
              </span>

              <h2>
                Your Chosen Response Partner
              </h2>

            </div>

            <span className="response-request-status">
              ✓ SELECTED
            </span>

          </div>


          <article className="selected-organization-card">

            <div className="selected-organization-icon">
              🏛️
            </div>

            <div className="selected-organization-content">

              <h3>
                {
                  selectedOrganization.organizationName
                }
              </h3>

              <p>
                📍{" "}
                {
                  selectedOrganization.location?.city ||
                  "Location"
                }

                {
                  selectedOrganization.location?.district
                    ? `, ${selectedOrganization.location.district}`
                    : ""
                }

                {
                  selectedOrganization.location?.state
                    ? `, ${selectedOrganization.location.state}`
                    : ""
                }
              </p>

              <div className="selected-organization-details">

                <span>
                  ⭐ Rating:{" "}
                  {
                    selectedOrganization.rating ??
                    "—"
                  }
                </span>

                <span>
                  🗺️ Service Area:{" "}
                  {
                    Array.isArray(
                      selectedOrganization.serviceArea
                    ) &&
                    selectedOrganization.serviceArea.length > 0
                      ? selectedOrganization.serviceArea.join(
                          ", "
                        )
                      : "Available area information"
                  }
                </span>

                <span>
                  ♻️ Supported Waste Types:{" "}
                  {
                    Array.isArray(
                      selectedOrganization.wasteTypes
                    ) &&
                    selectedOrganization.wasteTypes.length > 0
                      ? selectedOrganization.wasteTypes.join(
                          ", "
                        )
                      : "Waste support information available"
                  }
                </span>

                <span>
                  {
                    selectedOrganization.prioritySupport
                      ? "🚨 Priority Response Support"
                      : "✅ Response Support Available"
                  }
                </span>

                <span>
                  {
                    selectedOrganization.active
                      ? "🟢 Active Organization"
                      : "🔴 Currently Inactive"
                  }
                </span>

              </div>

            </div>

          </article>


          <button
            type="button"
            className="response-request-secondary-btn"
            onClick={() =>
              navigate(
                "/admin"
              )
            }
          >
            ← Change Organization
          </button>

        </section>


        {/* =================================================
            REPORT DETAILS
        ================================================= */}

        <section className="response-request-section">

          <div className="response-request-section-header">

            <div>

              <span>
                WASTE REPORT
              </span>

              <h2>
                Complete Report Details
              </h2>

            </div>

            <span className="response-request-report-id">
              #{reportData.reportId}
            </span>

          </div>


          <div className="report-details-grid">

            <div className="report-detail-card">

              <span>
                Report ID
              </span>

              <strong>
                {reportData.reportId}
              </strong>

            </div>


            <div className="report-detail-card">

              <span>
                Waste Type
              </span>

              <strong>
                {reportData.wasteType || "—"}
              </strong>

            </div>


            <div className="report-detail-card">

              <span>
                Visible Severity
              </span>

              <strong>
                {
                  reportData.visibleSeverity ||
                  aiAnalysis.visibleSeverity ||
                  "—"
                }
              </strong>

            </div>


            <div className="report-detail-card">

              <span>
                Risk Score
              </span>

              <strong>
                {
                  reportData.riskScore ??
                  aiAnalysis.riskScore ??
                  "—"
                }
              </strong>

            </div>


            <div className="report-detail-card">

              <span>
                Hazard Detected
              </span>

              <strong>
                {
                  (
                    reportData.hazardDetected ??
                    aiAnalysis.hazardDetected
                  )
                    ? "Yes"
                    : "No"
                }
              </strong>

            </div>


            <div className="report-detail-card">

              <span>
                Road Blockage
              </span>

              <strong>
                {
                  (
                    reportData.roadBlockage ??
                    aiAnalysis.roadBlockage
                  )
                    ? "Yes"
                    : "No"
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                Waste Location
              </span>

              <strong>
                📍{" "}
                {
                  wasteLocation.city ||
                  wasteLocation.locality ||
                  "Location"
                }

                {
                  wasteLocation.district
                    ? `, ${wasteLocation.district}`
                    : ""
                }

                {
                  wasteLocation.state
                    ? `, ${wasteLocation.state}`
                    : ""
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                Description
              </span>

              <strong>
                {
                  reportData.description ||
                  "No description available."
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                AI Reason
              </span>

              <strong>
                {
                  reportData.reason ||
                  aiAnalysis.reason ||
                  "No AI reasoning available."
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                Prediction
              </span>

              <strong>
                {
                  reportData.prediction ||
                  aiAnalysis.prediction ||
                  "No prediction available."
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                Recommended Action
              </span>

              <strong>
                {
                  reportData.recommendedAction ||
                  aiAnalysis.recommendedAction ||
                  "No recommended action available."
                }
              </strong>

            </div>


            <div className="report-detail-card report-detail-wide">

              <span>
                Estimated Quantity
              </span>

              <strong>
                {
                  reportData.estimatedQuantity ||
                  aiAnalysis.estimatedQuantity ||
                  "—"
                }
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            WHY SELECTED
        ================================================= */}

        <section className="response-request-section">

          <div className="response-request-section-header">

            <div>

              <span>
                SWACHHLENS FEEDBACK
              </span>

              <h2>
                Why are you choosing this organization?
              </h2>

              <p>
                Select the reason that best matches your choice.
              </p>

            </div>

          </div>


          <div className="feedback-options">

            {
              feedbackOptions.map(
                (
                  option,
                  index
                ) => (

                  <label
                    className={`feedback-option ${
                      feedbackReason === option
                        ? "selected"
                        : ""
                    }`}
                    key={index}
                  >

                    <input
                      type="radio"
                      name="feedbackReason"
                      value={option}
                      checked={
                        feedbackReason === option
                      }
                      onChange={(event) =>
                        setFeedbackReason(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      {option}
                    </span>

                  </label>

                )
              )
            }

          </div>


          <label className="response-request-field-label">
            Additional Feedback
          </label>

          <textarea
            className="response-request-textarea"
            value={
              additionalFeedback
            }
            onChange={(event) =>
              setAdditionalFeedback(
                event.target.value
              )
            }
            placeholder="Add any additional information you would like SWACHHLENS to consider..."
            rows={4}
          />

        </section>


        {/* =================================================
            APPOINTMENT
        ================================================= */}

        <section className="response-request-section">

          <div className="response-request-section-header">

            <div>

              <span>
                APPOINTMENT REQUEST
              </span>

              <h2>
                Do you want an appointment?
              </h2>

              <p>
                Appointment request is optional.
              </p>

            </div>

            <span className="response-request-status">
              OPTIONAL
            </span>

          </div>


          <div className="appointment-toggle-group">

            <label
              className={`appointment-toggle ${
                !appointmentRequired
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="appointmentRequired"
                checked={
                  !appointmentRequired
                }
                onChange={() =>
                  setAppointmentRequired(
                    false
                  )
                }
              />

              <span>
                No, only submit my report
              </span>

            </label>


            <label
              className={`appointment-toggle ${
                appointmentRequired
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="appointmentRequired"
                checked={
                  appointmentRequired
                }
                onChange={() =>
                  setAppointmentRequired(
                    true
                  )
                }
              />

              <span>
                Yes, request an appointment
              </span>

            </label>

          </div>


          {
            appointmentRequired && (

              <div className="appointment-form">

                <div className="appointment-field">

                  <label>
                    Preferred Date
                  </label>

                  <input
                    type="date"
                    value={
                      appointmentDate
                    }
                    onChange={(event) =>
                      setAppointmentDate(
                        event.target.value
                      )
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                  />

                </div>

<div className="appointment-field">

  <label>
    Preferred Time
  </label>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 110px",
      gap: "10px",
      alignItems: "stretch",
    }}
  >

    <input
      type="text"
      inputMode="numeric"
      placeholder="hh:mm"
      value={
        appointmentTime
          ? appointmentTime.split(" ")[0]
          : ""
      }
      onChange={(event) => {

        const value =
          event.target.value
            .replace(/[^\d:]/g, "")
            .slice(0, 5);

        const parts =
          value.split(":");

        let formatted =
          value;

        if (
          parts[0]?.length === 2 &&
          !value.includes(":")
        ) {
          formatted =
            `${parts[0]}:`;
        }

        setAppointmentTime(
          `${formatted} ${
            appointmentTime?.split(" ")[1] ||
            "AM"
          }`
        );

      }}
      style={{
        width: "100%",
      }}
    />

    <select
      value={
        appointmentTime?.split(" ")[1] ||
        "AM"
      }
      onChange={(event) => {

        const timePart =
          appointmentTime?.split(" ")[0] ||
          "";

        setAppointmentTime(
          `${timePart} ${event.target.value}`
        );

      }}
      style={{
        width: "100%",
      }}
    >

      <option value="AM">
        AM
      </option>

      <option value="PM">
        PM
      </option>

    </select>

  </div>

  <small
    style={{
      display: "block",
      marginTop: "7px",
      color: "#000000",
      fontSize: "9px",
      fontWeight: 700,
    }}
  >
    Enter time in 12-hour format and select AM or PM.
  </small>

</div>
                <div className="appointment-field appointment-field-wide">

                  <label>
                    Appointment Note
                  </label>

                  <textarea
                    value={
                      appointmentNote
                    }
                    onChange={(event) =>
                      setAppointmentNote(
                        event.target.value
                      )
                    }
                    placeholder="Add any note for the appointment request..."
                    rows={4}
                  />

                </div>

              </div>

            )
          }

        </section>


        {/* =================================================
            FINAL CONFIRMATION
        ================================================= */}

        <section className="response-request-final-section">

          <div className="response-request-final-icon">
            ✅
          </div>

          <h2>
            Ready to Submit?
          </h2>

          <p>
            Your selected organization, report details,
            feedback and appointment preference will be
            submitted as one response request.
          </p>

          <p>
            (ଆପଣଙ୍କ ସମସ୍ତ ବିବରଣୀ ଏକାସାଥିରେ
            ଅନ୍ତିମ ଅନୁରୋଧ ଭାବରେ ଦାଖଲ ହେବ।)
          </p>


          {
            submitError && (

              <div className="response-request-submit-error">
                ⚠️{" "}
                {submitError}
              </div>

            )
          }


          <button
            type="button"
            className="response-request-final-btn"
            onClick={
              handleFinalSubmit
            }
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Submitting Request..."
                : "🚀 FINAL SUBMIT"
            }

          </button>

        </section>

      </section>

    </main>
  );
}

export default ResponseRequest;