# SWACHHLENS — SYSTEM ARCHITECTURE



AI WASTE-RESPONSE INTELLIGENCE SYSTEM



Version: 1.0

Architecture Document

Status: Production-Oriented Prototype Architecture





======================================================================

1. EXECUTIVE ARCHITECTURE SUMMARY

======================================================================



SWACHHLENS is an AI-assisted waste reporting and response intelligence

platform that transforms citizen-reported waste incidents into

structured, location-aware and actionable response workflows.



The platform combines:



&#x20;   Citizen Reporting

&#x20;           +

&#x20;   Identity Verification

&#x20;           +

&#x20;   Incident Context

&#x20;           +

&#x20;   Geographic Intelligence

&#x20;           +

&#x20;   Photographic Evidence

&#x20;           +

&#x20;   AI Waste Analysis

&#x20;           +

&#x20;   Persistent Data Management

&#x20;           +

&#x20;   Transactional Communication

&#x20;           +

&#x20;   Organization Intelligence

&#x20;           +

&#x20;   Human-Guided Response Coordination



The architecture is intentionally designed as a layered system so that

the presentation, application logic, AI intelligence, data storage,

communication, geographic services and response workflow can evolve

independently.



The central architectural principle is:



&#x20;   AI ASSISTS DECISIONS

&#x20;   HUMAN WORKFLOW CONTROLS ACTION

&#x20;   DATABASE PRESERVES SYSTEM STATE





======================================================================

2. ARCHITECTURAL OBJECTIVES

======================================================================



The SWACHHLENS architecture is designed to achieve the following goals:



1. Provide a simple citizen-first waste reporting experience.



2. Verify citizen email ownership before progressing through the

&#x20;  reporting workflow.



3. Capture structured incident information instead of relying only on

&#x20;  free-form descriptions.



4. Preserve photographic evidence as a durable cloud resource.



5. Apply AI-assisted analysis to submitted waste evidence.



6. Produce structured intelligence including waste type, category,

&#x20;  severity, confidence, risk and priority.



7. Associate every incident with structured geographic information.



8. Persist citizens, reports, locations, organizations and response

&#x20;  requests in a central database.



9. Provide a dedicated Report Analysis and Status experience.



10. Provide a Response Center for operational decision-making.



11. Use AI and location information to suggest suitable response

&#x20;   organizations.



12. Require an explicit selection of exactly one organization before

&#x20;   the final response request.



13. Support feedback and optional appointment requests.



14. Maintain a traceable lifecycle from initial report to response.



15. Keep sensitive credentials outside source-controlled application

&#x20;   code.



16. Support future municipal-scale analytics and predictive

&#x20;   intelligence.





======================================================================

3. SYSTEM CONTEXT

======================================================================



&#x20;                        +----------------------+

&#x20;                        |       CITIZEN        |

&#x20;                        |                      |

&#x20;                        | Report Waste         |

&#x20;                        | Upload Evidence      |

&#x20;                        | Verify Email         |

&#x20;                        +----------+-----------+

&#x20;                                   |

&#x20;                                   v

&#x20;                   +-------------------------------+

&#x20;                   |       SWACHHLENS PORTAL       |

&#x20;                   |                               |

&#x20;                   | React + Vite                  |

&#x20;                   | Citizen Reporting             |

&#x20;                   | Report Status                 |

&#x20;                   | Response Center               |

&#x20;                   +---------------+---------------+

&#x20;                                   |

&#x20;                                   v

&#x20;                   +-------------------------------+

&#x20;                   |      APPLICATION API          |

&#x20;                   |                               |

&#x20;                   | Node.js + Express             |

&#x20;                   | REST API                      |

&#x20;                   +---------------+---------------+

&#x20;                                   |

&#x20;            +----------------------+----------------------+

&#x20;            |                      |                      |

&#x20;            v                      v                      v

&#x20;     +-------------+       +-------------+       +---------------+

&#x20;     | Google      |       | MongoDB     |       | Cloudinary    |

&#x20;     | Gemini      |       | Atlas       |       |               |

&#x20;     |             |       |             |       | Waste Images  |

&#x20;     | AI Analysis |       | Application |       | Evidence      |

&#x20;     +-------------+       | Data        |       +---------------+

&#x20;                           +-------------+

&#x20;                                   |

&#x20;                                   |

&#x20;                                   v

&#x20;                        +----------------------+

&#x20;                        |    RESPONSE CENTER   |

&#x20;                        |                      |

&#x20;                        | Report Lookup        |

&#x20;                        | AI Suggestions       |

&#x20;                        | Location Intelligence|

&#x20;                        | Organization Select  |

&#x20;                        +----------+-----------+

&#x20;                                   |

&#x20;                                   v

&#x20;                        +----------------------+

&#x20;                        | RESPONSE ORGANIZATION|

&#x20;                        |                      |

&#x20;                        | Incident Processing  |

&#x20;                        | Response Workflow    |

&#x20;                        +----------------------+



&#x20;                        +----------------------+

&#x20;                        |       BREVO          |

&#x20;                        |                      |

&#x20;                        | OTP + Notifications  |

&#x20;                        +----------------------+





======================================================================

4. ARCHITECTURE LAYERS

======================================================================



SWACHHLENS is organized into the following logical layers.





4.1 PRESENTATION LAYER

----------------------



Technology:



&#x20;   React

&#x20;   Vite

&#x20;   React Router

&#x20;   Axios

&#x20;   Leaflet

&#x20;   React-Leaflet



Responsibilities:



&#x20;   - Citizen-facing reporting interface

&#x20;   - Identity and verification screens

&#x20;   - Incident collection

&#x20;   - Situation collection

&#x20;   - Location selection

&#x20;   - Image upload

&#x20;   - Report analysis display

&#x20;   - Report status display

&#x20;   - Response Center

&#x20;   - Organization selection

&#x20;   - Final response request





4.2 APPLICATION / API LAYER

---------------------------



Technology:



&#x20;   Node.js

&#x20;   Express



Responsibilities:



&#x20;   - REST API routing

&#x20;   - Request validation

&#x20;   - Workflow orchestration

&#x20;   - Authentication-related operations

&#x20;   - Citizen operations

&#x20;   - OTP operations

&#x20;   - Waste report operations

&#x20;   - Location operations

&#x20;   - Organization operations

&#x20;   - Response workflow operations

&#x20;   - Integration with external services





4.3 INTELLIGENCE LAYER

----------------------



Technology:



&#x20;   Google Gemini

&#x20;   @google/genai



Responsibilities:



&#x20;   - Waste detection

&#x20;   - Waste classification

&#x20;   - Category identification

&#x20;   - Severity assessment

&#x20;   - Confidence estimation

&#x20;   - Risk assessment

&#x20;   - Priority determination



The intelligence layer is a decision-support component.



It does not replace persistent application state or human operational

decision-making.





4.4 DATA LAYER

--------------



Technology:



&#x20;   MongoDB Atlas

&#x20;   Mongoose



Responsibilities:



&#x20;   - Citizen records

&#x20;   - Waste reports

&#x20;   - Location records

&#x20;   - Organization records

&#x20;   - Response requests

&#x20;   - AI analysis data

&#x20;   - Workflow state





4.5 MEDIA LAYER

---------------



Technology:



&#x20;   Cloudinary



Responsibilities:



&#x20;   - Waste image storage

&#x20;   - Durable cloud media management

&#x20;   - Secure image URLs

&#x20;   - Evidence availability for downstream processing





4.6 COMMUNICATION LAYER

-----------------------



Technology:



&#x20;   Brevo HTTP API



Responsibilities:



&#x20;   - Email OTP delivery

&#x20;   - Waste report notification

&#x20;   - Transactional citizen communication

&#x20;   - Embedded / attached evidence support where configured





4.7 GEOGRAPHIC INTELLIGENCE LAYER

---------------------------------



Technology:



&#x20;   India location hierarchy

&#x20;   Leaflet

&#x20;   React-Leaflet



Hierarchy:



&#x20;   Country

&#x20;      |

&#x20;      v

&#x20;   State

&#x20;      |

&#x20;      v

&#x20;   District

&#x20;      |

&#x20;      v

&#x20;   Block

&#x20;      |

&#x20;      v

&#x20;   Village

&#x20;      |

&#x20;      +--> Latitude

&#x20;      +--> Longitude





======================================================================

5. COMPLETE INCIDENT LIFECYCLE

======================================================================



The complete SWACHHLENS lifecycle is:



&#x20;   CITIZEN

&#x20;      |

&#x20;      v

&#x20;   SWACHHLENS WEB PORTAL

&#x20;      |

&#x20;      v

&#x20;   CITIZEN DETAILS

&#x20;      |

&#x20;      v

&#x20;   EMAIL OTP VERIFICATION

&#x20;      |

&#x20;      v

&#x20;   INCIDENT DETAILS

&#x20;      |

&#x20;      v

&#x20;   CITIZEN SITUATION

&#x20;      |

&#x20;      v

&#x20;   LOCATION SELECTION

&#x20;      |

&#x20;      v

&#x20;   WASTE IMAGE EVIDENCE

&#x20;      |

&#x20;      v

&#x20;   BACKEND API

&#x20;      |

&#x20;      +--------------------------+

&#x20;      |                          |

&#x20;      v                          v

&#x20;   LOCATION SYSTEM           CLOUDINARY

&#x20;      |                     IMAGE STORAGE

&#x20;      |                          |

&#x20;      +------------+-------------+

&#x20;                   |

&#x20;                   v

&#x20;              GEMINI AI

&#x20;                   |

&#x20;                   +--> Waste Detection

&#x20;                   +--> Waste Type

&#x20;                   +--> Category

&#x20;                   +--> Severity

&#x20;                   +--> Confidence

&#x20;                   +--> Risk Score

&#x20;                   +--> Priority

&#x20;                   |

&#x20;                   v

&#x20;            REPORT ENGINE

&#x20;                   |

&#x20;                   v

&#x20;             MONGODB ATLAS

&#x20;                   |

&#x20;                   v

&#x20;        REPORT ANALYSIS \& STATUS

&#x20;                   |

&#x20;                   v

&#x20;            RESPONSE CENTER

&#x20;                   |

&#x20;                   v

&#x20;         REPORT ID LOOKUP

&#x20;                   |

&#x20;                   v

&#x20;      AI / LOCATION SUGGESTIONS

&#x20;                   |

&#x20;                   v

&#x20;       SELECT EXACTLY ONE

&#x20;          ORGANIZATION

&#x20;                   |

&#x20;                   v

&#x20;            FINAL REQUEST

&#x20;                   |

&#x20;            +------+------+

&#x20;            |             |

&#x20;            v             v

&#x20;      REASON / FEEDBACK   OPTIONAL

&#x20;                        APPOINTMENT

&#x20;            |             |

&#x20;            +------+------+

&#x20;                   |

&#x20;                   v

&#x20;             FINAL SUBMIT

&#x20;                   |

&#x20;                   v

&#x20;          RESPONSE WORKFLOW

&#x20;                   |

&#x20;                   v

&#x20;       RESPONSE ORGANIZATION





======================================================================

6. FRONTEND ARCHITECTURE

======================================================================



The frontend is a React-based single-page application.



Logical structure:



&#x20;   React Application

&#x20;          |

&#x20;          +--> Citizen Workflow

&#x20;          |

&#x20;          +--> Reporting Workflow

&#x20;          |

&#x20;          +--> Analysis \& Status

&#x20;          |

&#x20;          +--> Response Center

&#x20;          |

&#x20;          +--> Administrative Workflow

&#x20;          |

&#x20;          +--> Geographic Visualization

&#x20;          |

&#x20;          +--> API Service Layer

&#x20;                      |

&#x20;                      v

&#x20;                 Axios Client

&#x20;                      |

&#x20;                      v

&#x20;                 REST Backend





The frontend should remain responsible primarily for:



&#x20;   - Presentation

&#x20;   - User interaction

&#x20;   - Client-side workflow state

&#x20;   - Navigation

&#x20;   - Input collection

&#x20;   - Display of server-generated intelligence



Business-critical persistence and authoritative workflow state remain

server-side.





======================================================================

7. BACKEND ARCHITECTURE

======================================================================



The backend is the central orchestration layer.



&#x20;                        EXPRESS SERVER

&#x20;                              |

&#x20;         +--------------------+--------------------+

&#x20;         |                    |                    |

&#x20;         v                    v                    v

&#x20;      ROUTES              SERVICES              MODELS

&#x20;         |                    |                    |

&#x20;         |                    v                    |

&#x20;         |               GEMINI AI                |

&#x20;         |                                         |

&#x20;         +-------------------+---------------------+

&#x20;                             |

&#x20;                             v

&#x20;                   EXTERNAL INTEGRATIONS

&#x20;                             |

&#x20;             +---------------+---------------+

&#x20;             |               |               |

&#x20;             v               v               v

&#x20;         Cloudinary        Brevo         MongoDB Atlas





Primary route domains include:



&#x20;   Citizen

&#x20;   OTP

&#x20;   Location

&#x20;   Waste Reports

&#x20;   Organizations

&#x20;   Response

&#x20;   Administrative Operations





======================================================================

8. API DOMAIN MODEL

======================================================================



8.1 CITIZEN DOMAIN



Responsible for:



&#x20;   - Citizen creation

&#x20;   - Citizen identification

&#x20;   - Citizen retrieval

&#x20;   - Verification state

&#x20;   - Citizen location





8.2 OTP DOMAIN



Responsible for:



&#x20;   - OTP generation

&#x20;   - OTP delivery

&#x20;   - OTP expiration

&#x20;   - OTP verification

&#x20;   - Verification state





8.3 LOCATION DOMAIN



Responsible for:



&#x20;   - States

&#x20;   - Districts

&#x20;   - Blocks

&#x20;   - Villages

&#x20;   - Geographic coordinates





8.4 WASTE REPORT DOMAIN



Responsible for:



&#x20;   - Evidence upload

&#x20;   - AI analysis

&#x20;   - Waste report creation

&#x20;   - Report retrieval

&#x20;   - Report status

&#x20;   - Report intelligence





8.5 ORGANIZATION DOMAIN



Responsible for:



&#x20;   - Organization records

&#x20;   - Organization metadata

&#x20;   - Organization retrieval

&#x20;   - Response capability information





8.6 RESPONSE DOMAIN



Responsible for:



&#x20;   - Report lookup

&#x20;   - Organization suggestions

&#x20;   - Organization selection

&#x20;   - Final request

&#x20;   - Feedback

&#x20;   - Appointment request

&#x20;   - Response workflow





======================================================================

9. AI INTELLIGENCE PIPELINE

======================================================================



The AI pipeline converts photographic evidence into structured

decision-support information.



&#x20;   WASTE IMAGE

&#x20;        |

&#x20;        v

&#x20;   IMAGE VALIDATION

&#x20;        |

&#x20;        v

&#x20;   GEMINI MODEL

&#x20;        |

&#x20;        v

&#x20;   AI RESPONSE

&#x20;        |

&#x20;        v

&#x20;   STRUCTURED ANALYSIS

&#x20;        |

&#x20;        +--> Is Waste

&#x20;        |

&#x20;        +--> Confidence

&#x20;        |

&#x20;        +--> Waste Type

&#x20;        |

&#x20;        +--> Category

&#x20;        |

&#x20;        +--> Visible Severity

&#x20;        |

&#x20;        +--> Risk Score

&#x20;        |

&#x20;        +--> Priority

&#x20;        |

&#x20;        v

&#x20;   VALIDATION / NORMALIZATION

&#x20;        |

&#x20;        v

&#x20;   WASTE REPORT

&#x20;        |

&#x20;        v

&#x20;   RESPONSE INTELLIGENCE





AI is therefore used as an intelligence accelerator rather than as the

sole authority for operational action.





======================================================================

10. AI SAFETY AND VALIDATION PRINCIPLE

======================================================================



The system should treat AI output as untrusted external intelligence

until validated.



Conceptually:



&#x20;   AI OUTPUT

&#x20;      |

&#x20;      v

&#x20;   VALIDATION

&#x20;      |

&#x20;      +--> Schema validation

&#x20;      |

&#x20;      +--> Confidence checks

&#x20;      |

&#x20;      +--> Business-rule checks

&#x20;      |

&#x20;      v

&#x20;   NORMALIZED AI DATA

&#x20;      |

&#x20;      v

&#x20;   APPLICATION WORKFLOW





This prevents malformed or unexpected AI responses from directly

controlling critical application state.





======================================================================

11. GEOGRAPHIC INTELLIGENCE

======================================================================



Location is a first-class system capability.



The geographic model provides:



&#x20;   State

&#x20;     |

&#x20;     District

&#x20;     |

&#x20;     Block

&#x20;     |

&#x20;     Village

&#x20;     |

&#x20;     Coordinates





Location intelligence supports:



&#x20;   - Accurate incident localization

&#x20;   - Geographic visualization

&#x20;   - Location-aware report information

&#x20;   - Organization recommendation

&#x20;   - Future proximity calculations

&#x20;   - Regional waste analytics

&#x20;   - Geographic hotspot detection





Future evolution:



&#x20;   Incident Locations

&#x20;         |

&#x20;         v

&#x20;   Spatial Analysis

&#x20;         |

&#x20;         v

&#x20;   Waste Hotspots

&#x20;         |

&#x20;         v

&#x20;   Predictive Risk Areas

&#x20;         |

&#x20;         v

&#x20;   Response Prioritization





======================================================================

12. DATA ARCHITECTURE

======================================================================



Core domain entities:



&#x20;   +----------------+

&#x20;   |    Citizen     |

&#x20;   +-------+--------+

&#x20;           |

&#x20;           | submits

&#x20;           v

&#x20;   +----------------+

&#x20;   |  WasteReport   |

&#x20;   +-------+--------+

&#x20;           |

&#x20;      +----+----+

&#x20;      |         |

&#x20;      v         v

&#x20;   Location   AI Analysis

&#x20;      |

&#x20;      v

&#x20;   Organization

&#x20;      |

&#x20;      v

&#x20;   ResponseRequest





Conceptual relationships:



&#x20;   Citizen

&#x20;      |

&#x20;      +----> WasteReport

&#x20;                  |

&#x20;                  +----> Location

&#x20;                  |

&#x20;                  +----> AI Analysis

&#x20;                  |

&#x20;                  +----> ResponseRequest

&#x20;                             |

&#x20;                             +----> Organization





MongoDB Atlas acts as the authoritative persistent data layer.





======================================================================

13. EVIDENCE / MEDIA ARCHITECTURE

======================================================================



Citizen photographic evidence follows a dedicated media pipeline.



&#x20;   CITIZEN IMAGE

&#x20;        |

&#x20;        v

&#x20;   MULTIPART REQUEST

&#x20;        |

&#x20;        v

&#x20;   MULTER / API

&#x20;        |

&#x20;        v

&#x20;   CLOUDINARY

&#x20;        |

&#x20;        +--> Secure Image URL

&#x20;        |

&#x20;        v

&#x20;   WASTE REPORT

&#x20;        |

&#x20;        +--> AI ANALYSIS

&#x20;        |

&#x20;        +--> REPORT NOTIFICATION





The architecture avoids treating local application storage as the

primary production media store.





======================================================================

14. EMAIL COMMUNICATION ARCHITECTURE

======================================================================



Email communication is handled through the Brevo HTTP API.



&#x20;   SWACHHLENS BACKEND

&#x20;            |

&#x20;      +-----+------+

&#x20;      |            |

&#x20;      v            v

&#x20;   OTP EMAIL   REPORT EMAIL

&#x20;      |            |

&#x20;      +-----+------+

&#x20;            |

&#x20;            v

&#x20;         BREVO

&#x20;            |

&#x20;            v

&#x20;      CITIZEN EMAIL





OTP principle:



&#x20;   Generate OTP

&#x20;       |

&#x20;       v

&#x20;   Send through provider

&#x20;       |

&#x20;       v

&#x20;   Confirm provider acceptance

&#x20;       |

&#x20;       v

&#x20;   Store OTP state





This prevents the system from treating an unsuccessful email operation

as a successful verification workflow.





======================================================================

15. RESPONSE INTELLIGENCE ARCHITECTURE

======================================================================



SWACHHLENS deliberately separates recommendation from final action.



&#x20;   WASTE REPORT

&#x20;        |

&#x20;        v

&#x20;   RESPONSE CENTER

&#x20;        |

&#x20;        +--> Incident Context

&#x20;        |

&#x20;        +--> Geographic Context

&#x20;        |

&#x20;        +--> AI Intelligence

&#x20;        |

&#x20;        v

&#x20;   ORGANIZATION SUGGESTIONS

&#x20;        |

&#x20;        v

&#x20;   HUMAN REVIEW

&#x20;        |

&#x20;        v

&#x20;   EXACTLY ONE ORGANIZATION

&#x20;        |

&#x20;        v

&#x20;   FINAL REQUEST

&#x20;        |

&#x20;        +--> Reason / Feedback

&#x20;        |

&#x20;        +--> Optional Appointment

&#x20;        |

&#x20;        v

&#x20;   FINAL SUBMIT

&#x20;        |

&#x20;        v

&#x20;   RESPONSE WORKFLOW

&#x20;        |

&#x20;        v

&#x20;   RESPONSE ORGANIZATION





This creates a Human-in-the-Loop architecture.



AI recommends.



The responsible operator decides.



The selected organization executes the operational response.





======================================================================

16. SECURITY ARCHITECTURE

======================================================================



Security boundaries are divided into:



&#x20;   CLIENT

&#x20;      |

&#x20;      v

&#x20;   API

&#x20;      |

&#x20;      v

&#x20;   SERVER-SIDE SERVICES

&#x20;      |

&#x20;      v

&#x20;   DATABASE / EXTERNAL PROVIDERS





Sensitive values must remain server-side.



Examples:



&#x20;   - MongoDB credentials

&#x20;   - Gemini API key

&#x20;   - Brevo API key

&#x20;   - Cloudinary credentials

&#x20;   - Administrative secrets

&#x20;   - Email credentials





Environment-specific configuration belongs in environment variables.



The .env file must not be committed to the public source repository.





======================================================================

17. TRUST BOUNDARIES

======================================================================



The system contains several important trust boundaries.



Boundary 1:



&#x20;   Citizen Browser

&#x20;         |

&#x20;         v

&#x20;   Backend API



All client-provided values must be treated as untrusted input.





Boundary 2:



&#x20;   Backend

&#x20;      |

&#x20;      v

&#x20;   AI Provider



AI output must be validated before being used by application logic.





Boundary 3:



&#x20;   Backend

&#x20;      |

&#x20;      v

&#x20;   External Providers



External provider responses must be handled as potentially failing

dependencies.





Boundary 4:



&#x20;   Application

&#x20;      |

&#x20;      v

&#x20;   Database



Database writes represent authoritative application state and should

be performed only after required validation.





======================================================================

18. RELIABILITY ARCHITECTURE

======================================================================



The platform should isolate failures between external dependencies.



AI failure:



&#x20;   AI unavailable

&#x20;       |

&#x20;       v

&#x20;   Controlled analysis failure

&#x20;       |

&#x20;       v

&#x20;   No invalid AI-dependent state





Email failure:



&#x20;   Email provider failure

&#x20;       |

&#x20;       v

&#x20;   OTP not considered successfully issued





Image failure:



&#x20;   Cloud image storage failure

&#x20;       |

&#x20;       v

&#x20;   Evidence persistence failure

&#x20;       |

&#x20;       v

&#x20;   Report workflow prevented from silently proceeding





Database failure:



&#x20;   Database unavailable

&#x20;       |

&#x20;       v

&#x20;   Controlled API error





The core principle is:



&#x20;   FAIL EXPLICITLY

&#x20;   DO NOT CREATE FALSE SUCCESS





======================================================================

19. OBSERVABILITY

======================================================================



Important operational events include:



&#x20;   - Server startup

&#x20;   - Database connection

&#x20;   - AI model initialization

&#x20;   - API requests

&#x20;   - Image processing

&#x20;   - AI analysis

&#x20;   - Email delivery

&#x20;   - Report creation

&#x20;   - Response workflow

&#x20;   - External service failures





Production evolution should include:



&#x20;   - Structured logging

&#x20;   - Request correlation IDs

&#x20;   - Centralized log aggregation

&#x20;   - Health checks

&#x20;   - Metrics

&#x20;   - Alerting

&#x20;   - External dependency monitoring





======================================================================

20. DEPLOYMENT ARCHITECTURE

======================================================================



&#x20;                        INTERNET

&#x20;                           |

&#x20;            +--------------+--------------+

&#x20;            |                             |

&#x20;            v                             v

&#x20;     +-------------+              +---------------+

&#x20;     | React/Vite  |              | Node/Express  |

&#x20;     | Frontend    |------------->| Backend API   |

&#x20;     +-------------+              +-------+-------+

&#x20;                                          |

&#x20;                    +---------------------+---------------------+

&#x20;                    |                     |                     |

&#x20;                    v                     v                     v

&#x20;              MongoDB Atlas          Cloudinary              Brevo

&#x20;              Application Data       Image Storage           Email

&#x20;                                          |

&#x20;                                          |

&#x20;                                          v

&#x20;                                    Google Gemini

&#x20;                                    AI Intelligence





The frontend and backend are independently deployable components.



Managed external services provide specialized capabilities for:



&#x20;   Database

&#x20;   Media

&#x20;   Email

&#x20;   AI





======================================================================

21. SCALABILITY STRATEGY

======================================================================



The architecture supports future horizontal growth.



Potential scaling mechanisms:



&#x20;   - Stateless API instances

&#x20;   - Horizontal backend scaling

&#x20;   - Database indexing

&#x20;   - Query optimization

&#x20;   - Geographic caching

&#x20;   - Background job processing

&#x20;   - AI request queues

&#x20;   - Image processing workers

&#x20;   - Centralized observability

&#x20;   - Rate limiting

&#x20;   - API gateway

&#x20;   - Distributed caching





Future scalable architecture:



&#x20;   USERS

&#x20;     |

&#x20;     v

&#x20;   LOAD BALANCER

&#x20;     |

&#x20;     +--------+--------+

&#x20;     |        |        |

&#x20;     v        v        v

&#x20;   API-1    API-2    API-N

&#x20;     |        |        |

&#x20;     +--------+--------+

&#x20;              |

&#x20;       +------+------+

&#x20;       |             |

&#x20;       v             v

&#x20;    DATABASE      JOB QUEUE

&#x20;                      |

&#x20;             +--------+--------+

&#x20;             |        |        |

&#x20;             v        v        v

&#x20;            AI     EMAIL    IMAGE





======================================================================

22. FUTURE INTELLIGENCE ARCHITECTURE

======================================================================



Historical reports can become the foundation of a higher-level

intelligence layer.



&#x20;   HISTORICAL WASTE REPORTS

&#x20;             |

&#x20;             v

&#x20;      ANALYTICS ENGINE

&#x20;             |

&#x20;             +--> Temporal Patterns

&#x20;             |

&#x20;             +--> Geographic Patterns

&#x20;             |

&#x20;             +--> Waste Categories

&#x20;             |

&#x20;             +--> Severity Trends

&#x20;             |

&#x20;             v

&#x20;      PREDICTIVE INTELLIGENCE

&#x20;             |

&#x20;             +--> Waste Hotspots

&#x20;             |

&#x20;             +--> Risk Forecasting

&#x20;             |

&#x20;             +--> Response Demand

&#x20;             |

&#x20;             +--> Resource Planning

&#x20;             |

&#x20;             v

&#x20;      SMART RESPONSE PRIORITIZATION





This provides a path from:



&#x20;   REPORTING

&#x20;       ->

&#x20;   ANALYSIS

&#x20;       ->

&#x20;   RESPONSE

&#x20;       ->

&#x20;   PREDICTION

&#x20;       ->

&#x20;   PREVENTION





======================================================================

23. DOMAIN-DRIVEN RESPONSIBILITY MAP

======================================================================



+----------------------+-----------------------------------------------+

| COMPONENT            | PRIMARY RESPONSIBILITY                       |

+----------------------+-----------------------------------------------+

| React + Vite         | User interface and workflow presentation     |

| Express API          | Request orchestration and business APIs      |

| Citizen Domain       | Citizen information and verification         |

| OTP Domain           | Email verification workflow                  |

| Location Domain      | Geographic reference information             |

| Waste Report Domain  | Incident and evidence lifecycle              |

| Gemini AI            | AI-assisted waste intelligence               |

| MongoDB Atlas        | Persistent application state                 |

| Cloudinary           | Waste evidence image storage                 |

| Brevo                | Transactional email communication            |

| Organization Domain  | Response organization information            |

| Response Domain      | Response coordination workflow               |

| Leaflet              | Geographic visualization                     |

+----------------------+-----------------------------------------------+





======================================================================

24. ARCHITECTURAL QUALITY ATTRIBUTES

======================================================================



MAINTAINABILITY



Responsibilities are separated by domain and technical layer.





EXTENSIBILITY



New AI models, notification providers, organization data sources and

analytics capabilities can be introduced without replacing the entire

system.





TRACEABILITY



Report IDs provide a persistent reference through the incident and

response lifecycle.





HUMAN OVERSIGHT



AI provides intelligence and recommendations while final organization

selection remains an explicit workflow decision.





LOCATION AWARENESS



Hierarchical geographic data provides a foundation for localized

response intelligence.





CLOUD READINESS



Managed services provide scalable infrastructure for data, media,

communication and AI.





FAULT ISOLATION



External service failures can be isolated rather than silently

producing incorrect application state.





======================================================================

25. ARCHITECTURAL PRINCIPLES

======================================================================



The SWACHHLENS architecture follows these core principles:



1. SINGLE SOURCE OF TRUTH



MongoDB remains the authoritative source for persistent application

and workflow state.





2. AI AS DECISION SUPPORT



AI provides intelligence, not unrestricted control over operational

actions.





3. HUMAN-IN-THE-LOOP RESPONSE



Final organization selection is explicitly performed through the

response workflow.





4. EXTERNAL SERVICES AS DEPENDENCIES



Gemini, Cloudinary and Brevo are treated as replaceable integrations.





5. SECURITY BY CONFIGURATION SEPARATION



Secrets remain outside source-controlled application code.





6. EXPLICIT FAILURE



The system should never represent a failed external operation as a

successful workflow step.





7. LOCATION-FIRST INTELLIGENCE



Geographic context is fundamental to waste-response coordination.





8. MODULAR EVOLUTION



The system is designed so that future analytics and predictive

services can be added without rewriting the core reporting workflow.





======================================================================

26. FINAL ARCHITECTURE

======================================================================



&#x20;                        SWACHHLENS

&#x20;                             |

&#x20;             +---------------+---------------+

&#x20;             |                               |

&#x20;             v                               v

&#x20;       CITIZEN EXPERIENCE              RESPONSE CENTER

&#x20;             |                               |

&#x20;             +---------------+---------------+

&#x20;                             |

&#x20;                             v

&#x20;                    REACT + VITE

&#x20;                             |

&#x20;                             v

&#x20;                    EXPRESS REST API

&#x20;                             |

&#x20;      +----------------------+----------------------+

&#x20;      |            |             |                 |

&#x20;      v            v             v                 v

&#x20;  LOCATION       GEMINI      CLOUDINARY          BREVO

&#x20;  INTELLIGENCE     AI        IMAGE STORAGE        EMAIL

&#x20;      |            |             |                 |

&#x20;      +------------+-------------+-----------------+

&#x20;                             |

&#x20;                             v

&#x20;                        MONGODB ATLAS

&#x20;                             |

&#x20;                             v

&#x20;                      WASTE REPORT

&#x20;                             |

&#x20;                             v

&#x20;                   RESPONSE INTELLIGENCE

&#x20;                             |

&#x20;                             v

&#x20;                 ORGANIZATION SELECTION

&#x20;                             |

&#x20;                             v

&#x20;                      FINAL REQUEST

&#x20;                             |

&#x20;                             v

&#x20;                   RESPONSE ORGANIZATION





======================================================================

27. ARCHITECTURAL VISION

======================================================================



SWACHHLENS is designed to evolve beyond a conventional waste-reporting

application.



The long-term architectural vision is:



&#x20;   CITIZEN REPORT

&#x20;         |

&#x20;         v

&#x20;   VERIFIED EVIDENCE

&#x20;         |

&#x20;         v

&#x20;   AI UNDERSTANDING

&#x20;         |

&#x20;         v

&#x20;   LOCATION INTELLIGENCE

&#x20;         |

&#x20;         v

&#x20;   STRUCTURED INCIDENT

&#x20;         |

&#x20;         v

&#x20;   RESPONSE INTELLIGENCE

&#x20;         |

&#x20;         v

&#x20;   HUMAN DECISION

&#x20;         |

&#x20;         v

&#x20;   ORGANIZED RESPONSE

&#x20;         |

&#x20;         v

&#x20;   HISTORICAL DATA

&#x20;         |

&#x20;         v

&#x20;   PREDICTIVE INTELLIGENCE

&#x20;         |

&#x20;         v

&#x20;   PROACTIVE WASTE MANAGEMENT





The ultimate objective is to transform raw citizen observations into

structured intelligence that can support faster, more informed and

more accountable waste-response operations.



SWACHHLENS therefore represents a complete architecture chain:



&#x20;   OBSERVE

&#x20;      ->

&#x20;   VERIFY

&#x20;      ->

&#x20;   REPORT

&#x20;      ->

&#x20;   UNDERSTAND

&#x20;      ->

&#x20;   LOCALIZE

&#x20;      ->

&#x20;   PRIORITIZE

&#x20;      ->

&#x20;   RECOMMEND

&#x20;      ->

&#x20;   DECIDE

&#x20;      ->

&#x20;   RESPOND

&#x20;      ->

&#x20;   LEARN

&#x20;      ->

&#x20;   PREDICT





======================================================================

END OF SYSTEM ARCHITECTURE

======================================================================

