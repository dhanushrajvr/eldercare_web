# Project Context: ElderCare

## Vision & Purpose
ElderCare is an accessible healthcare web platform that bridges daily medication management for seniors with proactive visibility and coordination for their family caregivers.

## Core Problem
Elderly patients often struggle with complex multi-dose medication routines and small, unintuitive digital interfaces. Caregivers suffer from anxiety and communication gaps regarding whether doses were taken on time, when refills are needed, or when doctor visits are approaching.

## Solution
A role-based web application with two distinct experiences:
1. **Patient Dashboard:** Large, high-contrast, uncluttered interface featuring visual medication cards with pill photos, clear due times, audio accessibility options, and a prominent one-tap "✓ I Have Taken My Medicine" status toggle alongside an emergency SOS trigger.
2. **Family Member Dashboard & Management:** Multi-patient monitoring hub displaying real-time adherence percentages, upcoming appointments, and full care-plan management to add/edit medications and coordinate clinic visits.

## Technology Stack
- **Frontend:** React 19, Vite 8, Tailwind CSS, Material Symbols Outlined
- **Backend:** Express 5.3 REST API (Node.js v26)
- **Database:** Supabase Cloud PostgreSQL with Row Level Security (RLS)
- **Deployment:** Vercel (CLI & MCP connected)
- **Testing:** Node.js native test runner (`node:test`)

## Current State
- ✅ Stitch design layouts converted and responsive on all viewports.
- ✅ Supabase database migrated and populated with patient/medication seed data.
- ✅ Full REST API implemented with in-memory test coverage (28 passing tests).
- ✅ Vercel CLI and agent skills configured.
