# SWACHHLENS



## AI Waste-Response Intelligence System



SWACHHLENS is an AI-powered waste reporting and response-support platform designed to help citizens report waste incidents, analyze submitted evidence, track reports, and support response organizations with structured, location-aware information.



---



## 1. Problem Statement



Traditional waste reporting often depends on manual complaint handling and incomplete incident information. This can make it difficult to:



- Understand the type and severity of a reported waste incident

- Prioritize reports consistently

- Connect reports with relevant locations and response organizations

- Track a report from submission to response

- Maintain structured information for future analysis



SWACHHLENS addresses these challenges through an integrated citizen reporting, AI analysis, location intelligence, and response-support workflow.



---



## 2. Proposed Solution



SWACHHLENS combines a citizen-facing reporting portal with a Node.js backend, MongoDB database, AI-powered image analysis, location services, cloud image storage, email verification, and a Response Center.



### Core Concept



**Report → Analyze → Identify → Prioritize → Respond → Track**



The platform transforms a citizen's waste report into structured information that can support faster and more informed response decisions.



---



## 3. Key Features



### Citizen Reporting



- Citizen details and verification

- Email OTP verification

- Guided reporting workflow

- Citizen situation information

- Waste incident details

- Waste image/evidence upload



### Location Intelligence



- State, district, block and village location data

- Location selection and validation

- GPS/location-assisted reporting

- Map-based location support

- Structured Indian location database



### AI Waste Analysis



- AI-based waste image analysis

- Waste classification

- Visible severity assessment

- Confidence-based analysis

- Risk-oriented analysis

- Structured AI results integrated into the report workflow



### Report Management



- Unique Citizen ID

- Unique Waste Report ID

- MongoDB-based report persistence

- Analysis and status view

- Report retrieval and tracking



### Response Center



- Report lookup

- AI/location-supported organization suggestions

- Organization selection

- Exactly one organization selected before final submission

- Final response request

- Feedback/reason for organization selection

- Optional appointment request with the selected organization



### Response Tracking



- Response request records

- Organization-linked response workflow

- Status-oriented reporting structure



---



## 4. Complete User Workflow



```text

                    SWACHHLENS

                        │

                        ▼

                     Home

                        │

                        ▼

                Citizen Details

                        │

                        ▼

                Email OTP Verify

                        │

                        ▼

              Incident / Situation

                        │

                        ▼

              Location & Evidence

                        │

                        ▼

                Waste Image Upload

                        │

                        ▼

                AI Waste Analysis

                        │

                        ▼

                 Report Creation

                        │

                        ▼

             Citizen ID + Report ID

                        │

                        ▼

               Analysis & Status

                        │

                        ▼

                 Response Center

                        │

                        ▼

              Organization Suggestions

                        │

                        ▼

             Select One Organization

                        │

                        ▼

                  Final Request

                        │

             ┌──────────┴──────────┐

             ▼                     ▼

       Feedback/Reason       Appointment Request

             │                     │

             └──────────┬──────────┘

                        ▼

                   Final Submit
```
