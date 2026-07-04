# Folder Structure Specification

This document details the file directory mapping for the **FoodBridge AI** repository. It implements a scalable monorepo structure with a clear separation of apps, shared packages, config boundaries, and tooling documentation.

---

## 1. Repository Layout

```
foodbridge-ai/
├── apps/
│   ├── web/                    # Frontend React SPA
│   └── api/                    # Backend FastAPI
├── packages/
│   ├── shared/                 # Shared schema, types, and logic
│   ├── types/                  # Unified TS and JSON declarations
│   └── config/                 # Common Lint, Prettier, Tailwind configurations
├── docs/                       # Technical Specifications & Guides
│   ├── Architecture.md
│   ├── FolderStructure.md
│   ├── ApiDesign.md
│   ├── DatabaseDesign.md
│   ├── CodingStandards.md
│   └── DevelopmentWorkflow.md
├── .github/
│   └── workflows/              # CI/CD pipelines
├── package.json                # Monorepo Workspace settings
├── pnpm-workspace.yaml         # Monorepo workspaces registry
└── .gitignore                  # Global git ignores
```

---

## 2. Frontend Layout (`apps/web/`)

The React application uses a hybrid feature-first and component-first layout inside `src/`.

```
apps/web/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # SVGs, images, static logos
│   ├── components/             # Reusable UI elements
│   │   ├── ui/                 # shadcn/ui components (Button, Input, Card)
│   │   └── common/             # Global components (Navbar, Footer, Sidebar)
│   ├── features/               # Domain-specific features (Vertical encapsulation)
│   │   ├── donor/              # Listing flow, quantity estimation views
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── receiver/           # NGO discovery, alerts management, requests dashboard
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── admin/              # User validations, audit dashboards
│   ├── layouts/                # Base layout structures (DashboardLayout, AuthLayout)
│   ├── pages/                  # Page-level entrypoints matching route paths
│   ├── hooks/                  # Global React hooks
│   ├── services/               # Base API connection modules
│   ├── lib/                    # Configuration and library setups (axios, tailwind merge)
│   ├── types/                  # Local component type mappings
│   ├── config/                 # Client configurations (env variables check)
│   ├── constants/              # Immutable mappings (dietary tags, standard limits)
│   ├── contexts/               # Custom React Context wrappers (Theme, AlertToast)
│   ├── styles/                 # Global styling (tailwind overrides, variables)
│   ├── App.tsx                 # Root Router setup
│   ├── main.tsx                # SPA Mount entrypoint
│   └── index.css               # Base Tailwind imports
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 3. Backend Layout (`apps/api/`)

The FastAPI application separates routing layers from actual business execution and database queries.

```
apps/api/
├── app/
│   ├── core/                   # Security layers, database connect, global middleware
│   │   ├── config.py           # Base pydantic configuration schema
│   │   ├── database.py         # MongoDB connection managers
│   │   ├── security.py         # Passwords, tokens, validation rules
│   │   └── exceptions.py       # Global custom error definitions
│   ├── routers/                # API router entrypoints (HTTP requests/responses validation)
│   │   ├── food.py
│   │   ├── analysis.py
│   │   ├── donations.py
│   │   ├── organizations.py
│   │   ├── users.py
│   │   └── admin.py
│   ├── schemas/                # Pydantic schemas validating input/output payloads
│   ├── models/                 # Database schema templates mapping to MongoDB collections
│   ├── repositories/           # Direct database CRUD adapters
│   ├── services/               # Complex business logic coordinating multiple models/external tools
│   │   ├── maps.py             # Google Maps connection modules
│   │   ├── translation.py      # Messaging conversion handlers
│   │   └── notifications.py    # Multi-channel notification alerts
│   ├── ai/                     # Dedicated AI Orchestration Module
│   │   ├── coordinator.py      # Central coordinator class for Google Gemini
│   │   ├── prompts/            # System instruction & prompt templates
│   │   ├── tools/              # Function calling tool schema definitions
│   │   ├── validators/         # Input sanitization and safety filters
│   │   ├── parsers/            # Structured outputs extraction parsers
│   │   ├── schemas/            # JSON schema validation objects
│   │   ├── clients/            # API client configurations (e.g. Gemini Vertex SDK)
│   │   └── pipelines/          # Sequence pipelines (e.g. analysis & matching flows)
│   ├── middleware/             # CORS policies, request logs, latency metrics
│   ├── dependencies/           # FastAPI dependency injection routines (db, permissions)
│   ├── utils/                  # Helper utilities (formatting, mathematical formulas)
│   └── main.py                 # FastAPI application initializer
├── tests/                      # Unit and integration test files
├── requirements.txt            # Package dependencies
├── pyproject.toml              # Ruff, Black, and project build configs
└── .env.example                # Sample environment configurations
```
