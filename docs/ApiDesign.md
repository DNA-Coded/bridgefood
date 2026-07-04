# API Design Specifications

This document outlines the API endpoints, schemas, request/response models, and LLM function calling targets for **FoodBridge AI**.

---

## 1. Global API Standards

* **Base URL**: `/api/v1`
* **Content Type**: `application/json`
* **Response Wrapper**: Error payloads are standardized.
  ```json
  {
    "status": "error",
    "code": "ENTITY_NOT_FOUND",
    "message": "The requested resource could not be found.",
    "details": {}
  }
  ```

---

## 2. API Endpoint Contracts

### Food Analysis Routing (`/food`)

#### POST `/food/analyze`
Submits raw listing details and images for analysis by the Gemma 4 engine.
* **Request Payload** (Multipart Form Data):
  * `image`: Binary file (optional, jpg/png, max 5MB)
  * `description`: String (optional, e.g., *"We have about 3 large catering trays of vegetable biryani left over from a wedding event. Cooked 2 hours ago."*)
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": {
      "id": "analysis_65f8c7e90",
      "summary": {
        "item_name": "Vegetable Biryani",
        "estimated_weight_kg": 15.0,
        "quantity_description": "3 large catering trays"
      },
      "urgency": {
        "level": "HIGH",
        "expires_in_hours": 4,
        "rationale": "Cooked buffet food held at ambient temperatures must be distributed and consumed within a strict window."
      },
      "recommended_recipients": ["NGO", "Community Kitchen", "Homeless Shelter"],
      "allergens": ["gluten", "dairy"],
      "multilingual_summaries": {
        "en": "Surplus cooked vegetable biryani from wedding event.",
        "es": "Biryani de verduras cocidas sobrante de boda."
      }
    }
  }
  ```

---

### Donation Listings Routing (`/donations`)

#### POST `/donations`
Creates a surplus food listing ready for recipient notifications.
* **Request Payload**:
  ```json
  {
    "analysis_id": "analysis_65f8c7e90",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "pickup_window": {
      "start_time": "2026-07-04T18:00:00Z",
      "end_time": "2026-07-04T22:00:00Z"
    },
    "dietary_restrictions": ["VEGETARIAN", "HALAL"]
  }
  ```
* **Success Response** (`201 Created`):
  ```json
  {
    "status": "success",
    "data": {
      "listing_id": "donation_98f6d8a20",
      "state": "PENDING_ALERTS",
      "created_at": "2026-07-04T16:06:00Z"
    }
  }
  ```

#### GET `/donations`
Retrieves matching listings based on location bounds and recipient profiles.
* **Query Parameters**:
  * `lat`: Float (Optional)
  * `lng`: Float (Optional)
  * `radius_km`: Float (Default: 5)
  * `state`: String (e.g., `ACTIVE`, `REQUESTED`, `COMPLETED`)
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": [
      {
        "listing_id": "donation_98f6d8a20",
        "item_name": "Vegetable Biryani",
        "urgency": "HIGH",
        "distance_km": 1.2,
        "state": "ACTIVE"
      }
    ]
  }
  ```

#### POST `/donations/{id}/request`
Recipients execute this endpoint to request matching surplus food.
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": {
      "request_id": "req_84c98d2a0",
      "listing_id": "donation_98f6d8a20",
      "state": "REQUESTED"
    }
  }
  ```

#### POST `/donations/{id}/accept`
Donors select an organization request to assign the pickup.
* **Request Payload**:
  ```json
  {
    "accepted_request_id": "req_84c98d2a0"
  }
  ```
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": {
      "listing_id": "donation_98f6d8a20",
      "state": "ACCEPTED",
      "pickup_code": "FB-9981"
    }
  }
  ```

#### POST `/donations/{id}/complete`
Confirms the handoff is complete.
* **Request Payload**:
  ```json
  {
    "pickup_code": "FB-9981"
  }
  ```
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": {
      "listing_id": "donation_98f6d8a20",
      "state": "COMPLETED",
      "impact_metrics": {
        "co2_saved_kg": 28.5,
        "meals_provided": 30
      }
    }
  }
  ```

---

### Organization Routing (`/organizations`)

#### GET `/organizations/nearby`
Search for active recipient nodes. Called by background services or Gemma tool runners.
* **Query Parameters**:
  * `lat`: Float (Required)
  * `lng`: Float (Required)
  * `radius_meters`: Integer (Default: 5000)
* **Success Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "data": [
      {
        "org_id": "org_54fa829b",
        "name": "Helping Hands Shelter",
        "category": "Homeless Shelter",
        "distance_meters": 1400
      }
    ]
  }
  ```

---

## 3. Gemma Function Calling Specs

Gemma 4 outputs a structured directive schema if it decides external utilities should execute.

### Tool: `NearbyNgoSearch`
* **Interface Schema**:
  ```json
  {
    "type": "object",
    "properties": {
      "latitude": { "type": "number" },
      "longitude": { "type": "number" },
      "radius_meters": { "type": "integer" }
    },
    "required": ["latitude", "longitude"]
  }
  ```

### Tool: `TranslateMessage`
* **Interface Schema**:
  ```json
  {
    "type": "object",
    "properties": {
      "text": { "type": "string" },
      "target_languages": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["text", "target_languages"]
  }
  ```

### Tool: `ImpactCalculator`
* **Interface Schema**:
  ```json
  {
    "type": "object",
    "properties": {
      "item_name": { "type": "string" },
      "quantity_kg": { "type": "number" }
    },
    "required": ["item_name", "quantity_kg"]
  }
  ```
