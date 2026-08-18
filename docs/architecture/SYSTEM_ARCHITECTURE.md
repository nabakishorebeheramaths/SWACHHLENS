# SWACHHLENS — SYSTEM ARCHITECTURE

AI WASTE-RESPONSE INTELLIGENCE SYSTEM

Version: 2.0
Architecture Classification: Production-Oriented Prototype
Document Type: System Architecture & Technical Design
Project: SWACHHLENS
Domain: AI-Assisted Waste Intelligence and Response Coordination


======================================================================
1. EXECUTIVE ARCHITECTURE SUMMARY
======================================================================

SWACHHLENS is an AI-assisted waste reporting and response intelligence
platform designed to transform citizen-reported waste incidents into
structured, evidence-backed and response-oriented workflows.

The platform connects:

    CITIZENS
        |
        v
    REACT WEB PORTAL
        |
        v
    EXPRESS REST API
        |
        +------------------+
        |                  |
        v                  v
    AI ANALYSIS       GEOGRAPHIC SERVICES
        |                  |
        +--------+---------+
                 |
                 v
          WASTE REPORT ENGINE
                 |
        +--------+---------+
        |                  |
        v                  v
   MONGODB ATLAS       CLOUDINARY
        |              EVIDENCE IMAGES
        |
        v
   REPORT ANALYSIS
        |
        v
   RESPONSE CENTER
        |
        v
   ORGANIZATION
   RECOMMENDATION
        |
        v
   EXACTLY ONE
   ORGANIZATION
        |
        v
   FINAL REQUEST
        |
        v
   RESPONSE WORKFLOW


The architecture is intentionally modular so that AI services,
geographic services, storage, communication providers and response
organizations can evolve independently without redesigning the complete
application.


======================================================================
2. SYSTEM OBJECTIVE
======================================================================

The primary objective of SWACHHLENS is to establish a complete digital
incident lifecycle for waste-related civic reporting.

The system is designed to:

1. Verify citizen identity through email OTP.
2. Capture structured waste incident information.
3. Capture citizen situation information.
4. Capture geographic information.
5. Collect photographic evidence.
6. Analyze waste evidence using Google Gemini.
7. Generate structured AI insights.
8. Store the incident and associated data.
9. Present report analysis and status information.
10. Recommend suitable response organizations.
11. Require selection of exactly one organization.
12. Capture final response-request information.
13. Support optional appointment requests.
14. Initiate an operational response workflow.
15. Provide transactional email communication.
16. Preserve evidence and structured incident information.


======================================================================
3. ARCHITECTURAL PRINCIPLES
======================================================================

SWACHHLENS follows the following architectural principles:

3.1 Separation of Concerns

Presentation, API handling, AI orchestration, persistence, geographic
services, communication and response coordination remain logically
separated.

3.2 Evidence First

The submitted waste image is treated as primary incident evidence.
AI analysis operates on submitted evidence rather than replacing it.

3.3 Structured Intelligence

AI output is transformed into structured application data such as:

    Waste Detection
    Waste Type
    Category
    Severity
    Confidence
    Risk Score
    Priority
    Hazard Assessment

3.4 Human-in-the-Loop Response

AI assists response decisions but does not independently dispatch a
response organization.

The Response Center provides human-controlled organization selection.

3.5 Exactly-One Organization Model

The response workflow requires the administrator / response coordinator
to select exactly one organization before final submission.

3.6 External Service Isolation

External providers are accessed through integration boundaries and
environment configuration rather than hard-coded credentials.

3.7 Progressive Workflow

The citizen journey follows controlled stages so that important
information is collected before the report becomes operational.

3.8 Failure Awareness

External services such as AI, email, image storage and databases are
treated as potential failure points.


======================================================================
4. SYSTEM CONTEXT
======================================================================

                         +----------------------+
                         |       CITIZEN        |
                         |                      |
                         | Identity             |
                         | Incident Information |
                         | Situation            |
                         | Location             |
                         | Waste Evidence       |
                         +----------+-----------+
                                    |
                                    v
                    +---------------------------+
                    |     SWACHHLENS PORTAL     |
                    |                           |
                    | React + Vite              |
                    | Citizen Experience        |
                    | Administrator Experience  |
                    +-------------+-------------+
                                  |
                                  v
                    +---------------------------+
                    |     EXPRESS REST API      |
                    |                           |
                    | Authentication            |
                    | Validation                |
                    | Domain Routing            |
                    | Workflow Coordination     |
                    +------+------+-------------+
                           |      | 
              +------------+      +----------------+
              |                                 |
              v                                 v
     +------------------+              +------------------+
     | GOOGLE GEMINI AI |              | LOCATION SYSTEM  |
     |                  |              |                  |
     | Waste Detection  |              | State            |
     | Classification   |              | District         |
     | Severity         |              | Block            |
     | Risk             |              | Village          |
     | Priority         |              | Coordinates      |
     +------------------+              +------------------+
              |
              v
     +---------------------------+
     |     WASTE REPORT ENGINE   |
     +-------------+-------------+
                   |
          +--------+---------+
          |                  |
          v                  v
 +----------------+   +----------------+
 | MONGODB ATLAS  |   |   CLOUDINARY   |
 |                |   |                |
 | Citizens       |   | Waste Images   |
 | Reports        |   | Evidence       |
 | Locations      |   | Media Storage  |
 | Organizations  |   |                |
 | Requests       |   +----------------+
 +-------+--------+
         |
         v
 +---------------------------+
 |      RESPONSE CENTER      |
 |                           |
 | Report Lookup             |
 | AI/Location Suggestions   |
 | Organization Selection    |
 | Final Request             |
 | Appointment Request      |
 +-------------+-------------+
               |
               v
 +---------------------------+
 | RESPONSE ORGANIZATION     |
 |                           |
 | Incident Processing       |
 | Response Workflow         |
 | Operational Coordination |
 +---------------------------+

Communication boundary:

                    SWACHHLENS API
                          |
                          v
                  +---------------+
                  | BREVO HTTP API|
                  +-------+-------+
                          |
                          v
                     CITIZEN EMAIL


======================================================================
5. ARCHITECTURE LAYERS
======================================================================

5.1 PRESENTATION LAYER

Technology:

    React
    Vite
    JavaScript
    React-Leaflet / Leaflet

Responsibilities:

    Citizen reporting interface
    Citizen verification interface
    Incident information collection
    Location selection
    Evidence upload
    Report analysis display
    Report status display
    Response Center
    Administrator interface


5.2 API / APPLICATION LAYER

Technology:

    Node.js
    Express

Responsibilities:

    HTTP request handling
    Input processing
    Validation
    Route coordination
    Authentication
    Workflow orchestration
    AI service invocation
    Image handling
    Database operations
    Response workflow operations
    Error handling


5.3 INTELLIGENCE LAYER

Technology:

    Google Gemini

Responsibilities:

    Waste detection
    Waste classification
    Severity assessment
    Confidence estimation
    Risk assessment
    Priority generation
    Structured AI analysis


5.4 DATA LAYER

Primary database:

    MongoDB Atlas

Application data includes:

    Citizen
    WasteReport
    Location
    Organization
    ResponseRequest


5.5 MEDIA / EVIDENCE LAYER

Technology:

    Cloudinary

Responsibilities:

    Waste evidence image storage
    Persistent media access
    Separation of media from application database records


5.6 COMMUNICATION LAYER

Technology:

    Brevo HTTP API

Responsibilities:

    Email OTP delivery
    Waste-report notification emails
    Transactional communication


5.7 GEOGRAPHIC LAYER

Technology:

    India location dataset
    Leaflet
    React-Leaflet
    Geographic coordinates
    Reverse geocoding / location services where applicable

Responsibilities:

    State selection
    District selection
    Block selection
    Village selection
    Location normalization
    Map visualization
    Geographic response support


======================================================================
6. COMPLETE END-TO-END INCIDENT LIFECYCLE
======================================================================

                         CITIZEN
                            |
                            v
                  +-------------------+
                  | Citizen Details   |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Email OTP Verify  |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Incident Details  |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Citizen Situation |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Location + Image  |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Express API       |
                  +---------+---------+
                            |
                +-----------+-----------+
                |                       |
                v                       v
          CLOUDINARY               LOCATION SYSTEM
          IMAGE STORAGE            Geographic Data
                |                       |
                +-----------+-----------+
                            |
                            v
                     GOOGLE GEMINI
                            |
                            v
                   STRUCTURED AI
                      ANALYSIS
                            |
                            v
                   WASTE REPORT
                      CREATION
                            |
                            v
                     MONGODB
                       ATLAS
                            |
                            v
                 REPORT ANALYSIS
                     & STATUS
                            |
                            v
                  RESPONSE CENTER
                            |
                            v
              AI / LOCATION BASED
              ORGANIZATION SUGGESTIONS
                            |
                            v
                SELECT EXACTLY ONE
                   ORGANIZATION
                            |
                            v
                    FINAL REQUEST
                     /       \
                    /         \
                   v           v
             Feedback      Appointment
                   \           /
                    \         /
                     v       v
                    FINAL SUBMIT
                         |
                         v
                  RESPONSE WORKFLOW
                         |
                         v
               RESPONSE ORGANIZATION


======================================================================
7. CITIZEN REPORTING ARCHITECTURE
======================================================================

The citizen reporting process is intentionally progressive.

Stage 1:
    Citizen details

Stage 2:
    Email verification

Stage 3:
    Incident information

Stage 4:
    Citizen situation

Stage 5:
    Geographic location

Stage 6:
    Waste evidence

Stage 7:
    AI analysis

Stage 8:
    Report creation

Stage 9:
    Report analysis and status


The workflow prevents incomplete information from becoming a finalized
incident whenever the application workflow requires earlier stages to be
completed.


======================================================================
8. EMAIL VERIFICATION ARCHITECTURE
======================================================================

                         CITIZEN
                            |
                            v
                       EMAIL INPUT
                            |
                            v
                    /api/otp/send
                            |
                            v
                     OTP SERVICE
                            |
                            v
                         BREVO
                            |
                            v
                      CITIZEN EMAIL
                            |
                            v
                      OTP SUBMISSION
                            |
                            v
                   /api/otp/verify
                            |
                            v
                    OTP VALIDATION
                            |
                     +------+------+
                     |             |
                   VALID         INVALID
                     |             |
                     v             v
              VERIFIED FLOW     ERROR


OTP characteristics:

    Cryptographically generated numeric OTP
    Five-minute validity window
    Email normalization
    OTP stored only after successful email delivery
    Failed delivery does not retain the OTP


======================================================================
9. AI INTELLIGENCE PIPELINE
======================================================================

                         WASTE IMAGE
                              |
                              v
                     IMAGE VALIDATION
                              |
                              v
                     BACKEND PROCESSING
                              |
                              v
                       GOOGLE GEMINI
                              |
                              v
                     WASTE DETECTION
                              |
                              v
                     CLASSIFICATION
                              |
              +---------------+----------------+
              |               |                |
              v               v                v
          SEVERITY        CONFIDENCE       CATEGORY
              |               |                |
              +---------------+----------------+
                              |
                              v
                       RISK ASSESSMENT
                              |
                              v
                          PRIORITY
                              |
                              v
                    STRUCTURED RESULT
                              |
                              v
                       WASTE REPORT


The AI layer is decision-support infrastructure.

The AI result should not be interpreted as an autonomous legal,
administrative or emergency dispatch decision.


======================================================================
10. AI SAFETY / VALIDATION BOUNDARY
======================================================================

The backend validates AI output before allowing the report workflow to
continue.

Important validation concepts include:

    Waste detection result
    AI confidence
    Structured output validity
    Supported waste categories
    Supported severity values
    Risk and priority values

Where configured by the application, non-waste images or insufficient
AI confidence can be rejected rather than creating an unreliable waste
incident.


======================================================================
11. GEOGRAPHIC ARCHITECTURE
======================================================================

                         LOCATION INPUT
                              |
                +-------------+-------------+
                |                           |
                v                           v
        MANUAL SELECTION               GPS / MAP
                |                           |
                +-------------+-------------+
                              |
                              v
                     LOCATION NORMALIZATION
                              |
                              v
                    INDIA LOCATION DATA
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
           STATE          DISTRICT           BLOCK
             |                |                |
             +----------------+----------------+
                              |
                              v
                           VILLAGE
                              |
                              v
                    LATITUDE / LONGITUDE
                              |
                              v
                     STORED INCIDENT


Geographic hierarchy:

    Country
       |
       +-- State
            |
            +-- District
                 |
                 +-- Block
                      |
                      +-- Village


======================================================================
12. IMAGE / EVIDENCE ARCHITECTURE
======================================================================

                         IMAGE UPLOAD
                              |
                              v
                     EXPRESS MULTIPART API
                              |
                              v
                     IMAGE VALIDATION
                              |
                              v
                         CLOUDINARY
                              |
                              +-------> Persistent Image
                              |
                              v
                         WASTE REPORT
                              |
                              v
                     AI ANALYSIS PIPELINE


The image is treated as incident evidence.

The application database stores report-level information while the
media platform stores the actual evidence image.


======================================================================
13. DATA ARCHITECTURE
======================================================================

                         MONGODB ATLAS
                              |
        +----------+----------+----------+----------+
        |          |          |          |          |
        v          v          v          v          v
     CITIZEN   WASTEREPORT LOCATION ORGANIZATION RESPONSE
                                                        REQUEST


13.1 CITIZEN

Represents the reporting citizen and associated identity information.

13.2 WASTEREPORT

Represents the primary waste incident.

Conceptual information includes:

    Report ID
    Citizen reference
    Email
    Waste evidence
    Waste type
    Severity
    Location
    Citizen situation
    AI analysis
    Risk
    Priority
    Timestamps

13.3 LOCATION

Represents structured Indian geographic hierarchy and coordinates.

13.4 ORGANIZATION

Represents response organizations available to the response workflow.

13.5 RESPONSEREQUEST

Represents the final organization-selection and response request.


======================================================================
14. RESPONSE CENTER ARCHITECTURE
======================================================================

                         WASTE REPORT
                              |
                              v
                       REPORT LOOKUP
                              |
                              v
                    INCIDENT INFORMATION
                              |
                              v
                AI / LOCATION BASED
                ORGANIZATION SUGGESTIONS
                              |
                              v
                   RESPONSE COORDINATOR
                              |
                              v
                SELECT EXACTLY ONE
                   ORGANIZATION
                              |
                              v
                      FINAL REQUEST
                              |
                 +------------+------------+
                 |                         |
                 v                         v
             FEEDBACK                 APPOINTMENT
                 |                     OPTIONAL
                 +------------+------------+
                              |
                              v
                         FINAL SUBMIT
                              |
                              v
                     RESPONSE WORKFLOW
                              |
                              v
                  SELECTED ORGANIZATION


This creates a human-controlled response boundary between automated
recommendation and operational organization selection.


======================================================================
15. API ARCHITECTURE
======================================================================

The backend exposes REST-style APIs grouped by domain.

Base API groups:

    /api/admin-auth
    /api/citizen
    /api/locations
    /api/organizations
    /api/otp
    /api/response
    /api/waste-reports


======================================================================
16. API ENDPOINT CATALOG
======================================================================

16.1 ADMIN AUTHENTICATION

POST    /api/admin-auth/login
GET     /api/admin-auth/me
POST    /api/admin-auth/logout


16.2 CITIZEN

GET     /api/citizen/by-email
POST    /api/citizen/location
POST    /api/citizen/verify


16.3 LOCATION

GET     /api/locations/states
GET     /api/locations/districts
GET     /api/locations/blocks
GET     /api/locations/villages


16.4 ORGANIZATIONS

GET     /api/organizations/


16.5 OTP

POST    /api/otp/send
POST    /api/otp/verify


16.6 RESPONSE CENTER

GET     /api/response/suggestions/:reportId
GET     /api/response/report/:reportId
POST    /api/response/request
GET     /api/response/admin/requests


16.7 WASTE REPORTS

POST    /api/waste-reports/analyze-image
POST    /api/waste-reports/
GET     /api/waste-reports/public-overview
GET     /api/waste-reports/by-report-id
GET     /api/waste-reports/
GET     /api/waste-reports/by-email
GET     /api/waste-reports/by-report-id/location
GET     /api/waste-reports/:id


Total currently identified application endpoints:

    25


======================================================================
17. REQUEST / RESPONSE ARCHITECTURE
======================================================================

                         CLIENT
                           |
                           v
                     HTTP REQUEST
                           |
                           v
                    EXPRESS ROUTER
                           |
                           v
                    DOMAIN LOGIC
                           |
              +------------+------------+
              |                         |
              v                         v
           SUCCESS                    FAILURE
              |                         |
              v                         v
        JSON RESPONSE             ERROR RESPONSE


Typical response characteristics:

    success
    message
    data
    identifiers
    structured error information where applicable


HTTP status classes used by the application include:

    200  Successful operation
    201  Resource created
    400  Invalid request
    401  Authentication failure
    403  Forbidden operation
    404  Resource not found
    409  Conflict
    500  Server / processing error


======================================================================
18. AUTHENTICATION & AUTHORIZATION
======================================================================

SWACHHLENS contains separate concepts for:

    Citizen verification
    Administrator authentication
    Response workflow authorization

Citizen verification:

    Email
       |
       v
    OTP
       |
       v
    Verification state


Administrator access:

    Admin credentials
       |
       v
    Authentication
       |
       v
    Protected administrative operations


Administrative endpoints must remain protected from unauthorized
response workflow manipulation.


======================================================================
19. SECURITY ARCHITECTURE
======================================================================

Security boundaries include:

    Environment-based credentials
    Admin authentication
    OTP expiration
    Email normalization
    Input validation
    HTTP status validation
    CORS configuration
    Request body limits
    Error handling
    Protected administrative routes


Secrets must not be committed into source code.

Expected secret categories include:

    Database credentials
    AI credentials
    Cloudinary credentials
    Brevo credentials
    Administrative credentials
    Other provider-specific secrets


Secrets belong in environment configuration.


======================================================================
20. ERROR HANDLING ARCHITECTURE
======================================================================

External dependency failures may occur at:

    MongoDB Atlas
    Google Gemini
    Cloudinary
    Brevo
    Geographic services


Application failure path:

       REQUEST
          |
          v
      VALIDATION
          |
       +--+--+
       |     |
     VALID  INVALID
       |     |
       v     v
    PROCESS  400
       |
   +---+-----------------------+
   |       |        |          |
   v       v        v          v
 Mongo   Gemini  Cloudinary  Brevo
   |       |        |          |
   +-------+--------+----------+
           |
        SUCCESS
           |
           v
       RESPONSE


Failures should be logged without exposing sensitive credentials.


======================================================================
21. OBSERVABILITY & LOGGING
======================================================================

The backend contains operational logging for important workflows.

Recommended observability dimensions:

    Request lifecycle
    Report ID
    Citizen ID where appropriate
    AI processing
    Image processing
    Email delivery
    Database operations
    Response requests
    Organization selection
    External provider failures


Production logging should avoid exposing:

    Passwords
    API keys
    OTP values
    Sensitive authentication material


Correlation identifiers such as Report ID should be preferred for
incident tracing.


======================================================================
22. COMMUNICATION ARCHITECTURE
======================================================================

SWACHHLENS
    |
    v
BREVO HTTP API
    |
    +--> Email OTP
    |
    +--> Waste Report Notification
    |
    +--> Transactional Communication
    |
    v
CITIZEN


The email provider is an integration dependency rather than part of
the core domain model.


======================================================================
23. DEPLOYMENT ARCHITECTURE
======================================================================

                    INTERNET
                       |
          +------------+------------+
          |                         |
          v                         v
    FRONTEND HOST              BACKEND HOST
    React + Vite               Node + Express
          |                         |
          |              +----------+----------+
          |              |          |          |
          |              v          v          v
          |          MongoDB    Gemini     Cloudinary
          |           Atlas        AI         Media
          |                         |
          |                         v
          |                       Brevo
          |
          v
       CITIZEN


Environment-specific configuration should control:

    API base URL
    Database connection
    AI credentials
    Cloudinary configuration
    Brevo configuration
    Administrative secrets


======================================================================
24. DEPLOYMENT ENVIRONMENT SEPARATION
======================================================================

Development:

    Local React development
    Local Node.js backend
    Development environment variables


Production:

    Hosted frontend
    Hosted backend
    Managed MongoDB
    Managed image storage
    Managed AI service
    Transactional email provider


The application should avoid coupling production behavior to local
filesystem assumptions wherever managed storage is required.


======================================================================
25. SCALABILITY ARCHITECTURE
======================================================================

The architecture supports horizontal growth by separating:

    Web presentation
    API processing
    AI processing
    Database
    Media storage
    Email delivery


Potential future scaling model:

                         LOAD BALANCER
                              |
                 +------------+------------+
                 |            |            |
                 v            v            v
              API-1        API-2        API-N
                 |            |            |
                 +------------+------------+
                              |
                     MONGODB ATLAS
                              |
              +---------------+---------------+
              |                               |
              v                               v
         CLOUDINARY                       AI SERVICE


Future asynchronous processing can move AI analysis and notification
work into background workers or queues if traffic increases.


======================================================================
26. RELIABILITY ARCHITECTURE
======================================================================

Critical dependency categories:

    Database
    AI
    Image Storage
    Email
    Geographic Services


Reliability strategy:

    Validate before processing
    Fail safely
    Preserve report identifiers
    Avoid storing failed OTPs
    Return meaningful HTTP errors
    Log provider failures
    Keep external integrations modular
    Avoid exposing secrets
    Preserve evidence independently from application records


======================================================================
27. DATA CONSISTENCY MODEL
======================================================================

A waste incident contains multiple logical components:

    Citizen
    Evidence
    AI analysis
    Location
    Report
    Response request


The report identifier provides the primary business-level reference for
connecting incident lifecycle operations.

Example conceptual relationship:

    Citizen
       |
       +---- WasteReport
                  |
                  +---- Evidence
                  |
                  +---- AI Analysis
                  |
                  +---- Location
                  |
                  +---- ResponseRequest
                              |
                              +---- Organization


======================================================================
28. HUMAN-IN-THE-LOOP GOVERNANCE
======================================================================

SWACHHLENS deliberately separates:

    AI recommendation

from:

    Human operational decision


AI may assist with:

    Classification
    Severity
    Risk
    Priority
    Organization suggestions


The human response coordinator remains responsible for:

    Reviewing the incident
    Evaluating suggestions
    Selecting exactly one organization
    Providing final request information
    Submitting the response request


This architecture reduces the risk of treating AI output as an
unreviewed operational command.


======================================================================
29. PRIVACY & DATA PROTECTION
======================================================================

The system handles citizen and incident information.

Data protection principles:

    Collect only required information
    Protect credentials
    Protect OTP values
    Avoid unnecessary exposure in logs
    Restrict administrative operations
    Use managed external services securely
    Keep provider secrets outside source code
    Control access to incident information


The production deployment should additionally enforce HTTPS and secure
cookie/session configuration appropriate to the deployed environment.


======================================================================
30. API DESIGN PRINCIPLES
======================================================================

The API is organized around domain responsibilities.

Domain groups:

    Authentication
    Citizens
    Locations
    Organizations
    OTP
    Waste Reports
    Response


Advantages:

    Easier maintenance
    Clear ownership
    Easier testing
    Better debugging
    Reduced coupling
    Future service extraction


Potential future evolution:

    /api/v2/...


without requiring immediate redesign of the current application.


======================================================================
31. RESPONSE ORGANIZATION DECISION MODEL
======================================================================

                         INCIDENT
                            |
                            v
                    REPORT INFORMATION
                            |
                            v
                 AI / LOCATION SIGNALS
                            |
                            v
                ORGANIZATION SUGGESTIONS
                            |
                            v
                  HUMAN EVALUATION
                            |
                            v
                 EXACTLY ONE SELECTION
                            |
                            v
                   FINAL REQUEST
                            |
                            v
                RESPONSE ORGANIZATION


Important principle:

    Suggestion != Selection

AI/location logic may recommend candidates, but the final organization
selection is explicitly performed through the response workflow.


======================================================================
32. ARCHITECTURAL BOUNDARIES
======================================================================

CORE APPLICATION

    React UI
    Express API
    Domain routes
    Business workflow
    Data models
    Response workflow


EXTERNAL DEPENDENCIES

    Google Gemini
    MongoDB Atlas
    Cloudinary
    Brevo
    Geographic / map services


This boundary makes external services replaceable without rewriting the
entire application.


======================================================================
33. FAILURE SCENARIOS
======================================================================

Scenario A — AI unavailable

    Image received
        |
        v
    AI request fails
        |
        v
    Report processing error
        |
        v
    Incident remains traceable through logs / request context


Scenario B — Email delivery fails

    OTP generated
        |
        v
    Brevo failure
        |
        v
    OTP is not retained as a successful delivery


Scenario C — Database unavailable

    API request
        |
        v
    Database failure
        |
        v
    Controlled server error
        |
        v
    Operational logging


Scenario D — Invalid image

    Upload
       |
       v
    Validation
       |
       v
    Reject request


Scenario E — Unauthorized administrator request

    Request
       |
       v
    Admin authentication
       |
       v
    Reject if unauthorized


======================================================================
34. PERFORMANCE CONSIDERATIONS
======================================================================

Performance-sensitive operations include:

    Image upload
    AI inference
    Database queries
    Location queries
    Organization suggestions
    Email delivery


Recommended production optimizations:

    Database indexes
    Lean MongoDB queries where appropriate
    Pagination for large datasets
    Image size controls
    CDN-backed media
    Caching for stable geographic data
    Background jobs for expensive asynchronous tasks
    Connection pooling
    Rate limiting
    Request timeouts


======================================================================
35. FUTURE EVOLUTION
======================================================================

The architecture can evolve toward:

    Background AI workers
    Message queues
    Advanced geospatial search
    Organization SLA tracking
    Response status updates
    Push notifications
    Mobile applications
    Analytics dashboards
    Predictive waste hotspot detection
    Historical incident intelligence
    AI-assisted response prioritization
    Organization performance analytics
    Municipal integrations
    Open civic-data integrations


Future architecture:

                 CITIZEN
                    |
                    v
              SWACHHLENS
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
       AI        GEO DATA    RESPONSE
        |           |           |
        +-----------+-----------+
                    |
                    v
              INTELLIGENCE
                    |
                    v
             CIVIC RESPONSE


======================================================================
36. ARCHITECTURE DECISION RECORD
======================================================================

Decision 01

Use React + Vite for the web interface.

Reason:

    Fast development
    Component architecture
    Modern frontend ecosystem


Decision 02

Use Node.js + Express for backend APIs.

Reason:

    Lightweight REST architecture
    JavaScript ecosystem consistency
    Straightforward integration with external services


Decision 03

Use MongoDB Atlas for persistent application data.

Reason:

    Flexible document model
    Managed infrastructure
    Suitable for evolving incident structures


Decision 04

Use Cloudinary for image storage.

Reason:

    Separates media storage from application database
    Supports managed media delivery


Decision 05

Use Google Gemini for AI waste analysis.

Reason:

    Multimodal evidence analysis
    Structured intelligence generation


Decision 06

Use Brevo HTTP API for transactional email.

Reason:

    Provider-managed email delivery
    API-based integration
    Suitable for OTP and notification workflows


Decision 07

Require exactly one organization selection.

Reason:

    Creates an explicit operational responsibility boundary
    Prevents ambiguous final response routing


======================================================================
37. SECURITY HARDENING ROADMAP
======================================================================

Recommended production hardening:

    HTTPS everywhere
    Strict CORS allowlist
    Rate limiting
    Request validation schemas
    Security headers
    Secure cookies
    Password hashing
    Secret rotation
    Audit logging
    Provider timeout policies
    Abuse protection
    Upload validation
    File size restrictions
    MIME type validation
    Database indexes
    Backup policies


======================================================================
38. TESTING STRATEGY
======================================================================

Testing layers:

    Unit Tests
        |
        v
    Route Tests
        |
        v
    Integration Tests
        |
        v
    AI Integration Tests
        |
        v
    Database Tests
        |
        v
    End-to-End Tests
        |
        v
    Production Smoke Tests


Critical test journeys:

    OTP send
    OTP verification
    Citizen creation
    Location selection
    Image analysis
    Waste report creation
    Report retrieval
    Organization suggestions
    Organization selection
    Final response request
    Admin authentication


======================================================================
39. OPERATIONAL TRACEABILITY
======================================================================

The following business identifiers are especially important:

    Citizen ID
    Report ID
    Response Request ID
    Organization ID
    Email address where operationally required


Recommended trace:

    Citizen
       |
       v
    Citizen ID
       |
       v
    Report ID
       |
       v
    AI Analysis
       |
       v
    Organization
       |
       v
    Response Request


The Report ID acts as the primary human-readable incident reference.


======================================================================
40. COMPLETE SYSTEM DATA FLOW
======================================================================

Citizen Data
     |
     v
React Portal
     |
     v
Express API
     |
     +----------------------+
     |                      |
     v                      v
MongoDB               Email / OTP
     |                      |
     |                     Brevo
     |
     +----------------------+
     |
     v
Waste Evidence
     |
     v
Cloudinary
     |
     v
Google Gemini
     |
     v
AI Analysis
     |
     v
WasteReport
     |
     v
Report Analysis
     |
     v
Response Center
     |
     v
Organization Suggestions
     |
     v
Exactly One Organization
     |
     v
Final Request
     |
     v
Response Workflow


======================================================================
41. COMPLETE SYSTEM RESPONSIBILITY MATRIX
======================================================================

COMPONENT              PRIMARY RESPONSIBILITY

React + Vite           User interaction and presentation

Express                API routing and application orchestration

MongoDB Atlas           Persistent application data

Cloudinary              Waste evidence image storage

Google Gemini           AI evidence analysis

Brevo                   Transactional email

Location System         Geographic hierarchy and location support

Response Center        Human-controlled response coordination

Response Organization  Operational response


======================================================================
42. WORLD-CLASS ARCHITECTURE SUMMARY
======================================================================

SWACHHLENS is architecturally centered around one principle:

    TURN EVIDENCE INTO ACTIONABLE CIVIC RESPONSE.

The platform does this through a controlled chain:

    VERIFIED CITIZEN
          |
          v
    STRUCTURED INCIDENT
          |
          v
    VERIFIED LOCATION
          |
          v
    PHOTOGRAPHIC EVIDENCE
          |
          v
    AI ANALYSIS
          |
          v
    STRUCTURED WASTE INTELLIGENCE
          |
          v
    PERSISTENT INCIDENT RECORD
          |
          v
    RESPONSE CENTER
          |
          v
    AI / LOCATION ASSISTED SUGGESTIONS
          |
          v
    HUMAN ORGANIZATION SELECTION
          |
          v
    FINAL REQUEST
          |
          v
    RESPONSE WORKFLOW


The architecture combines:

    Human participation
    Artificial intelligence
    Geographic intelligence
    Evidence management
    Structured data
    Transactional communication
    Operational response coordination


This creates a complete incident-to-response architecture rather than
a simple waste-reporting form.


======================================================================
43. FINAL ARCHITECTURE STATEMENT
======================================================================

SWACHHLENS is designed as a modular, evidence-driven and
human-in-the-loop civic technology platform.

Its architecture separates citizen interaction, application services,
AI intelligence, geographic processing, persistent storage, evidence
management, transactional communication and operational response.

The system is therefore capable of evolving from a production-oriented
prototype into a scalable civic-response platform while preserving its
core architectural boundaries.

The defining lifecycle is:

    REPORT
      |
      v
    VERIFY
      |
      v
    ANALYZE
      |
      v
    UNDERSTAND
      |
      v
    RECOMMEND
      |
      v
    SELECT
      |
      v
    REQUEST
      |
      v
    RESPOND


END OF SYSTEM ARCHITECTURE
======================================================================