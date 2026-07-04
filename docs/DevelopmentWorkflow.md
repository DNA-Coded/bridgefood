# Development Workflow Guide

This document details instructions for setting up the local environment, building resources, managing environments, and launching **FoodBridge AI**.

---

## 1. Prerequisites

Ensure the following tools are installed locally:
* **Node.js**: v18 or later
* **PNPM**: Package manager (highly recommended for monorepos)
* **Python**: v3.10 or later
* **MongoDB**: Standard local instance or connection URI for MongoDB Atlas

---

## 2. Environment Variables

Create `.env` files in both the API and Web apps.

### Backend (`apps/api/.env`)
```ini
# Server Config
PORT=8000
ENVIRONMENT=development

# MongoDB Config
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodbridge?retryWrites=true&w=majority
DATABASE_NAME=foodbridge

# Gemma & AI Config
GOOGLE_API_KEY=your_gemini_api_key_here

# Maps Platform
GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Mail Config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Frontend (`apps/web/.env`)
```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_MAPS_KEY=your_google_maps_key_here
```

---

## 3. Quickstart Guide

### Step 1: Clone and Set Up Monorepo Workspace
```bash
git clone https://github.com/your-org/foodbridge-ai.git
cd foodbridge-ai
pnpm install
```

### Step 2: Initialize Backend Virtual Env & Packages
```bash
cd apps/api
python -m venv venv
# On Windows Powershell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 3: Run Development Servers

#### Launch Backend (from `apps/api`)
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive swagger docs will be accessible at: `http://localhost:8000/docs`

#### Launch Frontend (from root workspace or `apps/web`)
```bash
# From root
pnpm --filter web dev
# Or from apps/web
pnpm dev
```
The client portal will be accessible at: `http://localhost:5173`

---

## 4. Git Branching & CI/CD Pipelines

* **Branching Model**:
  * `main`: Represents production-ready codebase.
  * `dev`: Integration branch for testing new features.
  * `feature/*`: Development sandbox for individual tasks.
* **Pull Requests (PR)**:
  * Must pass TypeScript compile checks and FastAPI tests.
  * Must be formatted using Prettier & Black before merge.
