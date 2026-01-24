# Task 03 — Pre-Registration (Phase 1)

## 0) Purpose
This task implements the **Pre-Registration flow**, which is the public entry point into the system.

It allows:
- Public users (unauthenticated) to submit a pre-registration
- Creation of an initial Application record (email-based identity)
- Storage of pre-registration data only

No parent account is created in this task.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Public pre-registration endpoint
- Application + pre-registration persistence
- Initial application status handling
- Registration period enforcement (OPEN only)
- Validation per Data Dictionary

Frontend (apps/web):
- Minimal public pre-registration form
- Submission + basic success/failure feedback

### 1.2 Out of Scope
- Invitation onboarding
- Parent account creation
- Authentication requirements
- Full registration (wizard)
- Document upload
- Admin review UI
- Student creation

---

## 2) Inputs (Authoritative Specs)
Implementation must follow:
- `docs/specs/01-narrative-phase1.md`
- `docs/specs/02-contract-skeleton-phase1.md`
- `docs/specs/03-rbac-matrix-phase1.md`
- `docs/specs/04-api-surface-phase1.md`
- `docs/specs/05-data-dictionary-phase1.md`
- `docs/specs/06-status-transitions-phase1.md`
- `docs/specs/08-technical-architecture-phase1.md`

---

## 3) Backend Implementation Requirements

### 3.1 Module
Use the existing or create an `applications` module containing:
- public controller
- service
- DTOs

Controllers must remain thin.

---

### 3.2 Data models (Prisma)
Use existing models from previous tasks and add if missing:
- `Application`
- `ApplicationPreRegistration`

Rules:
- One `Application` per pre-registration
- `ApplicationPreRegistration` is 1:1 with `Application`
- Use Prisma migrations
- Do not add unrelated models

---

### 3.3 Initial application state
When pre-registration is submitted:
- Create `Application` with:
  - `applicant_email`
  - `registration_period_id`
  - `status = DRAFT`
- Create associated `ApplicationPreRegistration`
- No `parent_user_id` yet

---

### 3.4 API Endpoint (must match API surface)

Implement:

POST /public/applications/pre-register

Behavior:
- Accepts pre-registration payload per Data Dictionary
- Validates required fields
- Rejects if registration period is CLOSED
- Returns a success response with application identifier (no sensitive data)

---

### 3.5 Validation rules
- DTO-based validation using class-validator
- Required vs optional fields enforced per Data Dictionary
- Email format validated
- Dates validated logically (e.g. end ≥ start)

---

### 3.6 Registration period enforcement
Before creating records:
- Check active registration period
- If no OPEN period exists → reject with 403 or domain-specific error

---

## 4) Frontend Implementation (apps/web)

### 4.1 Public pre-registration form
Create a minimal public form that:
- Collects all required pre-registration fields
- Submits to `/public/applications/pre-register`
- Shows basic success message on completion

Rules:
- No authentication
- No styling polish required
- No navigation to next steps (invitation handled later)

---

### 4.2 Error handling
- Display validation errors returned by API
- Display clear message when registration period is closed

---

## 5) Testing & Verification

### 5.1 Backend checks
- Submitting valid payload creates:
  - Application
  - ApplicationPreRegistration
- Missing required fields → validation error
- Period CLOSED → request rejected
- No parent user created

### 5.2 Manual flow
1. Open registration period as admin
2. Submit pre-registration publicly
3. Verify DB records exist
4. Close period
5. Verify submission is blocked

---

## 6) Acceptance Criteria

This task is complete when:
- Public pre-registration endpoint exists and works
- Application + pre-registration data persist correctly
- Status is set to DRAFT
- Registration period enforcement is applied
- Minimal frontend form allows verification
- No invitation, auth, or admin logic exists yet

---

## 7) Guardrails
- Do not create users
- Do not send emails
- Do not implement invitation logic
- Do not implement document upload
- Do not expose application lists publicly

---

## 8) Task Completion Rule
Once completed:
- System supports public entry into registration
- Applications exist in a pre-account state
- Project is ready for **Task 04: Invitation Onboarding**

---

### Status
Ready for execution in Cursor
