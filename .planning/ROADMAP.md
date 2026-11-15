# Project Roadmap: ElderCare

## Milestone v1.0: Foundation & Core Experience (COMPLETED)

### Phase 1: UI Foundation & Responsive Overhauls
- **Goal:** Transform static Stitch screens into a responsive, accessible React application.
- **Deliverables:**
  - Responsive header, navigation, and slide-out mobile drawer.
  - Role-based screens: `LoginPage`, `PatientDashboard`, `FamilyDashboard`, `ManagePatients`.
  - Senior accessibility tuning (high-contrast typography, large touch targets).
- **Status:** Complete ✅

### Phase 2: Supabase PostgreSQL Persistence & Backend
- **Goal:** Connect Express backend to cloud Supabase database and create relational schema.
- **Deliverables:**
  - URL sanitization and SSL connection pooling in `backend/db.js`.
  - Database migration script with RLS policies (`backend/migrate.js`).
  - Seeded patient profiles (Eleanor Vance, Arthur Vance, Martha Vance).
  - Express REST API endpoints for login, patients, medication tracking, and appointments.
- **Status:** Complete ✅

### Phase 3: Verification & Automated Test Suites
- **Goal:** Establish zero-dependency test runner and quality scripts for frequent verification.
- **Deliverables:**
  - 13 backend unit and in-memory integration tests (`node:test`).
  - 15 frontend client fallback and adherence algorithm tests.
  - Root `package.json` with `npm test` and `npm run check` commands.
- **Status:** Complete ✅

---

## Milestone v1.1: Cloud Deployment & Realtime Sync (ACTIVE)

### Phase 4: Production Deployment to Vercel
- **Goal:** Deploy the ElderCare application to Vercel with environment variable configuration.
- **Deliverables:**
  - Vercel CLI & MCP configuration verification.
  - Production build deployment link.
- **Status:** Ready for execution 🚀

### Phase 5: Realtime Caregiver Synchronization
- **Goal:** Implement instant event propagation when patients record medication intake.
- **Deliverables:**
  - Supabase Realtime channel subscription in `PatientContext`.
  - Realtime badge and toast notification on the Family Member Dashboard.
- **Status:** Planned 📋

---

## Milestone v1.2: Refill Management & Advanced Safety (PLANNED)

### Phase 6: Pill Inventory Tracking & Refill Alerts
- **Goal:** Monitor pill supply and alert caregivers before prescriptions run out.
- **Deliverables:**
  - Inventory columns in `medications` table (`remaining_pills`, `refill_threshold`).
  - Low-supply alert banners on patient and caregiver screens.
- **Status:** Backlog 📋
