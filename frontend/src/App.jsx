import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import CitizenId from "./pages/CitizenId";
import CitizenDetails from "./pages/CitizenDetails";
import ReportWaste from "./pages/ReportWaste";
import ReportAnalysisStatus from "./pages/ReportAnalysisStatus";
import Admin from "./pages/Admin";
import ResponseRequest from "./pages/ResponseRequest";
import SwachhlensAdmin from "./pages/SwachhlensAdmin";
import About from "./pages/About";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <ScrollToTop />
<Routes>

  {/* HOME */}
  <Route
    path="/"
    element={<Home />}
  />

  {/* CITIZEN ID */}
  <Route
    path="/citizen-id"
    element={<CitizenId />}
  />

  {/* CITIZEN DETAILS */}
  <Route
    path="/citizen-details"
    element={<CitizenDetails />}
  />

  {/* REPORT WASTE */}
  <Route
    path="/report-waste"
    element={<ReportWaste />}
  />

  {/* REPORT STATUS */}
  <Route
    path="/report-analysis-status"
    element={<ReportAnalysisStatus />}
  />

  {/* ADMIN */}
  <Route
    path="/admin"
    element={<Admin />}
  />

  {/* RESPONSE CENTER */}
  <Route
    path="/response-center"
    element={<Admin />}
  />

  {/* RESPONSE REQUEST */}
  <Route
    path="/response-request"
    element={<ResponseRequest />}
  />

  {/* SWACHHLENS ADMIN */}
  <Route
    path="/swachhlens-admin"
    element={<SwachhlensAdmin />}
  />

  {/* ABOUT */}
  <Route
    path="/about"
    element={<About />}
  />

  {/* FALLBACK */}
  <Route
    path="*"
    element={<Home />}
  />

</Routes>
    </BrowserRouter>
  );
}

export default App;