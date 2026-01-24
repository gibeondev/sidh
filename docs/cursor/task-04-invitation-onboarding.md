# Task 04 — Invitation Onboarding (Phase 1)

## 0) Purpose
This task implements **Invitation Onboarding**, which bridges **pre-registration** to **authenticated parent access**.

It allows:
- Admins to send invitations for approved pre-registrations
- Public users to accept an invitation via token
- Creation of a PARENT user account
- Secure linking of application(s) to the parent account using **Invitation Rule C**

No full registration data is collected in this task.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Invitation persistence and token handling
- Admin endpoint to create/send invitations
- Public endpoint to accept invitation
- Parent user account creation
- Application linking logic (Rule C)

Frontend (apps/web):
- Minimal invitation acceptance page (set password)
- Basic success/failure feedback

### 1.2 Out of Scope
- Full registration wizard
- Document upload
- Admin review of full applications
- Student creation
- Email delivery infrastructure beyond basic sending (mock or simple service allowed)

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

## 3) Core Rules (Non-Negotiable)

### 3.1 Invitation Rule C (Locked)
- **Token is primary**
- **Email is secondary**

On invitation acceptance:
1. Validate token (single-use, not expired)
2. Create parent user (if not exists)
3. Link the **token-bound application** to the user
4. Link any **other unlinked applications** where:
   - `application.applicant_email == invitation.email`
5. Mark invitation as used (invalidate token)

No other linking behavior is allowed.

---

## 4) Backend Implementation Requirements

### 4.1 Module
Create or extend an `auth` or `invitations` module containing:
- controller(s)
- service
- DTOs
- token utilities

Controllers must remain thin.

---

### 4.2 Data models (Prisma)
Add or use existing models:
- `RegistrationInvitation`
  - `id`
  - `application_id`
  - `email`
  - `token_hash`
  - `expires_at`
  - `used_at`
  - timestamps

Rules:
- Store **hash of token**, never raw token
- Token must be single-use
- Use Prisma migrations

---

### 4.3 Token handling
- Generate cryptographically secure random token
- Hash token before persisting
- Compare hashes on accept
- Reject if:
  - token not found
  - token expired
  - token already used

---

## 5) API Endpoints (must match API surface)

### 5.1 Admin — Create Invitation
POST /admin/applications/:id/invitations


Behavior:
- ADMIN only
- Application must exist
- Application must be eligible for invitation (Phase 1: pre-registration approved or manually allowed)
- Creates invitation record
- Sends invitation email (simple implementation allowed)
- Returns success response (no token exposed in API)

---

### 5.2 Public — Accept Invitation
POST /auth/invitations/:token/accept


Behavior:
- PUBLIC (no auth)
- Validates token
- Accepts password + confirmation
- Creates PARENT user
- Links application(s) per Rule C
- Authenticates user (optional immediate login)
- Invalidates token

---

## 6) Validation Rules
- Password must meet minimum security requirements
- Password confirmation required
- Email derived from invitation (not user input)
- Token must be valid and unused

---

## 7) Frontend Implementation (apps/web)

### 7.1 Invitation acceptance page
Create a minimal page that:
- Reads token from URL
- Allows user to set password
- Submits to invitation accept endpoint
- Shows success or error state

Rules:
- No full parent dashboard yet
- No navigation beyond confirmation

---

## 8) Testing & Verification

### 8.1 Backend checks
- Invitation token cannot be reused
- Expired token is rejected
- Parent user created with role PARENT
- Application linking follows Rule C exactly
- `parent_user_id` set correctly

### 8.2 Manual flow
1. Create pre-registration
2. Admin sends invitation
3. Accept invitation via token
4. Verify:
   - user exists
   - application(s) linked
   - token invalidated

---

## 9) Acceptance Criteria

This task is complete when:
- Admin can create/send invitations
- Public user can accept invitation
- Parent account is created securely
- Applications are linked per Rule C
- No full registration data is collected yet

---

## 10) Guardrails
- Do not expose raw tokens
- Do not allow multiple uses of token
- Do not auto-approve applications
- Do not implement full registration wizard
- Do not implement document upload

---

## 11) Task Completion Rule
Once completed:
- System supports secure onboarding from pre-registration to authenticated parent
- Applications are correctly linked
- Project is ready for **Task 05: Full Registration Wizard**

---

### Status
Ready for execution in Cursor


