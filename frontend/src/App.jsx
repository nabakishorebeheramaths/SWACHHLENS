import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import StepGuard from "./components/StepGuard";

// =========================================================
// PAGES
// =========================================================

import Home from "./pages/Home";
import CitizenDetails from "./pages/CitizenDetails";
import ReportWaste from "./pages/ReportWaste";
import ReportAnalysisStatus from "./pages/ReportAnalysisStatus";
import Admin from "./pages/Admin";
import ResponseRequest from "./pages/ResponseRequest";
import SwachhlensAdmin from "./pages/SwachhlensAdmin";
import About from "./pages/About";

import "./App.css";


// =========================================================
// APP
// =========================================================

function App() {

  return (

    <BrowserRouter>


      {/* =====================================================
          GLOBAL NAVBAR
      ===================================================== */}

      <Navbar />


      {/* =====================================================
          GLOBAL SCROLL
      ===================================================== */}

      <ScrollToTop />


      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>


        {/* ===================================================
            HOME
        =================================================== */}

        <Route
          path="/"
          element={
            <StepGuard requiredStep="home">
              <Home />
            </StepGuard>
          }
        />


        {/* ===================================================
            CITIZEN DETAILS
            STEP 01
        =================================================== */}

        <Route
          path="/citizen-details"
          element={
            <StepGuard requiredStep="citizen">
              <CitizenDetails />
            </StepGuard>
          }
        />


        {/* ===================================================
            WASTE REPORT
            STEP 02
            FINAL ROUTE-LEVEL PROTECTION
        =================================================== */}

        {/*
          IMPORTANT:

          This route MUST remain mounted at:

          /report-waste

          StepGuard decides whether the actual ReportWaste
          page should be shown or the blocked screen.

          When the previous steps are incomplete, the user
          remains on /report-waste and sees:

          "Please complete the previous step"

          with the Odia message and the
          "Complete Previous Step" button.
        */}

        <Route
          path="/report-waste"
          element={
            <StepGuard requiredStep="waste-report">
              <ReportWaste />
            </StepGuard>
          }
        />


        {/* ===================================================
            REPORT ANALYSIS & STATUS
            AFTER WASTE REPORT SUBMISSION
        =================================================== */}

        <Route
          path="/report-analysis-status"
          element={
            <StepGuard requiredStep="analysis-status">
              <ReportAnalysisStatus />
            </StepGuard>
          }
        />


        {/* ===================================================
            ADMIN
            RESPONSE CENTER
        =================================================== */}

        <Route
          path="/admin"
          element={
            <Admin />
          }
        />


        {/* ===================================================
            RESPONSE CENTER
            SAME RESPONSE CENTER PAGE
        =================================================== */}

        <Route
          path="/response-center"
          element={
            <Admin />
          }
        />


        {/* ===================================================
            RESPONSE REQUEST
            AFTER ORGANIZATION SELECTION
        =================================================== */}

        <Route
          path="/response-request"
          element={
            <ResponseRequest />
          }
        />


        {/* ===================================================
            SWACHHLENS ADMIN
            PRIVATE ADMIN PANEL
        =================================================== */}

        <Route
          path="/swachhlens-admin"
          element={
            <SwachhlensAdmin />
          }
        />


        {/* ===================================================
            ABOUT
        =================================================== */}

        <Route
          path="/about"
          element={
            <About />
          }
        />


        {/* ===================================================
            FALLBACK
        =================================================== */}

        <Route
          path="*"
          element={
            <Home />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;