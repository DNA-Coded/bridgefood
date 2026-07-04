# FoodBridge AI - High-Level Architecture

This document describes the high-level architecture, systems integrations, AI operational boundaries, and data flow of **FoodBridge AI**.

---

## 1. System Topology

FoodBridge AI is designed as a modern, decoupled monorepo architecture separating client-side presentation, API endpoints, shared configurations, and the AI orchestration framework.

```mermaid
graph TD
    UserClient[React SPA Frontend] -->|HTTPS / JSON| ApiServer[FastAPI Backend]
    ApiServer -->|MongoDB Protocol| DB[(MongoDB Atlas)]
    
    subgraph AI Orchestration Layer
        ApiServer -->|REST API / SDK| Gemma[Gemma 4 AI Engine]
    end

    subgraph External Service Integrations
        ApiServer -->|Maps API| GoogleMaps[Google Maps Platform]
        ApiServer -->|SMTP| EmailService[Email Server]
    end
```

### Components Summary

1. **Frontend (apps/web)**: React + TypeScript + Vite Single Page Application. It manages state locally and renders the donor/recipient workflows.
2. **Backend (apps/api)**: FastAPI serving REST API endpoints. Interacts with the database, manages integration calls, and formats tasks for Gemma 4.
3. **Database (MongoDB Atlas)**: Storing user profiles, verification records, real-time donation states, notifications, and LLM coordinator trace logs.
4. **AI Engine (Gemma 4)**: Executes structured content classification, urgency extraction, and provides tool calling requests (orchestrated by backend).

---

## 2. Data Flow: End-to-End Donation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Donor
    actor Receiver
    participant Web as apps/web (Frontend)
    participant API as apps/api (Backend)
    participant DB as MongoDB Atlas
    participant Gemma as Gemma 4 AI Coordinator
    participant Ext as External APIs (Maps, SMTP)

    Donor->>Web: Upload Food Photo + Vague description
    Web->>API: POST /food/analyze (Image File + raw text)
    API->>Gemma: Send image & text payload
    Gemma-->>API: Structured Analysis (Quantity, Urgency, Categories, Tool triggers)
    
    alt Gemma triggers Nearby NGO Search
        API->>Ext: Query Google Maps Places API for NGOs
        Ext-->>API: Lat/Lng coordinates & distances
    end

    API-->>Web: Structured Food Report + NGO Recommendations
    Web->>Donor: Show recommendations
    Donor->>Web: Confirm Donation Listing & Alert dispatch
    Web->>API: POST /donations (Save to database & Trigger matches)
    API->>DB: Create Listing (State: PENDING)
    API->>Ext: Dispatch notifications to nearby NGOs
    Ext-->>Receiver: Receive alert (Email/Push)
    
    Receiver->>Web: Request pickup
    Web->>API: POST /donations/{id}/request
    API->>DB: Add Request entry (State: REQUESTED)
    
    Donor->>Web: Accept request from specific NGO
    Web->>API: POST /donations/{id}/accept
    API->>DB: Lock donation to NGO (State: ACCEPTED)
    API->>Ext: Notify chosen NGO with secure pickup instructions
    
    Receiver->>Web: Confirm pickup completed
    Web->>API: POST /donations/{id}/complete
    API->>DB: Update state (State: COMPLETED)
    API->>Ext: Calculate Impact metrics & log to Audit Logs
```

---

## 3. AI Architecture: Gemma as an Operations Coordinator

Gemma 4 does not communicate via free-form conversation loops. It performs structured data transformations and emits tool execution directives.

### Operations Pipeline
1. **Sanitization & Safety Check**: Validate description strings to prevent prompts injection.
2. **Object Identification & Quantitatives**: Parse raw image arrays to identify specific products and cross-examine descriptions to estimate volume.
3. **Operational Context Assessment**:
   - Determine **Donation Urgency** (Highly Urgent: < 4 hours, Urgent: < 12 hours, Normal: < 24 hours).
   - Extract **Recipient Categories** (e.g., Human vs. Animal feed, hot-meal vs. dry-goods storage requirements).
4. **Structured JSON Output**: Generate schema-compliant JSON payloads for backend processors to act on directly.

---

## 4. Function Calling & Integration Interface

When Gemma decides that a task requires external data, it returns a tool instruction object specifying the target operation.

```json
{
  "tool": "NearbyNgoSearch",
  "parameters": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "radius_meters": 5000,
    "food_requirements": ["veggie", "cooked"]
  }
}
```

The FastAPI backend interceptor processes these payloads:
* **Google Maps**: Resolves proximity grids and transit routing constraints.
* **Translation**: Translates messages to matching locales.
* **Email Service**: Dispatches templates using standardized transactional email patterns.
* **Impact Calculator**: Evaluates metrics (CO2 saved, equivalent meals served).
