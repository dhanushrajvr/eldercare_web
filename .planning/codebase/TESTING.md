# Testing Architecture & Runbook

## Overview
ElderCare utilizes Node.js's built-in test runner (`node:test` and `node:assert`). This eliminates third-party test framework overhead, provides sub-second execution speeds, and requires zero external internet access to run.

## Test Directory Structure
```
backend/test/
├── dbConfig.test.js       # Database pool initialization & SSL configuration
├── formatPatient.test.js  # Patient model transformation & relationship mapping
└── routes.test.js         # In-memory Express request dispatching & status checks

frontend/test/
├── api.test.js            # Client-side offline fallbacks & contract verification
└── patientLogic.test.js   # Adherence scoring algorithms & prescription validation
```

## Running Tests

### 1. Run All Tests
```powershell
npm test
```
Executes both backend and frontend test suites.

### 2. Run Comprehensive Quality Verification
```powershell
npm run check
```
Runs full verification pipeline: tests → `oxlint` linting → Vite production bundle check.

### 3. Targeted Test Execution
```powershell
# Backend only
npm run test:backend

# Frontend only
npm run test:frontend

# Watch mode
npm run test:watch
```

## Coverage Highlights
- **Backend:** 13 passing unit and integration tests.
- **Frontend:** 15 passing client and logic tests.
- **Total Execution Time:** ~550 milliseconds.
