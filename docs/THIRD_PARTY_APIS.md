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

---

# 11. Data Protection & Security Principles

SWACHHLENS follows practical security and data-protection principles for handling citizen reports, uploaded evidence, application data, and external service credentials.

### Secret Management

API keys, database credentials, email credentials, Cloudinary credentials, AI credentials, and other private configuration values must not be hard-coded in source code.

Sensitive configuration is provided through environment variables.

The `.env` file is excluded through `.gitignore`.

### Data Minimization

The application should collect and process only information required for:

- Citizen verification
- Waste incident reporting
- AI-assisted analysis
- Location-aware reporting
- Report tracking
- Response coordination

### Credential Separation

Application data is kept separate from external-service credentials.

Backend services access required credentials through environment configuration rather than exposing them to the frontend.

### Production Security

Production deployment should use HTTPS, controlled CORS configuration, validated API inputs, secure file-upload restrictions, protected credentials, and appropriate access controls.

---

# 12. AI Safety & Reliability

Google Gemini is used as an AI-assisted analysis component.

AI results should be treated as decision-support information rather than absolute ground truth.

The SWACHHLENS backend remains responsible for:

- Validating incoming requests
- Processing AI responses
- Applying application-level validation
- Persisting structured results
- Presenting results to users

AI accuracy may be affected by image quality, model behavior, service availability, and API quota limitations.

For high-impact decisions, appropriate human or authority review remains recommended.

---

# 13. External Service Failure Considerations

SWACHHLENS depends on selected external services for specialized capabilities.

Potential failures include:

- AI API quota exhaustion or temporary unavailability
- Cloud image-storage failure
- Email delivery failure
- Database connectivity failure
- Network interruption
- Mapping or external-resource availability issues

These dependencies should be considered during deployment, testing, and production monitoring.

---

# 14. Assumptions

The current SWACHHLENS prototype operates under the following assumptions:

1. Citizens provide reasonably accurate incident information.
2. Uploaded images contain sufficient visual evidence for AI-assisted analysis.
3. Internet connectivity is available during reporting.
4. Required external services are reachable when needed.
5. Configured API credentials remain valid and within applicable service quotas.
6. Organization information maintained by the platform is sufficiently accurate for response-support purposes.
7. AI analysis is treated as decision-support rather than absolute ground truth.

---

# 15. Compliance Considerations

SWACHHLENS is designed with security, privacy, and responsible data-handling considerations in mind.

However, the prototype does not claim formal legal, regulatory, or security certification.

Before production deployment, the system should be reviewed against applicable requirements concerning:

- Personal data protection
- User consent and transparency
- Data retention
- Data deletion
- Access control
- Security incident handling
- Third-party data processing
- Cloud-service data handling
- Applicable Indian data-protection requirements

Appropriate legal and security review should be completed before large-scale public deployment.

---

# 16. Known Limitations

The current prototype has several practical limitations:

- AI analysis quality depends on image quality and model behavior.
- External AI service quotas and availability can affect analysis.
- Email delivery depends on the configured email service.
- Cloud image processing depends on network and storage availability.
- Location accuracy may depend on GPS or manually selected information.
- Organization recommendations depend on the quality of available organization and location data.
- The prototype may require additional production hardening for large-scale deployment.
- Formal regulatory certification and independent security auditing are outside the prototype scope.

---

# 17. Future Improvements

Potential future improvements include:

- Stronger authentication and role-based access control
- Advanced image validation
- Improved AI confidence calibration
- Human-in-the-loop verification
- Improved organization ranking
- Production-grade audit logging
- Data retention and deletion controls
- Automated monitoring and alerting
- Service fallback strategies
- API rate limiting
- Expanded geographic datasets
- Independent security assessment
- Privacy and compliance review before public-scale deployment

---

# 18. Final Architecture Principle

SWACHHLENS uses third-party technologies as specialized infrastructure components while keeping the core reporting workflow under application control.

The overall principle is:

**Citizen Interface → Application Backend → External Services → Structured Data → Response Workflow**

This separation improves maintainability, transparency, security awareness, and future scalability.

---

# 19. Submission Security Reminder

Before submitting or pushing the project:

- Do not commit API keys.
- Do not commit database passwords.
- Do not commit email credentials.
- Do not commit authentication tokens.
- Do not commit browser cookies or session files.
- Do not include `.env` files containing secrets.
- Do not include private credentials in screenshots or documentation.

Only sanitized configuration examples should be included in public submission materials.

