# Coding Standards & Guidelines

This document establishes the patterns, code conventions, lint rules, and architectural standards for the **FoodBridge AI** monorepo.

---

## 1. Global Naming Conventions

* **Files and Directories**:
  * Frontend: `camelCase` or `kebab-case` for standard files; `PascalCase` for React components (e.g. `DonationCard.tsx`).
  * Backend: `snake_case` for all Python modules, directories, and variables.
* **Classes and Types**:
  * TS Interfaces & Types: `PascalCase` (e.g. `FoodListing`). Avoid prefixing with `I` (e.g. `IFoodListing` is prohibited).
  * Python Classes: `PascalCase` (e.g. `DonationRepository`).
* **Variables and Functions**:
  * JavaScript/TypeScript: `camelCase` (e.g. `getActiveListings()`).
  * Python: `snake_case` (e.g. `get_active_listings()`).

---

## 2. TypeScript/Frontend Standards

* **Strict Mode**: Enable strict null checks and type checking. Avoid using `any`. If a type is unknown, use `unknown`.
* **Component Declarations**: Use functional components with explicit typing for props.
  ```typescript
  type DonationCardProps = {
    listing: FoodListing;
    onSelect: (id: string) => void;
  };

  export const DonationCard: React.FC<DonationCardProps> = ({ listing, onSelect }) => {
    return (
      <div className="p-4 border rounded-lg shadow-sm">
        <h3>{listing.itemName}</h3>
      </div>
    );
  };
  ```
* **Imports Order**: Organize imports sequentially:
  1. React & core packages
  2. Third-party packages (e.g., Axios, Lucide)
  3. Shared workspace packages
  4. Local components, hooks, assets

---

## 3. Python/Backend Standards

* **Pep 8 Alignment**: Adhere to PEP 8 using **Ruff** for linting and **Black** for formatting.
* **Typing (Type Hints)**: All function signatures must include type annotations for arguments and return types.
  ```python
  from typing import List
  from app.schemas.food import FoodReport

  async def process_analysis(description: str) -> FoodReport:
      # Implementation
      pass
  ```
* **Async/Await**: Utilize `async/await` paths for external I/O bound tasks (MongoDB operations, Gemma SDK calls, network queries).

---

## 4. Error Handling & Exception Management

* **Frontend**: Wrap high-risk modules with React Error Boundaries. Catch API rejections using Axios interceptors to route messages through toast contexts.
* **Backend**: Catch domain errors at the service layer and translate them to HTTP exceptions inside the FastAPI router layer using custom middleware handler mappings.
  ```python
  class EntityNotFoundError(Exception):
      """Raised when database query yields empty response."""
      pass
  ```

---

## 5. Logging Standards

* **Format**: Standardize structured logging. Do NOT use print statements.
* **Backend Logger**: Use standard library `logging` or `loguru` configured with JSON formatting for production tracking.
* **Levels**:
  * `INFO`: Life cycle checkpoints (e.g. Server starting, Donation completed).
  * `WARNING`: Non-fatal issues (e.g. API request failed, retrying).
  * `ERROR`: System faults containing full exception tracebacks.
