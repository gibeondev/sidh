# Task 02 — Registration Period (Phase 1)

## 0) Purpose
This task implements the **Registration Period** foundation.

It enables admins to:
- Create and manage registration periods
- Open/close a period

It enables public/parents to:
- Read the active registration period

This task also introduces the first **global enforcement rule**:
- When the registration period is **CLOSED**, PUBLIC/PARENT write actions are blocked (admin actions remain allowed).

No application workflows are implemented yet.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Prisma model(s) for registration periods
- Admin CRUD endpoints for periods (as per API surface)
- Active period public endpoint
- Period open/close actions
- A reusable enforcement helper to block parent/public write actions when CLOSED

Frontend (apps/web) minimal:
- A minimal admin page to create/open/close a period (basic UI only)
- A minimal public check (display active period status) for verification

### 1.2 Out of Scope
- Pre-registration submission logic
- Invitation onboarding
- Application entities and full workflow
- Document upload and storage
- Student creation and export
- Full admin dashboard design

---

## 2) Inputs (Authoritative Specs)
Implementation must follow:
- `docs/specs/04-api-surface-phase1.md` (endpoints and audiences)
- `docs/specs/03-rbac-matrix-phase1.md` (role rules)
- `docs/specs/08-technical-architecture-phase1.md` (Prisma, module structure, validation)
- `docs/specs/01-narrative-phase1.md` (period closure behavior)

---

## 3) Backend Implementation Requirements

### 3.1 Module
Create a `registration-periods` module containing:
- controller(s) for public + admin routes
- service
- DTOs (class-validator)
- any shared helper for "period is open" checks

Controllers must remain thin.

---

### 3.2 Data model (Prisma)
Add a `RegistrationPeriod` model with minimum fields:
- `id` (uuid)
- `name` (string)
- `start_at` (datetime)
- `end_at` (datetime)
- `status` (enum: OPEN | CLOSED)
- `created_at`
- `updated_at`

Rules:
- Use Prisma migrations
- Do not add unrelated models

---

### 3.3 API Endpoints (must match API surface)
Implement:

Public:
- `GET /public/registration-periods/active`

Admin:
- `GET /admin/registration-periods`
- `POST /admin/registration-periods`
- `PATCH /admin/registration-periods/:id`
- `POST /admin/registration-periods/:id/close`
- `POST /admin/registration-periods/:id/open` (optional if supported; if not implemented, document clearly)

Rules:
- Admin endpoints require ADMIN role guard
- Public endpoint is unauthenticated

---

### 3.4 Active period selection rules
Define and implement a clear rule for determining "active period":

Minimum acceptable behavior for Phase 1:
- Return the most relevant OPEN period (if multiple exist, choose one deterministically)
- If no OPEN period exists, return null / 204 / a clear payload

Implementation must be deterministic and documented in code comments.

---

### 3.5 Enforcement helper (foundation)
Implement a reusable backend helper (service function or guard utility) that can be used later to enforce:

- If period is CLOSED:
  - Block PUBLIC/PARENT write actions (create/edit/submit/upload)
  - Allow ADMIN actions

For Task 02, this helper should be created and unit-tested lightly, but it will be fully applied in later tasks.

---

## 4) Frontend Minimal Verification (apps/web)

### 4.1 Admin verification UI
Create a minimal page (no design polish required) that allows:
- Create a period
- Close/open a period
- View list of periods

This page is only for development verification.

### 4.2 Public verification UI
Create a minimal page/section that displays:
- Active period status (OPEN/CLOSED or none)

Rules:
- No full dashboard design in this task
- Keep UI minimal; functional confirmation only

---

## 5) Testing & Verification

### 5.1 Backend checks
- Ensure endpoints enforce role rules
- Ensure public endpoint works without authentication
- Ensure period open/close changes status persistently

### 5.2 Manual checks
- Create an OPEN period as admin
- Confirm `/public/registration-periods/active` returns it
- Close it and confirm active returns none or CLOSED depending on rule
- Ensure admin endpoints still work when CLOSED

---

## 6) Acceptance Criteria

This task is complete when:
- Prisma migration for RegistrationPeriod exists and applies cleanly
- All listed endpoints are implemented and functional
- Admin endpoints require ADMIN role
- Public endpoint returns active period deterministically
- Minimal frontend pages allow verification of create/open/close behavior
- No application workflow or document logic has been implemented

---

## 7) Guardrails
- Do not implement application tables or endpoints
- Do not implement invitation flow
- Do not implement document upload
- Do not implement student creation
- Do not add new dependencies unless required and explicitly justified

---

## 8) Task Completion Rule
Once completed:
- Registration period management is stable
- Global "period closed" rule foundation exists
- Project is ready for **Task 03: Pre-registration**

---

### Status
Ready for execution in Cursor
