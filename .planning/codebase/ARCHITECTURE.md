# Architecture & System Design

## Architecture Overview
ElderCare follows a decoupled client-server architecture with reactive state synchronization and resilient offline fallbacks.

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                  │
│                                                        │
│  ┌────────────────────┐       ┌─────────────────────┐  │
│  │   AuthContext      │       │   PatientContext    │  │
│  │ (Role / Session)   │       │(Meds / Visits / UI) │  │
│  └──────────┬─────────┘       └──────────┬──────────┘  │
│             │                            │             │
│  ┌──────────▼────────────────────────────▼──────────┐  │
│  │                  API Client Layer                │  │
│  │             (frontend/src/services/api.js)       │  │
│  │           - Offline Fallback Resiliency          │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │ HTTP / JSON
                              ▼
┌────────────────────────────────────────────────────────┐
│                 Backend (Express 5.3)                  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  REST API Router (backend/index.js)              │  │
│  │  - /api/health                                   │  │
│  │  - /api/login                                    │  │
│  │  - /api/patients, /api/patients/:id              │  │
│  │  - /api/patients/:id/take-medication             │  │
│  │  - /api/patients/:id/medications (CRUD)          │  │
│  │  - /api/patients/:id/appointment                 │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│  ┌──────────────────────────▼───────────────────────┐  │
│  │  PostgreSQL Connection Pool (backend/db.js)      │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │ pg protocol (SSL)
                              ▼
┌────────────────────────────────────────────────────────┐
│               Supabase Cloud PostgreSQL                │
│       (users, patients, medications, doctor_visits)    │
└────────────────────────────────────────────────────────┘
```

## State Management Architecture
- **`AuthContext`**: Manages current user profile and role (`patient` vs `family`). Controls which root dashboard is presented to the user.
- **`PatientContext`**: Central state container for:
  - Patient roster and active patient selection
  - Optimistic medication updates (instant checkmark toggle, live recalculation of adherence scores)
  - Modal lifecycle management (`MedicationModal`, `DoctorModal`, `HelpModal`)
  - Global feedback toasts
- **Resilient Fallback Design**:
  - The frontend contains complete fallback mocks in `src/services/api.js` and `PatientContext.jsx`.
  - If the backend is unreachable or offline, the UI functions seamlessly with zero console crashes.

## Data Flow
1. **User Action**: Patient clicks "✓ I Have Taken My Medicine" on their dashboard.
2. **Optimistic Update**: `PatientContext` immediately marks the dose as taken, updates timestamp, and recalculates adherence score.
3. **API Dispatch**: `api.takeMedication()` sends a `POST /api/patients/:id/take-medication` request.
4. **Backend Processing**: Express updates rows in `medications` and `patients` in Supabase PostgreSQL inside a single transaction logic.
5. **Database Response**: Returns the fresh normalized patient entity; frontend syncs with the confirmed state.
