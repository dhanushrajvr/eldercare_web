# Code Conventions & Design System

## Frontend Conventions
- **Component Architecture:** Pure functional components with React Hooks (`useState`, `useEffect`, `useContext`).
- **File Naming:** PascalCase for React components (`PatientDashboard.jsx`, `MedicationModal.jsx`), camelCase for utilities (`api.js`).
- **Icons:** Material Symbols Outlined font using semantic class names (`material-symbols-outlined`).
- **Senior Accessibility (A11Y):**
  - High contrast text against background surfaces (minimum 4.5:1 ratio for body, 3:1 for large text).
  - Touch targets of at least 48px by 48px on mobile devices.
  - Large readable typography (minimum 16px body, 20px+ for instructions).
  - Visual color badges paired with text status labels (never relying solely on color).
- **Styling:** Tailwind CSS utility classes adhering to Stitch design system variables:
  - Primary Brand: `#135bec` (Deep cobalt blue)
  - Dark Surfaces: `#101828`
  - Subtle Borders: `#e2e8f0` / `#cbd5e1`
  - Status Indicators: Emerald (`#10b981`), Amber (`#f59e0b`), Rose (`#ef4444`)

## Backend Conventions
- **Module System:** CommonJS modules (`require` / `module.exports`).
- **Export Guarding:** Main Express file checks `if (require.main === module)` before calling `app.listen` to allow in-memory test importation without port collision.
- **Error Handling:** Standardized JSON error response envelope:
  ```json
  { "success": false, "message": "Human readable message", "error": "Optional debug details" }
  ```
- **Database Safety:**
  - Strict parameterization (`$1`, `$2`, `$3`) on all SQL queries to prevent injection.
  - URL sanitization handling password characters (`@`, `#`) safely.

## Quality Standards
- Fast static linting with `oxlint` (configured in `.oxlintrc.json`).
- Zero-warning clean builds via Vite production compilation.
