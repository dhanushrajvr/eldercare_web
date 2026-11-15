# Technology Stack

## Overview
ElderCare is built as a full-stack JavaScript/TypeScript-ready application with a decoupled React SPA frontend, an Express REST API backend, and a cloud-hosted Supabase PostgreSQL database.

## Frontend
- **Framework / Runtime:** React 19.3.1
- **Build Tool:** Vite 8.3.6 (`@vitejs/plugin-react` 6.1.2)
- **Module Format:** ECMAScript Modules (`"type": "module"`)
- **Styling:** Tailwind CSS via CDN utility classes aligned with Stitch design tokens
- **Typography:** Google Fonts (*Plus Jakarta Sans*, *Inter*)
- **Icons:** Material Symbols Outlined (Google Fonts icon font)
- **Linter:** `oxlint` 1.90.0 (high-performance Rust-based linter)

## Backend
- **Runtime:** Node.js v26.13.1
- **Framework:** Express 5.3.0
- **Module Format:** CommonJS (`"type": "commonjs"`)
- **Database Driver:** `pg` (node-postgres) 8.23.1
- **Architecture:** Modular REST service with route-level separation and database connection pooling

## Database & Persistence
- **Engine:** PostgreSQL 15+ (Hosted on Supabase)
- **Security:** Row Level Security (RLS) enabled on all tables
- **Connection Mode:** Direct / Session pooler with SSL (`rejectUnauthorized: false`)
- **Schema Management:** Migration script (`backend/migrate.js`) with declarative DDL and foreign keys with cascading deletes

## Testing Infrastructure
- **Test Runner:** Native Node.js test runner (`node:test`, `node:assert`)
- **Execution Mode:** Zero-dependency, offline-capable in-memory dispatching
- **Test Scripts:** Root-level and subproject test commands (`npm test`, `npm run check`)

## Cloud & Tooling
- **Deployment Platform:** Vercel (Vercel CLI 65.16.0 native)
- **AI Agent Tooling:** Vercel MCP Server (`https://mcp.vercel.com`), Google Stitch MCP
