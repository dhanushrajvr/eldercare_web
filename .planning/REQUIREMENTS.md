# ElderCare Requirements

## Completed Requirements (v1.0 - Core Platform)

### Authentication & Access
- [x] **AUTH-01:** Role switcher between Elderly Patient and Family Member.
- [x] **AUTH-02:** Patient identification via code (e.g. `EC-78294`).
- [x] **AUTH-03:** Caregiver identification via email with fallback profile.

### Patient Experience
- [x] **PAT-01:** High-contrast, large-touch visual medication cards.
- [x] **PAT-02:** Live clock and current time indicator.
- [x] **PAT-03:** One-tap "✓ I Have Taken My Medicine" status confirmation with time recording.
- [x] **PAT-04:** SOS emergency trigger modal connecting to 911 or primary caregiver.
- [x] **PAT-05:** Voice/Audio assist accessibility trigger.

### Family Caregiver Experience
- [x] **FAM-01:** Multi-patient overview with adherence progress bars.
- [x] **FAM-02:** Next dose and next doctor visit indicators.
- [x] **FAM-03:** Care plan medication manager (Add, modify, and delete prescriptions).
- [x] **FAM-04:** Doctor appointment coordinator (Add and update clinic visits).
- [x] **FAM-05:** Dynamic mobile responsive navigation with slide-out sidebar drawer.

### Backend & Persistence
- [x] **API-01:** Health check endpoint with database connectivity detection.
- [x] **API-02:** Supabase PostgreSQL connection with URL quote sanitization and SSL handling.
- [x] **API-03:** Relational schema with cascading deletes (`users`, `patients`, `medications`, `doctor_visits`).
- [x] **API-04:** Automated database migration and seeding script (`npm run migrate`).
- [x] **API-05:** Full test suite verifying formatting, routing, and client fallback logic.

---

## Future Requirements (Backlog)

### Milestone v1.1: Realtime Synchronization & Alerts
- [ ] **REAL-01:** Supabase Realtime channel integration for instant caregiver notifications upon medication intake.
- [ ] **REAL-02:** Browser push notifications / SMS alerts for missed medication doses.
- [ ] **REAL-03:** Caregiver activity audit log showing medication confirmation history.

### Milestone v1.2: Pill Inventory & Pharmacy Refill
- [ ] **INV-01:** Track pill count remaining and auto-decrement on intake.
- [ ] **INV-02:** Refill threshold warning when pills drop below 5 days supply.
- [ ] **INV-03:** One-click pharmacy refill request generation.
