# Technical Concerns & Future Hardening

## 1. Network Sandbox Isolation & Remote Database Access
- **Issue:** The local development sandbox prevents outbound TCP/DNS connections to remote external hosts like Supabase (`db.awfqnoizuakpxzpfopyl.supabase.co:5432`) unless executed outside the sandbox or with network permissions.
- **Mitigation:**
  - Automated tests run completely in-memory using mocked or offline payloads.
  - Live server runs outside sandbox or in production deployment without network restrictions.
  - Future improvement: Add an optional local SQLite or PostgreSQL test container for offline end-to-end testing.

## 2. Authentication & Session Management
- **Issue:** Authentication currently validates roles (`patient` vs `family`) and returns user payloads without cryptographically signed JWTs or HttpOnly session cookies.
- **Mitigation:**
  - Introduce Supabase Auth or JSON Web Tokens (JWT) with refresh token rotation for production security.

## 3. Realtime Caregiver Notifications
- **Issue:** When a patient takes their medication, the caregiver's dashboard updates upon manual refresh or background polling rather than immediate WebSocket push.
- **Mitigation:**
  - Leverage Supabase Realtime Postgres Changes (`supabase.channel()`) to stream intake events directly to the Family Member Dashboard in real time.

## 4. Medication Inventory & Refill Reminders
- **Issue:** Current schema tracks daily intake and adherence percentage, but not pill count inventory or pharmacy refill countdowns.
- **Mitigation:**
  - Extend the `medications` table with `total_pills` and `remaining_pills` columns, adding automated alert badges when refills drop below 5 days.
