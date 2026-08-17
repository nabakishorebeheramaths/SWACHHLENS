import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./SwachhlensAdmin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";


// =========================================================
// SWACHHLENS ADMIN
// =========================================================

function SwachhlensAdmin() {

  // =========================================================
  // ADMIN AUTH STATE
  // =========================================================

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);

  const [
    authChecking,
    setAuthChecking,
  ] = useState(true);

  const [
    loginEmail,
    setLoginEmail,
  ] = useState("");

  const [
    loginPassword,
    setLoginPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loginLoading,
    setLoginLoading,
  ] = useState(false);

  const [
    loginError,
    setLoginError,
  ] = useState("");

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  const authCheckRequestRef = useRef(0);
  // =========================================================
  // LAST VISITED
  // =========================================================

  const [
    lastVisited,
    setLastVisited,
  ] = useState("");


  // =========================================================
  // REQUEST STATE
  // =========================================================

  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null);


  // =========================================================
  // LOAD LAST VISITED
  // =========================================================

  useEffect(() => {

    const previousVisit =
      localStorage.getItem(
        "swachhlens_admin_last_visited"
      );

    if (
      previousVisit
    ) {

      try {

        const formatted =
          new Intl.DateTimeFormat(
            "en-IN",
            {
              dateStyle:
                "medium",
              timeStyle:
                "medium",
              hour12: true,
              timeZone:
                "Asia/Kolkata",
            }
          ).format(
            new Date(
              previousVisit
            )
          );

        setLastVisited(
          formatted
        );

      } catch {

        setLastVisited(
          previousVisit
        );

      }

    }

  }, []);


  // =========================================================
  // CHECK ADMIN SESSION
  // =========================================================

  const checkAdminAuthentication =
  useCallback(
    async () => {

      const requestId =
        ++authCheckRequestRef.current;

      try {

        setAuthChecking(true);

        const response =
          await fetch(
            `${API_BASE_URL}/api/admin-auth/me`,
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

        let data = null;

        try {

          data =
            await response.json();

        } catch {

          data = null;

        }

        console.log(
          "🔐 ADMIN ME RESPONSE:",
          {
            status: response.status,
            data,
            requestId,
          }
        );

        // Ignore old/stale authentication response
        if (
          requestId !==
          authCheckRequestRef.current
        ) {

          console.log(
            "⚠️ Ignoring stale admin auth response."
          );

          return;

        }

        if (
          response.ok &&
          data?.success &&
          data?.authenticated
        ) {

          setAuthenticated(true);

        } else {

          setAuthenticated(false);

        }

      } catch (error) {

        if (
          requestId !==
          authCheckRequestRef.current
        ) {

          return;

        }

        console.error(
          "❌ Admin Authentication Check Error:",
          error
        );

        setAuthenticated(false);

      } finally {

        if (
          requestId ===
          authCheckRequestRef.current
        ) {

          setAuthChecking(false);

        }

      }

    },
    []
  );
  // =========================================================
  // INITIAL AUTH CHECK
  // =========================================================

  useEffect(() => {

    checkAdminAuthentication();

  }, [
    checkAdminAuthentication,
  ]);


  // =========================================================
  // LOAD RESPONSE REQUESTS
  // =========================================================

  const loadRequests =
    useCallback(
      async (
        isRefresh = false
      ) => {

        try {

          if (
            isRefresh
          ) {

            setRefreshing(
              true
            );

          } else {

            setLoading(
              true
            );

          }

          setError("");


          const response =
            await fetch(
              `${API_BASE_URL}/api/response/admin/requests`,
              {
                method: "GET",
                credentials:
                  "include",
              }
            );


          let data;

          try {

            data =
              await response.json();

          } catch {

            throw new Error(
              "Invalid response from SWACHHLENS Admin API."
            );

          }


          if (
            response.status ===
            401
          ) {

            setAuthenticated(
              false
            );

            setRequests([]);

            return;

          }


          if (
            !response.ok ||
            !data?.success ||
            !Array.isArray(
              data?.requests
            )
          ) {

            throw new Error(
              data?.message ||
                "Unable to load response requests."
            );

          }


          setRequests(
            data.requests
          );

        } catch (requestError) {

          console.error(
            "❌ SWACHHLENS Admin Request Loading Error:",
            requestError
          );

          setError(
            requestError.message ||
              "Unable to load response requests."
          );

        } finally {

          setLoading(
            false
          );

          setRefreshing(
            false
          );

        }

      },
      []
    );


  // =========================================================
  // LOAD REQUESTS AFTER AUTHENTICATION
  // =========================================================

  useEffect(() => {

    if (
      !authenticated
    ) {

      return;

    }

    loadRequests();

  }, [
    authenticated,
    loadRequests,
  ]);


  // =========================================================
  // ADMIN LOGIN
  // =========================================================

  const handleAdminLogin =
    async (
      event
    ) => {

      event.preventDefault();

      setLoginError("");


      const email =
        loginEmail.trim();

      const password =
        loginPassword;


      if (!email) {

        setLoginError(
          "Please enter your admin email."
        );

        return;

      }


      if (!password) {

        setLoginError(
          "Please enter your admin password."
        );

        return;

      }


      try {

        setLoginLoading(
          true
        );


        const response =
          await fetch(
            `${API_BASE_URL}/api/admin-auth/login`,
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
                JSON.stringify({
                  email,
                  password,
                }),
            }
          );


        let data;

        try {

          data =
            await response.json();

        } catch {

          throw new Error(
            "Invalid response from admin authentication server."
          );

        }

if (
  !response.ok ||
  !data?.success ||
  !data?.authenticated
) {
  throw new Error(
    data?.message ||
      "Invalid admin email or password."
  );
}

console.log("✅ ADMIN LOGIN RESPONSE:", {
  status: response.status,
  data,
  authenticated: data?.authenticated,
});

const now =
  new Date()
    .toISOString();

        localStorage.setItem(
          "swachhlens_admin_last_visited",
          now
        );


        setLastVisited(
          new Intl.DateTimeFormat(
            "en-IN",
            {
              dateStyle:
                "medium",
              timeStyle:
                "medium",
              hour12: true,
              timeZone:
                "Asia/Kolkata",
            }
          ).format(
            new Date(now)
          )
        );

        setAuthenticated(
        true
        );
        setLoginPassword(
          ""
        );

        setLoginError(
          ""
        );

      } catch (error) {

        console.error(
          "❌ SWACHHLENS Admin Login Error:",
          error
        );

        setAuthenticated(
          false
        );

        setLoginError(
          error.message ||
            "Unable to login as SWACHHLENS Admin."
        );

      } finally {

        setLoginLoading(
          false
        );

      }

    };


  // =========================================================
  // ADMIN LOGOUT
  // =========================================================

  const handleAdminLogout =
    async () => {

      try {

        setLogoutLoading(
          true
        );


        await fetch(
          `${API_BASE_URL}/api/admin-auth/logout`,
          {
            method:
              "POST",

            credentials:
              "include",
          }
        );

      } catch (error) {

        console.error(
          "❌ Admin Logout Error:",
          error
        );

      } finally {

        setAuthenticated(
          false
        );

        setRequests([]);

        setSelectedRequest(
          null
        );

        setLoginEmail("");

        setLoginPassword("");

        setLoginError("");

        setShowPassword(
          false
        );

        setLogoutLoading(
          false
        );

      }

    };


  // =========================================================
  // SUMMARY COUNTS
  // =========================================================

  const totalRequests =
    requests.length;


  const pendingRequests =
    requests.filter(
      (request) =>
        String(
          request?.status ||
            "pending"
        )
          .toLowerCase() ===
        "pending"
    ).length;


  const appointmentRequests =
    requests.filter(
      (request) =>
        request
          ?.appointment
          ?.requested ===
        true
    ).length;


  const organizationNotificationPending =
    requests.filter(
      (request) =>
        String(
          request
            ?.organizationNotificationStatus ||
            "pending"
        )
          .toLowerCase() ===
        "pending"
    ).length;


  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate =
    (
      value
    ) => {

      if (
        !value
      ) {

        return "—";

      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return "—";

      }


      return new Intl.DateTimeFormat(
        "en-IN",
        {
          day:
            "2-digit",
          month:
            "short",
          year:
            "numeric",
          hour:
            "2-digit",
          minute:
            "2-digit",
          hour12:
            true,
        }
      ).format(
        date
      );

    };


  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass =
    (
      status
    ) => {

      const normalized =
        String(
          status ||
            "pending"
        )
          .trim()
          .toLowerCase();


      if (
        normalized ===
          "completed" ||
        normalized ===
          "resolved" ||
        normalized ===
          "sent" ||
        normalized ===
          "accepted"
      ) {

        return "status-success";

      }


      if (
        normalized ===
          "rejected" ||
        normalized ===
          "failed"
      ) {

        return "status-danger";

      }


      if (
        normalized ===
          "processing" ||
        normalized ===
          "in progress" ||
        normalized ===
          "sending"
      ) {

        return "status-processing";

      }


      return "status-pending";

    };


  // =========================================================
  // AUTH CHECK
  // =========================================================

  if (
    authChecking
  ) {

    return (
      <main className="swachhlens-admin-page">

        <section className="swachhlens-admin-card">

          <div className="admin-state-card">

            <div className="admin-state-icon">
              🔐
            </div>

            <h3>
              Checking Admin Access...
            </h3>

            <p>
              SWACHHLENS is verifying your
              administrative access.
            </p>

            <p>
              (ଆପଣଙ୍କ Admin access ଯାଞ୍ଚ
              କରାଯାଉଛି।)
            </p>

          </div>

        </section>

      </main>
    );

  }


  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (
    !authenticated
  ) {

    return (
      <main className="swachhlens-admin-page">

        <section className="swachhlens-admin-card">

          <header className="swachhlens-admin-header">

            <span className="swachhlens-admin-badge">
              🔐 SWACHHLENS PRIVATE ACCESS
            </span>

            <h1>
              SWACHHLENS Admin
            </h1>

            <p>
              Sign in using your authorized
              SWACHHLENS Admin email and password.
            </p>

            <p>
              (କେବଳ authorized SWACHHLENS Admin
              credentials ଦ୍ୱାରା ପ୍ରବେଶ କରନ୍ତୁ।)
            </p>

          </header>


          {/* =================================================
              WELCOME TOY
          ================================================= */}

          <div
            style={{
              marginTop: "4px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >

            <div
              className="admin-welcome-toy"
            >

              <div className="admin-toy-face">
                🤖
              </div>

              <div className="admin-toy-message">
                <strong>
                  Welcome, My Admin 👋
                </strong>

                <span>
                  SWACHHLENS is ready for you ✨
                </span>
              </div>

            </div>

          </div>


          <section
            className="admin-state-card"
            style={{
              minHeight: "auto",
              padding:
                "28px",
              textAlign:
                "left",
              borderStyle:
                "solid",
            }}
          >

            {/* =============================================
                LOGIN ICON
            ============================================= */}

            <div
              style={{
                width:
                  "68px",
                height:
                  "68px",
                margin:
                  "0 auto 16px",
                display:
                  "grid",
                placeItems:
                  "center",
                borderRadius:
                  "21px",
                background:
                  "linear-gradient(135deg, #fff0f7, #edf8ff)",
                border:
                  "2px solid transparent",
                backgroundImage:
                  "linear-gradient(135deg, #fff0f7, #edf8ff), linear-gradient(90deg, #ff2d55, #ff9500, #30d158, #0a84ff, #bf5af2)",
                backgroundOrigin:
                  "border-box",
                backgroundClip:
                  "padding-box, border-box",
                fontSize:
                  "31px",
                boxShadow:
                  "0 10px 25px rgba(203,72,133,0.10)",
              }}
            >
              🔐
            </div>


            <h3
              style={{
                textAlign:
                  "center",
                marginBottom:
                  "7px",
                fontSize:
                  "19px",
              }}
            >
              Admin Login
            </h3>


            <p
              style={{
                textAlign:
                  "center",
              }}
            >
              Enter your secure SWACHHLENS
              administrative credentials.
            </p>


            <form
              onSubmit={
                handleAdminLogin
              }
              style={{
                marginTop:
                  "20px",
                display:
                  "grid",
                gap:
                  "14px",
              }}
            >

              {/* =========================================
                  EMAIL
              ========================================= */}

              <div>

                <label
                  htmlFor="swachhlens-admin-email"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "7px",
                    color:
                      "#000000",
                    fontSize:
                      "11px",
                    fontWeight:
                      950,
                  }}
                >
                  Admin Email
                </label>


                <div
                  style={{
                    position:
                      "relative",
                  }}
                >

                  <span
                    style={{
                      position:
                        "absolute",
                      left:
                        "14px",
                      top:
                        "50%",
                      transform:
                        "translateY(-50%)",
                      fontSize:
                        "15px",
                    }}
                  >
                    📧
                  </span>


                  <input
                    id="swachhlens-admin-email"
                    type="email"
                    value={
                      loginEmail
                    }
                    onChange={(
                      event
                    ) => {

                      setLoginEmail(
                        event.target.value
                      );

                      setLoginError(
                        ""
                      );

                    }}
                    placeholder="Enter admin email"
                    autoComplete="username"
                    disabled={
                      loginLoading
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "54px",
                      padding:
                        "0 14px 0 43px",
                      border:
                        "2px solid #ff2d55",
                      borderRadius:
                        "14px",
                      background:
                        "#ffffff",
                      color:
                        "#000000",
                      fontSize:
                        "12px",
                      fontWeight:
                        750,
                      outline:
                        "none",
                    }}
                  />

                </div>

              </div>


              {/* =========================================
                  PASSWORD
              ========================================= */}

              <div>

                <label
                  htmlFor="swachhlens-admin-password"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "7px",
                    color:
                      "#000000",
                    fontSize:
                      "11px",
                    fontWeight:
                      950,
                  }}
                >
                  Admin Password
                </label>


                <div
                  style={{
                    position:
                      "relative",
                  }}
                >

                  <span
                    style={{
                      position:
                        "absolute",
                      left:
                        "14px",
                      top:
                        "50%",
                      transform:
                        "translateY(-50%)",
                      fontSize:
                        "15px",
                    }}
                  >
                    🔑
                  </span>


                  <input
                    id="swachhlens-admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      loginPassword
                    }
                    onChange={(
                      event
                    ) => {

                      setLoginPassword(
                        event.target.value
                      );

                      setLoginError(
                        ""
                      );

                    }}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    disabled={
                      loginLoading
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "54px",
                      padding:
                        "0 50px 0 43px",
                      border:
                        "2px solid #0a84ff",
                      borderRadius:
                        "14px",
                      background:
                        "#ffffff",
                      color:
                        "#000000",
                      fontSize:
                        "12px",
                      fontWeight:
                        750,
                      outline:
                        "none",
                    }}
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                    disabled={
                      loginLoading
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    style={{
                      position:
                        "absolute",
                      right:
                        "8px",
                      top:
                        "50%",
                      transform:
                        "translateY(-50%)",
                      width:
                        "36px",
                      height:
                        "36px",
                      border:
                        "1px solid #ff7a00",
                      borderRadius:
                        "10px",
                      background:
                        "#ffffff",
                      color:
                        "#000000",
                      cursor:
                        "pointer",
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      showPassword
                        ? "🙈"
                        : "👁️"
                    }
                  </button>

                </div>

              </div>


              {/* =========================================
                  ERROR
              ========================================= */}

              {
                loginError && (

                  <div
                    style={{
                      padding:
                        "12px 14px",
                      borderRadius:
                        "13px",
                      background:
                        "#fff0f3",
                      border:
                        "1px solid #ff2d55",
                      color:
                        "#000000",
                      fontSize:
                        "11px",
                      fontWeight:
                        850,
                      lineHeight:
                        1.5,
                    }}
                  >
                    ⚠️{" "}
                    {
                      loginError
                    }
                  </div>

                )
              }


              {/* =========================================
                  LOGIN BUTTON
              ========================================= */}

              <button
                type="submit"
                className="admin-refresh-button"
                disabled={
                  loginLoading
                }
                style={{
                  width:
                    "100%",
                  minHeight:
                    "54px",
                  marginTop:
                    "3px",
                  fontSize:
                    "12px",
                }}
              >

                {
                  loginLoading
                    ? "🔄 Authenticating..."
                    : "🔐 Enter SWACHHLENS Admin"
                }

              </button>

            </form>


            {/* =============================================
                LAST VISITED
            ============================================= */}

            {
              lastVisited && (

                <div
                  style={{
                    marginTop:
                      "17px",
                    padding:
                      "12px 14px",
                    borderRadius:
                      "13px",
                    background:
                      "linear-gradient(135deg, #fff8e6, #fff0f7)",
                    border:
                      "1px solid #ff9900",
                    display:
                      "flex",
                    alignItems:
                      "flex-start",
                    gap:
                      "9px",
                  }}
                >

                  <span
                    style={{
                      fontSize:
                        "16px",
                    }}
                  >
                    🕘
                  </span>

                  <div>

                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#000000",
                        fontSize:
                          "10px",
                        fontWeight:
                          950,
                      }}
                    >
                      Last Visited
                    </strong>

                    <span
                      style={{
                        display:
                          "block",
                        marginTop:
                          "3px",
                        color:
                          "#111111",
                        fontSize:
                          "10px",
                        fontWeight:
                          700,
                        lineHeight:
                          "1.45",
                      }}
                    >
                      {
                        lastVisited
                      }
                    </span>

                  </div>

                </div>

              )
            }


            {/* =============================================
                SECURITY NOTE
            ============================================= */}

            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "11px 13px",
                borderRadius:
                  "12px",
                background:
                  "linear-gradient(135deg, #f2fff9, #eff8ff)",
                border:
                  "1px solid #30d158",
                display:
                  "flex",
                gap:
                  "9px",
                alignItems:
                  "flex-start",
              }}
            >

              <span>
                🛡️
              </span>

              <p
                style={{
                  margin:
                    0,
                  fontSize:
                    "10px",
                  fontWeight:
                    650,
                  color:
                    "#000000",
                  lineHeight:
                    1.55,
                }}
              >
                Admin credentials are verified by the
                SWACHHLENS backend and are not stored
                in this frontend page.
              </p>

            </div>

          </section>

        </section>

      </main>
    );

  }


  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  return (
    <main className="swachhlens-admin-page">

      <section className="swachhlens-admin-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="swachhlens-admin-header">

          <span className="swachhlens-admin-badge">
            ♻️ SWACHHLENS INTERNAL CONTROL
          </span>

          <h1>
            SWACHHLENS Admin
          </h1>

          <p>
            Manage response requests, selected
            organizations, appointments and
            organization communication.
          </p>

          <p>
            (Response Request, ସଂଗଠନ, appointment ଏବଂ
            communication ଏଠାରୁ ପରିଚାଳନା କରନ୍ତୁ।)
          </p>

        </header>


        {/* =================================================
            ADMIN CONTROL
        ================================================= */}

        <section className="admin-control-section">

          <div>

            <span className="admin-control-label">
              SECURE ADMIN SESSION
            </span>

            <h2>
              Admin Control Center
            </h2>

            <p>
              Authorized SWACHHLENS administrator
              session is currently active.
            </p>

          </div>


          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              handleAdminLogout
            }
            disabled={
              logoutLoading
            }
          >
            {
              logoutLoading
                ? "Logging Out..."
                : "🔒 Logout"
            }
          </button>

        </section>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="swachhlens-admin-summary">

          <article className="admin-summary-card">

            <span className="summary-icon">
              📋
            </span>

            <div>

              <small>
                TOTAL REQUESTS
              </small>

              <strong>
                {
                  totalRequests
                }
              </strong>

            </div>

          </article>


          <article className="admin-summary-card">

            <span className="summary-icon">
              ⏳
            </span>

            <div>

              <small>
                PENDING
              </small>

              <strong>
                {
                  pendingRequests
                }
              </strong>

            </div>

          </article>


          <article className="admin-summary-card">

            <span className="summary-icon">
              📅
            </span>

            <div>

              <small>
                APPOINTMENTS
              </small>

              <strong>
                {
                  appointmentRequests
                }
              </strong>

            </div>

          </article>


          <article className="admin-summary-card">

            <span className="summary-icon">
              📧
            </span>

            <div>

              <small>
                MAIL PENDING
              </small>

              <strong>
                {
                  organizationNotificationPending
                }
              </strong>

            </div>

          </article>

        </section>


        {/* =================================================
            REQUEST MANAGEMENT
        ================================================= */}

        <section className="admin-control-section">

          <div>

            <span className="admin-control-label">
              RESPONSE REQUEST MANAGEMENT
            </span>

            <h2>
              Incoming Requests
            </h2>

            <p>
              Every final-submitted response request
              linked with its original Report ID.
            </p>

          </div>


          <button
            type="button"
            className="admin-refresh-button"
            onClick={() =>
              loadRequests(
                true
              )
            }
            disabled={
              refreshing
            }
          >
            {
              refreshing
                ? "Refreshing..."
                : "🔄 Refresh Requests"
            }
          </button>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {
          error && (

            <section className="admin-state-card">

              <div className="admin-state-icon">
                ⚠️
              </div>

              <h3>
                Unable to load admin requests
              </h3>

              <p>
                {
                  error
                }
              </p>

              <button
                type="button"
                className="admin-action-button"
                onClick={() =>
                  loadRequests()
                }
              >
                Try Again
              </button>

            </section>

          )
        }


        {/* =================================================
            LOADING
        ================================================= */}

        {
          !error &&
          loading && (

            <section className="admin-state-card">

              <div className="admin-state-icon">
                ♻️
              </div>

              <h3>
                Loading response requests...
              </h3>

              <p>
                SWACHHLENS Admin is retrieving
                submitted response requests.
              </p>

            </section>

          )
        }


        {/* =================================================
            EMPTY
        ================================================= */}

        {
          !error &&
          !loading &&
          requests.length ===
            0 && (

            <section className="admin-state-card">

              <div className="admin-state-icon">
                📭
              </div>

              <h3>
                No Response Requests Yet
              </h3>

              <p>
                Final-submitted response requests will
                appear here with their Report ID,
                organization, feedback and appointment
                information.
              </p>

              <p>
                (ବର୍ତ୍ତମାନ କୌଣସି final response request
                ମିଳିଲା ନାହିଁ।)
              </p>

            </section>

          )
        }


        {/* =================================================
            REQUEST LIST
        ================================================= */}

        {
          !error &&
          !loading &&
          requests.length >
            0 && (

            <section className="admin-requests-section">

              <div className="admin-request-list">

                {
                  requests.map(
                    (
                      request,
                      index
                    ) => {

                      const status =
                        request?.status ||
                        "pending";


                      const appointmentRequested =
                        request
                          ?.appointment
                          ?.requested ===
                        true;


                      return (
                        <article
                          className="admin-request-card"
                          key={
                            request?._id ||
                            request?.requestId ||
                            `request-${index}`
                          }
                        >

                          <div className="admin-request-top">

                            <div>

                              <span className="request-label">
                                REPORT ID
                              </span>

                              <h3>
                                #
                                {
                                  request?.reportId ||
                                  "—"
                                }
                              </h3>

                            </div>


                            <span
                              className={`request-status ${getStatusClass(
                                status
                              )}`}
                            >
                              {
                                String(
                                  status
                                ).toUpperCase()
                              }
                            </span>

                          </div>


                          <div className="admin-request-grid">

                            <div className="admin-request-detail">

                              <span>
                                👤 Citizen
                              </span>

                              <strong>
                                {
                                  request
                                    ?.citizenId ||
                                  request
                                    ?.citizenEmail ||
                                  request
                                    ?.email ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div className="admin-request-detail">

                              <span>
                                🏛️ Organization
                              </span>

                              <strong>
                                {
                                  request
                                    ?.organizationName ||
                                  request
                                    ?.selectedOrganization
                                    ?.organizationName ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div className="admin-request-detail">

                              <span>
                                📍 Location
                              </span>

                              <strong>
                                {
                                  request
                                    ?.organizationLocation
                                    ?.city ||
                                  request
                                    ?.selectedOrganization
                                    ?.location
                                    ?.city ||
                                  request
                                    ?.reportSnapshot
                                    ?.location
                                    ?.city ||
                                  request
                                    ?.wasteLocation
                                    ?.city ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div className="admin-request-detail">

                              <span>
                                ♻️ Waste Type
                              </span>

                              <strong>
                                {
                                  request
                                    ?.reportSnapshot
                                    ?.wasteType ||
                                  request
                                    ?.wasteType ||
                                  request
                                    ?.report
                                    ?.wasteType ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div className="admin-request-detail">

                              <span>
                                ⚠️ Severity
                              </span>

                              <strong>
                                {
                                  request
                                    ?.reportSnapshot
                                    ?.visibleSeverity ||
                                  request
                                    ?.visibleSeverity ||
                                  request
                                    ?.report
                                    ?.visibleSeverity ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div className="admin-request-detail">

                              <span>
                                📅 Submitted
                              </span>

                              <strong>
                                {
                                  formatDate(
                                    request
                                      ?.submittedAt ||
                                    request
                                      ?.createdAt
                                  )
                                }
                              </strong>

                            </div>

                          </div>


                          <div className="admin-request-tags">

                            <span>
                              {
                                appointmentRequested
                                  ? "📅 Appointment Requested"
                                  : "📄 Report Only"
                              }
                            </span>


                            <span>
                              {
                                request
                                  ?.feedback
                                  ?.reason
                                  ? "💬 Feedback Received"
                                  : "💬 No Feedback"
                              }
                            </span>


                            <span>
                              {
                                request
                                  ?.organizationNotificationStatus ===
                                "sent"
                                  ? "📧 Organization Notified"
                                  : "📧 Mail Pending"
                              }
                            </span>

                          </div>


                          <button
                            type="button"
                            className="admin-view-request-button"
                            onClick={() =>
                              setSelectedRequest(
                                request
                              )
                            }
                          >
                            View Full Request →
                          </button>

                        </article>
                      );

                    }
                  )
                }

              </div>

            </section>

          )
        }


        {/* =================================================
            REQUEST DETAIL MODAL
        ================================================= */}

        {
          selectedRequest && (

            <div
              className="admin-detail-overlay"
              onClick={(
                event
              ) => {

                if (
                  event.target ===
                  event.currentTarget
                ) {

                  setSelectedRequest(
                    null
                  );

                }

              }}
            >

              <section className="admin-detail-modal">

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() =>
                    setSelectedRequest(
                      null
                    )
                  }
                  aria-label="Close request details"
                >
                  ✕
                </button>


                <div className="admin-modal-header">

                  <span>
                    RESPONSE REQUEST
                  </span>

                  <h2>
                    #
                    {
                      selectedRequest
                        ?.reportId ||
                      "—"
                    }
                  </h2>

                  <p>
                    Complete request information
                    received by SWACHHLENS Admin.
                  </p>

                </div>


                <div className="admin-modal-section">

                  <span>
                    SELECTED ORGANIZATION
                  </span>

                  <h3>
                    {
                      selectedRequest
                        ?.organizationName ||
                      selectedRequest
                        ?.selectedOrganization
                        ?.organizationName ||
                      "—"
                    }
                  </h3>

                  <p>
                    📍{" "}
                    {
                      selectedRequest
                        ?.organizationLocation
                        ?.city ||
                      selectedRequest
                        ?.selectedOrganization
                        ?.location
                        ?.city ||
                      "—"
                    }

                    {
                      selectedRequest
                        ?.organizationLocation
                        ?.district
                        ? `, ${selectedRequest.organizationLocation.district}`
                        : ""
                    }

                    {
                      selectedRequest
                        ?.organizationLocation
                        ?.state
                        ? `, ${selectedRequest.organizationLocation.state}`
                        : ""
                    }
                  </p>

                </div>


                <div className="admin-modal-section">

                  <span>
                    REPORT INFORMATION
                  </span>

                  <div className="admin-modal-grid">

                    <div>

                      <small>
                        Waste Type
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.wasteType ||
                          selectedRequest
                            ?.wasteType ||
                          "—"
                        }
                      </strong>

                    </div>


                    <div>

                      <small>
                        Severity
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.visibleSeverity ||
                          selectedRequest
                            ?.visibleSeverity ||
                          "—"
                        }
                      </strong>

                    </div>


                    <div>

                      <small>
                        Risk Score
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.riskScore ??
                          "—"
                        }
                      </strong>

                    </div>


                    <div>

                      <small>
                        Hazard Detected
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.hazardDetected
                            ? "Yes"
                            : "No"
                        }
                      </strong>

                    </div>


                    <div>

                      <small>
                        Road Blockage
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.roadBlockage
                            ? "Yes"
                            : "No"
                        }
                      </strong>

                    </div>


                    <div>

                      <small>
                        Waste Location
                      </small>

                      <strong>
                        {
                          selectedRequest
                            ?.reportSnapshot
                            ?.location
                            ?.city ||
                          "—"
                        }
                      </strong>

                    </div>

                  </div>

                </div>


                <div className="admin-modal-section">

                  <span>
                    REPORT DESCRIPTION
                  </span>

                  <p>
                    {
                      selectedRequest
                        ?.reportSnapshot
                        ?.description ||
                      "No description available."
                    }
                  </p>

                </div>


                <div className="admin-modal-section">

                  <span>
                    USER FEEDBACK
                  </span>

                  <h3>
                    {
                      selectedRequest
                        ?.feedback
                        ?.reason ||
                      "No feedback provided."
                    }
                  </h3>

                  <p>
                    {
                      selectedRequest
                        ?.feedback
                        ?.additionalFeedback ||
                      "No additional feedback."
                    }
                  </p>

                </div>


                <div className="admin-modal-section">

                  <span>
                    APPOINTMENT
                  </span>

                  {
                    selectedRequest
                      ?.appointment
                      ?.requested
                      ? (
                        <div className="admin-appointment-box">

                          <p>
                            <strong>
                              Appointment Requested
                            </strong>
                          </p>

                          <p>
                            📅{" "}
                            {
                              selectedRequest
                                ?.appointment
                                ?.date ||
                              "—"
                            }
                          </p>

                          <p>
                            🕐{" "}
                            {
                              selectedRequest
                                ?.appointment
                                ?.time ||
                              "—"
                            }
                          </p>

                          <p>
                            📝{" "}
                            {
                              selectedRequest
                                ?.appointment
                                ?.note ||
                              "No appointment note."
                            }
                          </p>

                          <p>
                            Status:{" "}
                            {
                              selectedRequest
                                ?.appointment
                                ?.status ||
                              "pending"
                            }
                          </p>

                        </div>
                      )
                      : (
                        <p>
                          User requested report submission
                          without an appointment.
                        </p>
                      )
                  }

                </div>


                <div className="admin-modal-section">

                  <span>
                    ORGANIZATION COMMUNICATION
                  </span>

                  <div className="admin-communication-status">

                    <strong
                      className={`communication-badge ${getStatusClass(
                        selectedRequest
                          ?.organizationNotificationStatus ||
                        "pending"
                      )}`}
                    >
                      {
                        String(
                          selectedRequest
                            ?.organizationNotificationStatus ||
                          "pending"
                        ).toUpperCase()
                      }
                    </strong>

                  </div>

                </div>

              </section>

            </div>

          )
        }

      </section>

    </main>
  );
}


export default SwachhlensAdmin;