# Codebase Structure

```
eldercare_web/
├── package.json                 # Unified root test, check, lint, and build scripts
├── skills-lock.json             # Agent skills lockfile
├── .agents/                     # Project-scoped agent skills (Supabase & Postgres)
│   └── skills/
│       ├── supabase/
│       └── supabase-postgres-best-practices/
├── backend/                     # Express REST backend
│   ├── .env                     # Supabase DATABASE_URL configuration
│   ├── package.json             # Express, pg, and test scripts
│   ├── db.js                    # PostgreSQL connection pool with URL sanitizer
│   ├── index.js                 # Express routes, controllers, and formatters
│   ├── migrate.js               # Supabase schema migrations and seed scripts
│   └── test/                    # In-memory unit and integration tests
│       ├── dbConfig.test.js     # Pool options & config tests
│       ├── formatPatient.test.js# Data mapping & formatting unit tests
│       └── routes.test.js       # Express route handlers & CORS tests
├── frontend/                    # React 19 + Vite frontend SPA
│   ├── index.html               # Head typography, Stitch tokens, Tailwind CDN
│   ├── package.json             # Vite, React 19, oxlint, and test scripts
│   ├── vite.config.js           # Vite dev server and /api proxy configuration
│   ├── dist/                    # Production bundle build output
│   ├── public/                  # Static assets & SVG icons
│   ├── src/
│   │   ├── App.jsx              # Main router & screen layout coordinator
│   │   ├── index.css            # Base responsive CSS resets and utility layers
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx   # Top navigation bar, clock, profile & mobile toggle
│   │   │   │   └── Sidebar.jsx  # Desktop and mobile slide-out drawer navigation
│   │   │   └── modals/
│   │   │       ├── DoctorModal.jsx     # Schedule & update clinic appointments
│   │   │       ├── HelpModal.jsx       # Emergency SOS protocols & contact triggers
│   │   │       └── MedicationModal.jsx # Add & update prescription routine
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Role switching (patient vs family)
│   │   │   └── PatientContext.jsx      # Reactive patient state, adherence, meds
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx           # Accessible login screen with audio assist
│   │   │   ├── PatientDashboard.jsx    # Patient view: photo cards & intake button
│   │   │   ├── FamilyDashboard.jsx     # Family view: multi-patient adherence
│   │   │   └── ManagePatients.jsx      # Care plan management & dosage modification
│   │   └── services/
│   │       └── api.js                  # Fetch client with robust offline fallbacks
│   └── test/
│       ├── api.test.js                 # API service fallback & contract tests
│       └── patientLogic.test.js        # Adherence calculation & intake simulation
└── stitch_screens/              # Downloaded Stitch reference layouts & screenshots
    ├── login.html & login.jpg
    ├── patient_dashboard.html & patient_dashboard.jpg
    ├── family_dashboard.html & family_dashboard.jpg
    └── manage_patients.html & manage_patients.jpg
```
