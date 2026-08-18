import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ReportAnalysisStatus.css";

// =====================================================
// AUTO FIT ALL REPORT LOCATIONS
// + SELECTED REPORT FOCUS
// + NO MAP VIBRATION
// + NO UNEXPECTED ZOOM OUT
// =====================================================

function FitAllLocations({
  locations,
  selectedLocation,
}) {
  const map = useMap();

  // -----------------------------------------------
  // PREVIOUS LOCATIONS
  // -----------------------------------------------

  const previousLocationsKey =
    useRef("");

  // -----------------------------------------------
  // PREVIOUS SELECTED REPORT
  // -----------------------------------------------

  const previousSelectedReportKey =
    useRef(null);

  // -----------------------------------------------
  // INITIAL MAP FIT
  // -----------------------------------------------

  useEffect(() => {

    if (
      !locations ||
      locations.length === 0
    ) {
      return;
    }

    // =================================================
    // SELECTED REPORT
    // =================================================

    if (selectedLocation) {

      const lat =
        Number(
          selectedLocation.latitude
        );

      const lng =
        Number(
          selectedLocation.longitude
        );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      const selectedKey =
        selectedLocation.reportKey ||
        selectedLocation.reportId ||
        `${lat},${lng}`;

      // ---------------------------------------------
      // SAME REPORT ALREADY SELECTED
      // DO NOT FLY AGAIN
      // ---------------------------------------------

      if (
        previousSelectedReportKey.current ===
        selectedKey
      ) {
        return;
      }

      previousSelectedReportKey.current =
        selectedKey;

      // ---------------------------------------------
      // EXACT REPORT LOCATION
      // ---------------------------------------------

      map.flyTo(
        [lat, lng],
        17,
        {
          animate: true,
          duration: 1.2,
        }
      );

      return;
    }

    // =================================================
    // DEFAULT MODE
    // SHOW ALL REPORTS
    // =================================================

    const locationsKey =
      locations
        .map(
          (item) =>
            `${Number(
              item.latitude
            ).toFixed(6)},${Number(
              item.longitude
            ).toFixed(6)}`
        )
        .sort()
        .join("|");

    // ---------------------------------------------
    // NOTHING CHANGED
    // DON'T TOUCH MAP
    // ---------------------------------------------

    if (
      previousLocationsKey.current ===
      locationsKey
    ) {
      return;
    }

    previousLocationsKey.current =
      locationsKey;

    // ---------------------------------------------
    // VALID COORDINATES ONLY
    // ---------------------------------------------

    const validPoints =
      locations
        .map((item) => [
          Number(item.latitude),
          Number(item.longitude),
        ])
        .filter(
          ([lat, lng]) =>
            Number.isFinite(lat) &&
            Number.isFinite(lng)
        );

    if (
      validPoints.length === 0
    ) {
      return;
    }

    // ---------------------------------------------
    // ONLY INITIAL FIT OR ACTUAL
    // LOCATION DATA CHANGE
    // ---------------------------------------------

    const bounds =
      L.latLngBounds(
        validPoints
      );

    map.fitBounds(
      bounds,
      {
        padding: [40, 40],
        maxZoom: 15,
        animate: true,
        duration: 1,
      }
    );

  }, [
    locations,
    selectedLocation,
    map,
  ]);

  return null;
}
// =====================================================
// LEAFLET MARKER ICON FIX
// =====================================================

delete L.Icon.Default.prototype
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://swachhlens-z6ko.onrender.com";
// =====================================================
// SWACHHLENS SATELLITE MAP
// =====================================================

function SatelliteMap({
  locations,
  selectedLocation,
}) {
  const validLocations =
    (locations || [])
      .map((item) => {
        const latitude =
          item.latitude ??
          item.location?.coordinates
            ?.latitude ??
          item.wasteLocation?.coordinates
            ?.latitude ??
          item.coordinates?.latitude;

        const longitude =
          item.longitude ??
          item.location?.coordinates
            ?.longitude ??
          item.wasteLocation?.coordinates
            ?.longitude ??
          item.coordinates?.longitude;

        return {
          ...item,
          latitude: Number(latitude),
          longitude: Number(longitude),
        };
      })
      .filter(
        (item) =>
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude)
      );

  // ===================================================
  // NO VALID GPS LOCATIONS
  // ===================================================

  if (validLocations.length === 0) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder-icon">
          ðŸ—ºï¸
        </div>

        <strong>
          Live satellite map
        </strong>

        <p>
          Report locations will appear
          here as GPS data becomes
          available.
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[
        validLocations[0].latitude,
        validLocations[0].longitude,
      ]}
      zoom={15}
      scrollWheelZoom={true}
      className="satellite-map"
    >

      {/* =================================================
          REAL SATELLITE IMAGERY
      ================================================= */}

      <TileLayer
        attribution="Tiles Â© Esri â€” Source: Esri, Maxar, Earthstar Geographics"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* =================================================
          AUTO FIT / SELECTED REPORT FOCUS
      ================================================= */}

      <FitAllLocations
        locations={validLocations}
        selectedLocation={selectedLocation}
      />

      {/* =================================================
          REPORT LOCATION MARKERS
      ================================================= */}

      {validLocations.map(
        (item, index) => (
          <Marker
            key={
              item._id ||
              item.reportId ||
              index
            }
            position={[
              item.latitude,
              item.longitude,
            ]}
          >
            <Popup>
              <div className="satellite-popup">

                <strong>
                  SWACHHLENS Report
                </strong>

                <span>
                  {item.locationName ||
                    item.district ||
                    item.state ||
                    "Reported Location"}
                </span>

                <small>
                  ðŸ“{" "}
                  {item.latitude.toFixed(6)}
                  {", "}
                  {item.longitude.toFixed(6)}
                </small>

              </div>
            </Popup>
          </Marker>
        )
      )}

    </MapContainer>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

function ReportAnalysisStatus() {

  // ===================================================
  // LIVE IST CLOCK
  // ===================================================

  const [currentIST, setCurrentIST] =
    useState("");

  const navigate =
    useNavigate();

  useEffect(() => {
    const updateISTClock = () => {
      const now = new Date();

      const formattedTime =
        new Intl.DateTimeFormat(
          "en-IN",
          {
            timeZone:
              "Asia/Kolkata",

            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",

            hour12: true,
          }
        ).format(now);

      setCurrentIST(
        formattedTime
      );
    };

    updateISTClock();

    const clockInterval =
      setInterval(
        updateISTClock,
        1000
      );

    return () => {
      clearInterval(
        clockInterval
      );
    };
  }, []);

  // ===================================================
  // REPORT SEARCH STATE
  // ===================================================

  const [report, setReport] =
    useState(null);

  // ===================================================
  // NORMAL REPORT SEARCH
  // Report ID + Email
  // ===================================================

  const [
    reportIdInput,
    setReportIdInput,
  ] = useState("");

  const [
    emailInput,
    setEmailInput,
  ] = useState("");

  // ===================================================
  // MAP REPORT ID SEARCH
  // ONLY FOR LOCATION
  // ===================================================

  const [
    mapReportIdInput,
    setMapReportIdInput,
  ] = useState("");

  const [
    mapReportLoading,
    setMapReportLoading,
  ] = useState(false);

  const [
    mapReportError,
    setMapReportError,
  ] = useState("");

  // ===================================================
  // PUBLIC LIVE DASHBOARD STATE
  // ===================================================

  const [
    overview,
    setOverview,
  ] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    todayReports: 0,
    recentReports: [],
    locations: [],
  });

  // ===================================================
  // SELECTED REPORT LOCATION
  // ===================================================

  const [
    selectedReportLocation,
    setSelectedReportLocation,
  ] = useState(null);

  const [
    overviewLoading,
    setOverviewLoading,
  ] = useState(true);

  const [
    overviewError,
    setOverviewError,
  ] = useState("");

 // ===================================================
// MAP REPORT ID â†’ EXACT LOCATION
// ===================================================

const handleMapReportLocation =
  async () => {

    const reportId =
      mapReportIdInput
        .trim()
        .toLowerCase();

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!reportId) {
      setMapReportError(
        "Please enter a Report ID."
      );

      return;
    }

    try {

      setMapReportLoading(true);

      setMapReportError("");

      // ---------------------------------------------
      // FETCH REPORT LOCATION
      // ---------------------------------------------

      const response =
        await fetch(
          `${API_BASE_URL}/api/waste-reports/by-report-id/location?reportId=${encodeURIComponent(
            reportId
          )}`
        );

      const data =
        await response.json();
        console.log(
  "ðŸ—ºï¸ OVERVIEW LOCATIONS:",
  data.locations
);

console.log(
  "ðŸ“‹ RECENT REPORTS:",
  data.recentReports
);

      console.log(
        "ðŸ“ MAP REPORT LOCATION RESPONSE:",
        data
      );

      // ---------------------------------------------
      // API ERROR
      // ---------------------------------------------

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Report not found."
        );
      }

      // ---------------------------------------------
      // BACKEND RETURNS:
      //
      // data.location
      //
      // NOT:
      //
      // data.report.location
      // ---------------------------------------------

      const location =
        data.location || {};

      // ---------------------------------------------
      // GET GPS
      // ---------------------------------------------

      const latitude =
        location.latitude ??
        location.coordinates?.latitude ??
        data.latitude ??
        null;

      const longitude =
        location.longitude ??
        location.coordinates?.longitude ??
        data.longitude ??
        null;

      const lat =
        Number(latitude);

      const lng =
        Number(longitude);

      // ---------------------------------------------
      // VALID GPS
      // ---------------------------------------------

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {

        throw new Error(
          "This report does not have valid GPS location data."
        );
      }

      console.log(
        "ðŸŽ¯ EXACT REPORT LOCATION:",
        {
          reportId:
            data.reportId ||
            reportId,

          latitude:
            lat,

          longitude:
            lng,
        }
      );

      // ---------------------------------------------
      // SELECT REPORT LOCATION
      // ---------------------------------------------

      setSelectedReportLocation({

        reportKey:
          data.reportId ||
          reportId,

        reportId:
          data.reportId ||
          reportId,

        latitude:
          lat,

        longitude:
          lng,

        locationName:
          location.locality ||
          location.gpsPlaceName ||
          location.district ||
          "Reported Location",

        district:
          location.district ||
          "",

        state:
          location.state ||
          "",

        locality:
          location.locality ||
          "",

      });

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setMapReportError("");

    } catch (error) {

      console.error(
        "Map Report Search Error:",
        error
      );

      setMapReportError(
        error.message ||
          "Unable to locate this report."
      );

    } finally {

      setMapReportLoading(
        false
      );
    }
  };
  // ===================================================
  // LOAD LIVE PUBLIC OVERVIEW
  // ===================================================

  const loadOverview =
    async () => {

      try {

        setOverviewError("");

        const response =
          await fetch(
            `${API_BASE_URL}/api/waste-reports/public-overview`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load live report statistics."
          );
        }
const wasteTypes = [
  "Plastic Waste",
  "Organic Waste",
  "Paper Waste",
  "Glass Waste",
  "E-Waste",
  "Construction Waste",
  "Mixed Waste",
  "Hazardous Waste",
  "Other",
];

const reports =
  Array.isArray(data.recentReports)
    ? data.recentReports
    : [];

const totalWasteReports =
  Number(data.totalReports) || 0;

const wasteTypeCounts =
  wasteTypes.reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {}
  );

reports.forEach((report) => {
  const type =
    String(
      report.wasteType || ""
    ).trim();

  if (wasteTypeCounts[type] !== undefined) {
    wasteTypeCounts[type]++;
  }
});


        setOverview({

  totalReports:
    Number(
      data.totalReports
    ) || 0,

  pendingReports:
    Number(
      data.pendingReports
    ) || 0,

  resolvedReports:
    Number(
      data.resolvedReports
    ) || 0,

  todayReports:
    Number(
      data.todayReports
    ) || 0,

  recentReports:
    Array.isArray(
      data.recentReports
    )
      ? data.recentReports
      : [],

  locations:
    Array.isArray(
      data.locations
    )
      ? data.locations
      : [],

  // ðŸ‘‡ ADD THIS
   wasteTypeDistribution:
    Array.isArray(data.wasteTypeDistribution)
      ? data.wasteTypeDistribution
      : [],
});
      } catch (error) {

        console.error(
          "Public Overview Error:",
          error
        );

        setOverviewError(
          "Live statistics are temporarily unavailable."
        );

      } finally {

        setOverviewLoading(
          false
        );
      }
    };

  // ===================================================
  // AUTO REFRESH LIVE DATA
  // ===================================================

  useEffect(() => {

    loadOverview();

    const interval =
      setInterval(
        () => {
          loadOverview();
        },
        30000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  // ===================================================
  // NORMAL SEARCH REPORT
  // Report ID + Email
  // ===================================================

  const handleSearchReport =
    async () => {

      setSearchError("");

      const reportId =
        reportIdInput.trim();

      const email =
        emailInput
          .trim()
          .toLowerCase();

      if (
        !reportId ||
        !email
      ) {

        setSearchError(
          "Please enter both Report ID and Email."
        );

        return;
      }

      try {

        setSearchLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/waste-reports/by-report-id?reportId=${encodeURIComponent(
              reportId
            )}&email=${encodeURIComponent(
              email
            )}`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.report
        ) {

          setSearchError(
            data.message ||
              "Report not found. Please check your Report ID and Email."
          );

          return;
        }
console.log("REPORT API DATA:", data.report);
console.log("REPORT IMAGE URL:", data.report?.imageUrl);

        sessionStorage.setItem(
          "swachhlens_latest_report",
          JSON.stringify(
            data.report
          )
        );

        if (
          data.report.reportId
        ) {

          sessionStorage.setItem(
            "swachhlens_report_id",
            data.report.reportId
          );
        }

        setReport(
          data.report
        );

      } catch (error) {

        console.error(
          "Search Report Error:",
          error
        );

        setSearchError(
          "Unable to search report. Please try again."
        );

      } finally {

        setSearchLoading(
          false
        );
      }
    };

  // ===================================================
  // NORMAL SEARCH STATES
  // ===================================================

  const [
    searchError,
    setSearchError,
  ] = useState("");

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);

  // ===================================================
  // AI DATA
  // ===================================================

  const ai =
    report?.aiAnalysis || {};

  const verification =
    ai.verification || {};

  // ===================================================
  // REPORT ID
  // ===================================================

  const reportId =
    report?.reportId || "â€”";

  // ===================================================
  // REPORT IMAGE
  const reportImageUrl = (() => {
  const rawImageUrl = String(
    report?.imageUrl || ""
  ).trim();

  if (!rawImageUrl) {
    return "";
  }

  // Already a complete URL
  if (
    rawImageUrl.startsWith("https://") ||
    rawImageUrl.startsWith("http://")
  ) {
    return rawImageUrl;
  }

  // Relative backend upload path
  const cleanBase = String(
    API_BASE_URL || ""
  ).replace(/\/+$/, "");

  const cleanPath = rawImageUrl.startsWith("/")
    ? rawImageUrl
    : `/${rawImageUrl}`;

  return `${cleanBase}${cleanPath}`;
})();
  // ===================================================
  // AI WASTE DETECTION
  // ===================================================

  const wasteDetected =
    typeof verification.isWaste ===
    "boolean"
      ? verification.isWaste
        ? "Yes"
        : "No"
      : "â€”";

  // ===================================================
  // AI CATEGORY
  // ===================================================

  const aiCategory =
    verification.category ||
    ai.wasteClassification ||
    ai.category ||
    "â€”";

  // ===================================================
  // AI CONFIDENCE
  // ===================================================

  const confidence =
    typeof verification.confidence ===
    "number"
      ? `${(
          verification.confidence *
          100
        ).toFixed(1)}%`
      : "â€”";

  // ===================================================
  // AI REASON
  // ===================================================

  const aiReason =
    verification.reason ||
    ai.recommendedAction ||
    ai.reason ||
    "â€”";

  // ===================================================
  // LOCATION
  // ===================================================

  const location =
    report?.location || {};

  // ===================================================
  // CITIZEN SITUATION
  // ===================================================

  const citizenSituation =
    report?.citizenSituation || {};

  // =====================================================
  // COMBINE ALL REPORT LOCATIONS
  // MANUAL + GPS + LIVE REPORTS
  // =====================================================

  const mapLocations = [
    ...(overview.locations || []),

    ...(overview.recentReports || []).map(
      (item) => {

        const latitude =
          item.latitude ??
          item.location?.coordinates
            ?.latitude ??
          item.wasteLocation
            ?.coordinates
            ?.latitude ??
          item.coordinates?.latitude;

        const longitude =
          item.longitude ??
          item.location?.coordinates
            ?.longitude ??
          item.wasteLocation
            ?.coordinates
            ?.longitude ??
          item.coordinates?.longitude;

        return {
          ...item,

          latitude:
            Number(latitude),

          longitude:
            Number(longitude),

          reportId:
            item.reportId ||
            item._id,
        };
      }
    ),
  ].filter(
    (item) =>
      Number.isFinite(
        Number(item.latitude)
      ) &&
      Number.isFinite(
        Number(item.longitude)
      )
  );

  // ===================================================
  // RELATIVE TIME
  // ===================================================

  const getRelativeTime =
    (dateValue) => {

      if (!dateValue)
        return "â€”";

      const date =
        new Date(dateValue);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "â€”";
      }

      const now =
        new Date();

      const diff =
        Math.max(
          0,
          now.getTime() -
            date.getTime()
        );

      const seconds =
        Math.floor(
          diff / 1000
        );

      if (
        seconds < 60
      ) {
        return "Just now";
      }

      const minutes =
        Math.floor(
          seconds / 60
        );

      if (
        minutes < 60
      ) {
        return `${minutes} minute${
          minutes === 1
            ? ""
            : "s"
        } ago`;
      }

      const hours =
        Math.floor(
          minutes / 60
        );

      if (
        hours < 24
      ) {
        return `${hours} hour${
          hours === 1
            ? ""
            : "s"
        } ago`;
      }

      const days =
        Math.floor(
          hours / 24
        );

      if (
        days < 30
      ) {
        return `${days} day${
          days === 1
            ? ""
            : "s"
        } ago`;
      }

      const months =
        Math.floor(
          days / 30
        );

      if (
        months < 12
      ) {
        return `${months} month${
          months === 1
            ? ""
            : "s"
        } ago`;
      }

      const years =
        Math.floor(
          months / 12
        );

      return `${years} year${
        years === 1
          ? ""
          : "s"
      } ago`;
    };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <main className="report-analysis-page">

      <section className="report-analysis-card">

      
        {/* =================================================
            PUBLIC HOME / SEARCH DASHBOARD
        ================================================= */}

        {!report && (
          <>
            {/* HERO */}
            <div className="report-home-hero">

              <div className="report-home-badge">
                <span className="live-pulse"></span>
                LIVE PUBLIC REPORT CENTER
              </div>

              <div className="report-analysis-icon">
                ðŸ”Ž
              </div>

              <h1>
                Report Analysis & Status
              </h1>

              <p>
                Track your SWACHHLENS waste report
                using your Report ID and registered
                email address.
              </p>

              <p>
                (à¬†à¬ªà¬£à¬™à­à¬• Report ID à¬à¬¬à¬‚ à¬‡à¬®à­‡à¬²à­
                à¬¦à­à­±à¬¾à¬°à¬¾ SWACHHLENS à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿà¬°
                à¬¸à­à¬¥à¬¿à¬¤à¬¿ à¬¦à­‡à¬–à¬¨à­à¬¤à­à¥¤)
              </p>

            </div>


            {/* =================================================
                LIVE STATISTICS
            ================================================= */}

            <section className="live-dashboard">

              <div className="live-dashboard-heading">

                <div>
                  <span>
                    SWACHHLENS NETWORK
                  </span>

                  <h2>
                    Live Report Overview
                  </h2>
                </div>
<div className="live-indicator">
  <span className="live-label">LIVE</span>

  <span className="live-clock">
    ðŸ• {currentIST} IST
  </span>
</div>
              </div>


              <div className="live-stat-grid">

               <div className="live-stat-card">
  <div className="live-stat-icon">
    ðŸ“Š
  </div>

  <div className="live-stat-content">
    <span>Total Reports</span>

    <strong>
      {overviewLoading
        ? "..."
        : overview.totalReports}
    </strong>

    <small>Across SWACHHLENS network</small>
  </div>
</div>


               <div className="live-stat-card">
  <div className="live-stat-icon">ðŸ“¥</div>

  <div className="live-stat-content">
    <span>Reports Received</span>

    <strong>
      {overviewLoading
        ? "..."
        : overview.pendingReports}
    </strong>

    <small>Awaiting resolution</small>
  </div>
</div>

<div className="live-stat-card">
  <div className="live-stat-icon">âœ…</div>

  <div className="live-stat-content">
    <span>Resolved</span>

    <strong>
      {overviewLoading
        ? "..."
        : overview.resolvedReports}
    </strong>

    <small>Successfully handled</small>
  </div>
</div>

<div className="live-stat-card">
  <div className="live-stat-icon">âš¡</div>

  <div className="live-stat-content">
    <span>Submitted Today</span>

    <strong>
      {overviewLoading
        ? "..."
        : overview.todayReports}
    </strong>

    <small>Today's activity</small>
  </div>
</div>

              </div>


             {/* =================================================
    LIVE ACTIVITY + MAP
================================================= */}

<div className="public-monitor-grid">

  {/* =================================================
      ACTIVITY PANEL
  ================================================= */}

  <div className="public-panel">

    <div className="public-panel-header">

      <div>
        <span>
          ACTIVITY
        </span>

        <h3>
          Recent Reports
        </h3>
      </div>

      <span className="panel-live-dot">
        LIVE
      </span>

    </div>


    <div className="activity-list">

      {overviewLoading && (
        <>
          <div className="activity-skeleton"></div>
          <div className="activity-skeleton"></div>
          <div className="activity-skeleton"></div>
        </>
      )}


      {!overviewLoading &&
        overview.recentReports.length === 0 && (
          <div className="empty-activity">

            <span>
              ðŸ“­
            </span>

            <p>
              No recent reports available.
            </p>

          </div>
        )}


      {!overviewLoading &&
        overview.recentReports
          .slice(0, 5)
          .map((item, index) => (

            <div
              className="activity-item"
              key={
                item._id ||
                item.reportId ||
                index
              }
            >

              <div className="activity-marker">
                <span></span>
              </div>


              <div className="activity-content">

                <strong>
                  Waste report received
                </strong>

                <span>
                  {item.locationName ||
                    item.district ||
                    item.state ||
                    "Location submitted"}
                </span>

                <small>
                  {getRelativeTime(
                    item.createdAt
                  )}
                </small>

              </div>

            </div>

          ))}

    </div>

  </div>

{/* =================================================
    MAP PANEL
================================================= */}

<div className="public-panel map-panel">

  <div className="public-panel-header">

    <div>

      <span>
        LIVE LOCATION NETWORK
      </span>

      <h3>
        Report Activity Map
      </h3>

    </div>

    <span className="panel-live-dot">
      LIVE
    </span>

  </div>


  {/* =================================================
      MAP CONTAINER
  ================================================= */}

  <div className="live-map-container">

    <SatelliteMap
      locations={mapLocations}
      selectedLocation={selectedReportLocation}
    />

  </div>
  {/* END live-map-container */}
 {/* =================================================
    MAP LOCATION INFO
================================================= */}

<div className="map-location-info">

  <div className="map-location-info-icon">
    ðŸ“
  </div>

  <div className="map-location-info-content">

    <strong>
      Map Location
    </strong>

    <p>
      The map is currently showing the location
      of the most recent waste report.
    </p>

    <span>
      ðŸ”Ž Enter a Report ID below to locate and
      view your reported waste area on the map.
    </span>

  </div>

</div>
  {/* =================================================
      MAP REPORT LOCATION SEARCH
      ONLY FOR SHOWING REPORT LOCATION ON MAP
  ================================================= */}

  <div className="map-report-search">

    <div className="map-report-search-header">

      <span>
        ðŸ“ LOCATE REPORT
      </span>

      <h4>
        View Your Report Location
      </h4>

    </div>


    <div className="map-report-search-form">

      <div className="map-report-input-wrapper">

        <span>
          #
        </span>

        <input
          type="text"
          value={mapReportIdInput}
          onChange={(e) =>
            setMapReportIdInput(
              e.target.value
                .toLowerCase()
                .replace(/\s/g, "")
            )
          }
          placeholder="Enter Report ID"
          autoComplete="off"
        />

      </div>


      <button
        type="button"
        className="map-report-search-button"
        onClick={handleMapReportLocation}
        disabled={mapReportLoading}
      >

        {mapReportLoading
          ? "Locating..."
          : "ðŸ“ Locate on Map"}

      </button>

    </div>


    {mapReportError && (

      <div className="map-report-search-error">

        âŒ {mapReportError}

      </div>

    )}

  </div>

</div>
{/* END map-panel */}

</div>
{/* END public-monitor-grid */}

{/* =================================================
    WASTE TYPE DISTRIBUTION
================================================= */}

<div className="public-panel analytics-panel waste-intelligence-panel">

  <div className="public-panel-header">

    <div>
      <span>
        WASTE INTELLIGENCE
      </span>

      <h3>
        Waste Type Distribution
      </h3>
    </div>

    <span className="analytics-period">
      LIVE
    </span>

  </div>


  <div className="waste-type-chart">

    {(() => {

      const wasteTypes = [
        "Plastic Waste",
        "Organic Waste",
        "Paper Waste",
        "Glass Waste",
        "E-Waste",
        "Construction Waste",
        "Mixed Waste",
        "Hazardous Waste",
        "Other",
      ];

      const distribution =
        overview.wasteTypeDistribution || [];

      const getCount = (type) => {

        const found =
          distribution.find(
            (item) =>
              String(
                item.type ||
                item.wasteType ||
                ""
              ).trim() === type
          );

        return found
          ? Number(found.count) || 0
          : 0;
      };

      const total =
        Number(overview.totalReports) || 0;


      return (
        <div className="waste-type-vertical-chart">

          {wasteTypes.map(
            (type, index) => {

              const count =
                getCount(type);

              const percentage =
                total > 0
                  ? Math.min(
                      100,
                      (count / total) * 100
                    )
                  : 0;

              return (

                <div
                  className="waste-type-column"
                  key={type}
                >

                  {/* VALUE */}

                  <div className="waste-type-value">
                    {count}
                  </div>


                  {/* BAR AREA */}

                  <div className="waste-type-bar-area">

                    <div
                      className="waste-type-bar-vertical"
                      style={{
                        height:
                          `${percentage}%`,
                      }}
                    ></div>

                  </div>


                  {/* PERCENTAGE */}

                  <small className="waste-type-percentage">
                    {percentage.toFixed(1)}%
                  </small>


                  {/* TYPE */}

                  <span className="waste-type-label">
                    {type}
                  </span>

                </div>

              );

            }
          )}

        </div>
      );

    })()}

  </div>

</div>
{/* =================================================
    OVERVIEW ERROR
================================================= */}

{overviewError && (

  <div className="overview-warning">

    âš ï¸ {overviewError}

  </div>

)}


</section>


{/* =================================================
    SEARCH CARD
================================================= */}

<section className="premium-search-card">

  <div className="search-card-top">

    <div className="search-card-icon">
      ðŸ”
    </div>


    <div>

      <span>
        SECURE REPORT ACCESS
      </span>

      <h2>
        Find Your Report
      </h2>

      <p>
        Enter the Report ID and email
        used while submitting the report.
      </p>

    </div>

  </div>


  <div className="premium-search-form">

    {/* =================================================
        REPORT ID
    ================================================= */}

    <div className="premium-input-group">

      <label>
        Report ID
      </label>


      <div className="premium-input-wrapper">

        <span>
          #
        </span>


        <input
          type="text"
          value={reportIdInput}
          onChange={(e) =>
            setReportIdInput(
              e.target.value
                .toLowerCase()
                .replace(/\s/g, "")
            )
          }
          placeholder="swlxxxx"
          autoComplete="off"
        />

      </div>


      <small>
        Your unique SWACHHLENS report
        identifier.
      </small>

    </div>


    {/* =================================================
        EMAIL
    ================================================= */}

    <div className="premium-input-group">

      <label>
        Registered Email
      </label>


      <div className="premium-input-wrapper">

        <span>
          @
        </span>


        <input
          type="email"
          value={emailInput}
          onChange={(e) =>
            setEmailInput(
              e.target.value
            )
          }
          placeholder="you@example.com"
          autoComplete="email"
        />

      </div>


      <small>
        Use the email associated with
        your report.
      </small>

    </div>


    {/* =================================================
        SEARCH BUTTON
    ================================================= */}

    <button
      type="button"
      className="premium-search-button"
      onClick={handleSearchReport}
      disabled={searchLoading}
    >

      {searchLoading ? (

        <>
          <span className="button-loader"></span>
          Searching Report...
        </>

      ) : (

        <>
          ðŸ”Ž
          Search My Report
        </>

      )}

    </button>

  </div>


  {/* =================================================
      SEARCH ERROR
  ================================================= */}

  {searchError && (

    <div className="premium-search-error">

      âŒ {searchError}

    </div>

  )}


  {/* =================================================
      SECURITY NOTE
  ================================================= */}

  <div className="search-security-note">

    ðŸ”’ Your report information is protected
    and can only be accessed using the
    matching Report ID and Email.

  </div>

</section>

            {/* =================================================
                NEW USER
            ================================================= */}

            <div className="analysis-status">

              <div className="status-dot">
                +
              </div>

              <div>

                <h3>
                  Are you a new user?
                </h3>

                <p>
                  Make your first report with
                  SWACHHLENS.
                </p>

                <p>
                  (à¬†à¬ªà¬£ à¬¨à­‚à¬† à­Ÿà­à¬œà¬°à­ à¬•à¬¿?
                  SWACHHLENS à¬°à­‡ à¬†à¬ªà¬£à¬™à­à¬•
                  à¬ªà­à¬°à¬¥à¬® à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿ à¬•à¬°à¬¨à­à¬¤à­à¥¤)
                </p>

                <button
                  type="button"
                  className="report-analysis-home-button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Make Your First Report â†’
                </button>

              </div>

            </div>


            {/* =================================================
                NO REPORT YET
            ================================================= */}

            {!searchLoading && (
              <div className="analysis-section">

                <p>
                  Enter your Report ID and Email above
                  to view your report analysis.
                </p>

                <p>
                  (à¬†à¬ªà¬£à¬™à­à¬• à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿ à¬¬à¬¿à¬¶à­à¬³à­‡à¬·à¬£ à¬¦à­‡à¬–à¬¿à¬¬à¬¾
                  à¬ªà¬¾à¬‡à¬ à¬‰à¬ªà¬°à­‡ à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿ ID à¬à¬¬à¬‚
                  à¬‡à¬®à­‡à¬²à­ à¬ªà­à¬°à¬¬à­‡à¬¶ à¬•à¬°à¬¨à­à¬¤à­à¥¤)
                </p>

              </div>
            )}

          </>
        )}


        {/* =================================================
            EXISTING REPORT ANALYSIS
            BELOW THIS POINT PRESERVED
        ================================================= */}

        {report && (
          <>

            {/* =================================================
                REPORT FOUND HEADER
            ================================================= */}

            <div className="report-analysis-header">

              <div className="report-analysis-icon">
                ðŸ“Š
              </div>

              <h1>
                Report Analysis
              </h1>

              <p>
                Your waste report has been successfully
                retrieved from SWACHHLENS.
              </p>

              <p>
                (à¬†à¬ªà¬£à¬™à­à¬• à¬†à¬¬à¬°à­à¬œà¬¨à¬¾ à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿ
                SWACHHLENS à¬°à­ à¬¸à¬«à¬³à¬¤à¬¾à¬° à¬¸à¬¹
                à¬ªà­à¬°à¬¾à¬ªà­à¬¤ à¬¹à­‹à¬‡à¬›à¬¿à¥¤)
              </p>

            </div>


            {/* =================================================
                REPORT ID
            ================================================= */}

            <div className="report-id-box">

              <span>
                Report ID
              </span>

              <strong>
                {reportId}
              </strong>

              <span>
                Email
              </span>

              <strong>
                {report?.email || "â€”"}
              </strong>

              <span>
                Submitted
              </span>

              <strong>
                {report?.createdAt
                  ? new Date(
                      report.createdAt
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )
                  : "â€”"}
              </strong>

            </div>


            {/* =================================================
                REPORT IMAGE
            ================================================= */}

            {reportImageUrl && (
              <div className="report-image-section">

                <h2>
                  ðŸ–¼ï¸ Reported Waste Image
                </h2>

                <div className="report-image-card">

                  <img
                    src={reportImageUrl}
                    alt={`Waste Report ${reportId}`}
                    className="report-image-preview"
                    onLoad={() => {
                      console.log(
                        "REPORT IMAGE LOADED:",
                        reportImageUrl
                      );
                    }}
                    onError={(e) => {
                      console.error(
                        "REPORT IMAGE FAILED:",
                        reportImageUrl
                      );
                      console.error(
                        "IMAGE ERROR:",
                        e
                      );
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>

              </div>
            )}


            {/* =================================================
                REPORT INFORMATION
            ================================================= */}

            <div className="analysis-section">

              <h2>
                ðŸ“‹ Report Information
              </h2>

              <div className="analysis-grid">

                <div className="analysis-item">

                  <span>
                    Citizen ID
                  </span>

                  <strong>
                    {report.citizen?.citizenId ||
                      "â€”"}
                  </strong>

                </div>


                <div className="analysis-item">

                  <span>
                    Waste Type
                  </span>

                  <strong>
                    {report.wasteType || "â€”"}
                  </strong>

                </div>


                <div className="analysis-item">

                  <span>
                    Visible Severity
                  </span>

                  <strong>
                    {report.visibleSeverity ||
                      "â€”"}
                  </strong>

                </div>


                <div className="analysis-item">

                  <span>
                    Report Status
                  </span>

                  <strong>
                    {report.status ||
                      "Reported"}
                  </strong>

                </div>


                {report.description && (
                  <div className="analysis-item full-width">

                    <span>
                      Description
                    </span>

                    <strong>
                      {report.description}
                    </strong>

                  </div>
                )}

              </div>

            </div>

{/* =================================================
    AI ANALYSIS
================================================= */}

<div className="analysis-section">

  <h2>
    ðŸ¤– SWACHHLENS AI Analysis
  </h2>


  {/* =================================================
      AI VERIFICATION
  ================================================= */}

  <div className="analysis-subsection">

    <h3>
      ðŸ” AI Verification
    </h3>

    <div className="analysis-grid">

      <div className="analysis-item">

        <span>
          Waste Detected
        </span>

        <strong>
          {wasteDetected}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          AI Confidence
        </span>

        <strong>
          {confidence}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          AI Category
        </span>

        <strong>
          {verification.category ||
            ai.wasteClassification ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Waste Classification
        </span>

        <strong>
          {ai.wasteClassification ||
            verification.category ||
            report.wasteType ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Visible Severity
        </span>

        <strong>
          {verification.visibleSeverity ||
            report.visibleSeverity ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Analysis Status
        </span>

        <strong>
          {ai.analysisStatus ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item full-width">

        <span>
          AI Reason
        </span>

        <strong>
          {verification.reason ||
            aiReason ||
            "â€”"}
        </strong>

      </div>

    </div>

  </div>


  {/* =================================================
      WASTE ANALYSIS DETAILS
  ================================================= */}

  <div className="analysis-subsection">

    <h3>
      â™»ï¸ Waste Analysis Details
    </h3>

    <div className="analysis-grid">

      <div className="analysis-item">

        <span>
          Estimated Quantity
        </span>

        <strong>
          {ai.estimatedQuantity ||
            verification.estimatedQuantity ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Hazard Detected
        </span>

        <strong>
          {typeof ai.hazardDetected ===
          "boolean"
            ? ai.hazardDetected
              ? "Yes"
              : "No"
            : typeof verification.hazardDetected ===
              "boolean"
            ? verification.hazardDetected
              ? "Yes"
              : "No"
            : "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Road Blockage
        </span>

        <strong>
          {typeof ai.roadBlockage ===
          "boolean"
            ? ai.roadBlockage
              ? "Yes"
              : "No"
            : typeof verification.roadBlockage ===
              "boolean"
            ? verification.roadBlockage
              ? "Yes"
              : "No"
            : "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Risk Score
        </span>

        <strong>
          {Number.isFinite(
            Number(
              report?.riskScore ??
                verification.riskScore
            )
          )
            ? Number(
                report?.riskScore ??
                  verification.riskScore
              )
            : "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Priority
        </span>

        <strong>
          {report?.priority ||
            verification.priority ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Prediction
        </span>

        <strong>
          {ai.prediction ||
            verification.prediction ||
            "â€”"}
        </strong>

      </div>

<div className="analysis-item full-width">

  <span>
    AI Description
  </span>

  <strong className="ai-long-text">
    {verification.description ||
      report.description ||
      "â€”"}
  </strong>

</div>

    </div>

  </div>


  {/* =================================================
      AI RESPONSE / RECOMMENDATION
  ================================================= */}

  <div className="analysis-subsection">

    <h3>
      ðŸ§  AI Response & Recommendation
    </h3>

    <div className="analysis-grid">

      <div className="analysis-item full-width">

        <span>
          Recommended Action
        </span>

        <strong>
          {ai.recommendedAction ||
            verification.recommendedAction ||
            "â€”"}
        </strong>

      </div>


      <div className="analysis-item full-width">

        <span>
          Predicted Outcome
        </span>

        <strong>
          {ai.prediction ||
            verification.prediction ||
            "â€”"}
        </strong>

      </div>

    </div>

  </div>


  {/* =================================================
      ANALYSIS TIMESTAMP
  ================================================= */}

  <div className="analysis-subsection">

    <h3>
      ðŸ•’ Analysis Information
    </h3>

    <div className="analysis-grid">

      <div className="analysis-item">

        <span>
          Analysis Status
        </span>

        <strong>
          {ai.analysisStatus ||
            "Completed"}
        </strong>

      </div>


      <div className="analysis-item">

        <span>
          Analyzed At
        </span>

        <strong>
          {ai.analyzedAt
            ? new Date(
                ai.analyzedAt
              ).toLocaleString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }
              )
            : "â€”"}
        </strong>

      </div>

    </div>

  </div>


</div>
            {/* =================================================
                WASTE LOCATION
            ================================================= */}

            <div className="analysis-section">

              <h2>
                ðŸ“ Waste Location
              </h2>

              <div className="analysis-location">

                <p>
                  <strong>
                    Country:
                  </strong>{" "}
                  {location.country ||
                    "India"}
                </p>

                <p>
                  <strong>
                    State:
                  </strong>{" "}
                  {location.state || "â€”"}
                </p>

                <p>
                  <strong>
                    District:
                  </strong>{" "}
                  {location.district ||
                    "â€”"}
                </p>

                <p>
                  <strong>
                    Block:
                  </strong>{" "}
                  {location.block || "â€”"}
                </p>

                <p>
                  <strong>
                    Village / Locality:
                  </strong>{" "}
                  {location.locality ||
                    "â€”"}
                </p>

                {location.gpsPlaceName && (
                  <p>
                    <strong>
                      GPS Place:
                    </strong>{" "}
                    {location.gpsPlaceName}
                  </p>
                )}

                {location.fullAddress && (
                  <p>
                    <strong>
                      Full Address:
                    </strong>{" "}
                    {location.fullAddress}
                  </p>
                )}

                {location.coordinates &&
                  location.coordinates.latitude !=
                    null &&
                  location.coordinates.longitude !=
                    null && (
                    <p>
                      <strong>
                        Coordinates:
                      </strong>{" "}
                      {Number(
                        location.coordinates
                          .latitude
                      ).toFixed(6)}
                      {" , "}
                      {Number(
                        location.coordinates
                          .longitude
                      ).toFixed(6)}
                    </p>
                  )}

              </div>

            </div>


            {/* =================================================
                CITIZEN SITUATION
            ================================================= */}

            {Object.keys(
              citizenSituation
            ).length > 0 && (
              <div className="analysis-section">

                <h2>
                  ðŸ‘¤ Citizen Situation
                </h2>

                <div className="analysis-grid">

                  <div className="analysis-item">

                    <span>
                      Near Waste Location
                    </span>

                    <strong>
                      {citizenSituation
                        .nearWasteLocation ||
                        "â€”"}
                    </strong>

                  </div>


                  <div className="analysis-item">

                    <span>
                      Affecting Daily Life
                    </span>

                    <strong>
                      {citizenSituation
                        .affectingDailyLife ||
                        "â€”"}
                    </strong>

                  </div>


                  <div className="analysis-item">

                    <span>
                      Blocking Public Space
                    </span>

                    <strong>
                      {citizenSituation
                        .blockingPublicSpace ||
                        "â€”"}
                    </strong>

                  </div>


                  <div className="analysis-item">

                    <span>
                      Sanitation Problem
                    </span>

                    <strong>
                      {citizenSituation
                        .sanitationProblem ||
                        "â€”"}
                    </strong>

                  </div>


                  <div className="analysis-item">

                    <span>
                      Long-Term Problem
                    </span>

                    <strong>
                      {citizenSituation
                        .longTermProblem ||
                        "â€”"}
                    </strong>

                  </div>


                  <div className="analysis-item">

                    <span>
                      Urgent Attention
                    </span>

                    <strong>
                      {citizenSituation
                        .urgentAttention ||
                        "â€”"}
                    </strong>

                  </div>

<div className="analysis-item full-width">

  <span>
    Predicted Outcome
  </span>

  <strong className="ai-long-text">
    {ai.prediction ||
      verification.prediction ||
      "â€”"}
  </strong>


                  </div>

                </div>

              </div>
            )}


            {/* =================================================
                REPORT STATUS
            ================================================= */}

            <div className="analysis-status">

              <div className="status-dot">
                âœ“
              </div>

              <div>

                <h3>
                  Report Submitted
                </h3>

                <p>
                  Your waste report has been received
                  successfully by SWACHHLENS.
                </p>

                <p>
                  (à¬†à¬ªà¬£à¬™à­à¬• à¬†à¬¬à¬°à­à¬œà¬¨à¬¾ à¬°à¬¿à¬ªà­‹à¬°à­à¬Ÿ
                  SWACHHLENS à¬¦à­à­±à¬¾à¬°à¬¾ à¬¸à¬«à¬³à¬¤à¬¾à¬° à¬¸à¬¹
                  à¬—à­à¬°à¬¹à¬£ à¬•à¬°à¬¾à¬¯à¬¾à¬‡à¬›à¬¿à¥¤)
                </p>

              </div>

            </div>


            {/* =================================================
                SEARCH ANOTHER REPORT
            ================================================= */}

            <button
              type="button"
              className="report-analysis-home-button"
              onClick={() => {

                setReport(null);
                setSearchError("");
                setReportIdInput("");
                setEmailInput("");

              }}
            >
              ðŸ”Ž Search Another Report
            </button>


            {/* =================================================
                BACK HOME
            ================================================= */}

            <button
              type="button"
              className="report-analysis-home-button"
              onClick={() =>
                navigate("/")
              }
            >
              â† Back to Home
            </button>

          </>
        )}

      </section>

    </main>
  );
}

export default ReportAnalysisStatus;
