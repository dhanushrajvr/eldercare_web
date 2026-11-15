# External Integrations & Services

## 1. Supabase PostgreSQL
- **Endpoint:** `db.awfqnoizuakpxzpfopyl.supabase.co:5432`
- **Database:** `postgres`
- **Driver:** `pg.Pool` initialized in `backend/db.js`
- **Tables:**
  - `users`: Caregivers and patient user accounts
  - `patients`: Core patient demographic, status, and adherence records
  - `medications`: Scheduled prescriptions, dosage, frequency, and taken states
  - `doctor_visits`: Upcoming clinic appointments, specialty, notes, and dates
- **Security:**
  - Row Level Security (RLS) enabled on all 4 tables
  - Permissive policies configured for read and update operations
- **Credential Handling:**
  - Managed via `backend/.env` with URL-encoded special characters (`%40`, `%23`)

## 2. Google Stitch MCP
- **Project ID:** `5727237116595767700`
- **Screens Exported:**
  - Log In (`97bf0c9a64014aa7839c084d8cfcfeb6`)
  - Patient Dashboard (`f2a28bdd3e0c4836b55430417d9d701e`)
  - Family Member Dashboard (`8da9830e95e440ee839db6fc4a5764a5`)
  - Manage Patients (`817643ba38424450af2fe2d2cdf62a80`)
- **Archival Location:** `stitch_screens/` (contains both HTML templates and base64-decoded JPEGs)

## 3. Vercel Platform & MCP
- **CLI:** Vercel CLI 65.16.0 installed globally
- **Remote MCP:** Configured in `~/.gemini/config/mcp_config.json` pointing to `https://mcp.vercel.com`
- **Vercel Skills:** Installed 9 global skills (`deploy-to-vercel`, `vercel-composition-patterns`, etc.)
- **Deployment Ready:** Frontend Vite app prepared for Vercel static deployment or full-stack serverless deployment
