# SWACHHLENS — Third-Party APIs & External Services

## 1. Google Gemini / Google GenAI

**Purpose:** AI-powered waste image analysis.

**Used for:**
- Waste detection
- Waste category/type identification
- Visible severity assessment
- Confidence estimation
- Risk scoring
- Priority assessment
- Structured AI analysis

**Integration:** `@google/genai`

**Backend location:**
- `backend/services/aiWasteAnalysis.js`
- `backend/utils/imageWasteAI.js`

**Data flow:**

Citizen Waste Image
→ Backend
→ Gemini AI
→ Structured Waste Analysis
→ MongoDB Waste Report

---

## 2. Cloudinary

**Purpose:** Cloud-based storage of submitted waste images.

**Used for:**
- Uploading waste evidence images
- Generating secure image URLs
- Retrieving stored evidence for report processing

**Integration:**
- `cloudinary`
- `multer-storage-cloudinary`

**Backend location:**
- `backend/routes/wasteReports.js`

**Data flow:**

Citizen Image
→ Multer Upload
→ Cloudinary
→ Secure Image URL
→ Waste Report

---

## 3. MongoDB Atlas

**Purpose:** Primary persistent database for SWACHHLENS.

**Used for storing:**
- Citizen records
- Location records
- Waste reports
- Organization records
- Response requests
- AI analysis results
- Report status information

**Integration:** `mongoose`

**Backend models:**
- `Citizen`
- `Location`
- `WasteReport`
- `Organization`
- `ResponseRequest`

**Data flow:**

Frontend Request
→ Express API
→ Mongoose
→ MongoDB Atlas
→ API Response

---

## 4. Brevo HTTP API

**Purpose:** Transactional email communication.

**Used for:**
- Citizen email OTP verification
- Waste report confirmation
- Report ID notification
- Sending submitted waste image as an inline email attachment

**API endpoint:**

`https://api.brevo.com/v3/smtp/email`

**Backend location:**

`backend/utils/emailOtp.js`

**OTP flow:**

Citizen Email
→ SWACHHLENS Backend
→ Generate OTP
→ Brevo API
→ Citizen Email Inbox
→ OTP Verification

**Report notification flow:**

Waste Report
→ Generate Confirmation Email
→ Attach Waste Image
→ Brevo API
→ Citizen Email

---

## 5. Leaflet / React-Leaflet

**Purpose:** Interactive geographic visualization.

**Used for:**
- Displaying report locations
- Map visualization
- Location-based report presentation

**Frontend location:**

`frontend/src/pages/ReportAnalysisStatus.jsx`

**Integration:**
- `leaflet`
- `react-leaflet`

---

## 6. Axios

**Purpose:** HTTP communication between the React frontend and Express backend.

**Used for:**
- Citizen APIs
- OTP APIs
- Location APIs
- Waste report APIs
- Organization APIs
- Response APIs

**Frontend location:**

`frontend/src/services/api.js`

**Data flow:**

React Frontend
→ Axios
→ Express REST API
→ Backend Processing
→ JSON Response
→ React UI

---

## 7. XLSX

**Purpose:** Importing and processing India location datasets.

**Used for:**
- Reading XLS/XLSX location datasets
- Converting spreadsheet data into structured records
- Importing location information into MongoDB

**Backend location:**

`backend/scripts/importLocations.js`

---

## 8. Multer

**Purpose:** Handling multipart/form-data image uploads.

**Used in the waste reporting pipeline to receive citizen-submitted image evidence before cloud storage and AI processing.**

**Integration:**
- `multer`
- `multer-storage-cloudinary`

---

## 9. Express and CORS

**Purpose:** Backend REST API and controlled frontend-backend communication.

**Express is used for:**
- API routing
- Request handling
- Middleware
- Server-side processing

**CORS is used for:**
- Allowing the authorized frontend application to communicate with the backend API.

**Backend location:**

`backend/server.js`

---

# External Services Summary

| Service / Technology | Primary Role |
|---|---|
| Google Gemini | AI waste analysis |
| Cloudinary | Waste image storage |
| MongoDB Atlas | Persistent application database |
| Brevo | OTP and transactional email |
| Leaflet / React-Leaflet | Map visualization |
| Axios | Frontend-backend communication |
| XLSX | Location dataset processing |
| Multer | Image upload handling |
| Express | REST API backend |
| CORS | Cross-origin API communication |

---

# Security Note

API keys, database credentials, email credentials, and other secrets are stored in environment variables and are not included in source-code documentation or version-controlled files.

The `.env` file is excluded through `.gitignore`.

No secret values should be included in competition submission documents, screenshots, architecture diagrams, or source-code repositories.

---

# Data Protection Principle

SWACHHLENS separates application data from service credentials.

External service credentials are loaded through environment variables, while application code references configuration variables rather than hard-coded secret values.

