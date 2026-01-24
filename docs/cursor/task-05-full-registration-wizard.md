# Task 05 — Full Registration Wizard (Phase 1)

## 0) Purpose
This task implements the **Full Registration Wizard**, allowing an authenticated **PARENT**
to complete all required registration data for an application after invitation onboarding.

It enables:
- Step-by-step data entry
- Draft saving
- Final submission for admin review

No document upload or admin review is implemented in this task.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Full registration persistence
- Parent-owned application editing
- Draft save behavior
- Submit action (status transition to SUBMITTED)
- Validation per Data Dictionary

Frontend (apps/web):
- Multi-step registration wizard (minimal UI)
- Draft save behavior
- Submit confirmation

### 1.2 Out of Scope
- Document upload
- Admin review or decision
- Student creation
- Invitation logic
- Registration period creation logic (already implemented)

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
Use or extend the existing `applications` module containing:
- parent controller
- service
- DTOs

Controllers must remain thin.

---

### 3.2 Data models
Use existing models:
- `Application`
- `RegistrationSubmission`
- `ApplicationContact`

Rules:
- `RegistrationSubmission` is 1:1 with `Application`
- `ApplicationContact` may be 1:N per application
- Use Prisma migrations only if new tables are required

---

### 3.3 Edit permissions
Parents may edit full registration data only when:
- They own the application
- `application.status IN (DRAFT, CHANGES_REQUESTED)`
- Registration period is OPEN

Any violation must result in 403.

---

### 3.4 API Endpoints (must match API surface)

Implement parent endpoints:
GET /parent/applications/:id
PATCH /parent/applications/:id
POST /parent/applications/:id/submit


Behavior:
- `GET`: return current full registration state
- `PATCH`: save partial data (draft)
- `POST submit`: validate all required fields and transition status

---

### 3.5 Validation rules
- DTO-based validation with class-validator
- Partial validation allowed for PATCH (draft)
- Full validation enforced on submit
- Required fields per Data Dictionary

---

### 3.6 Status handling
- Editing does NOT change status
- Submitting triggers transition:
  - `DRAFT / CHANGES_REQUESTED → SUBMITTED`
- `submitted_at` must be set on submit

---

## 4) Frontend Implementation (apps/web)

### 4.1 Wizard structure
Create a minimal multi-step wizard that:
- Loads application data
- Splits fields into logical steps (free grouping)
- Allows saving between steps
- Allows final submission

Rules:
- No design polish required
- No document upload in this task
- Focus on correctness, not UX perfection

---

### 4.2 Draft behavior
- Saving a step triggers PATCH
- Navigation between steps allowed
- Data persists across reloads

---

### 4.3 Submit behavior
- Final submit triggers POST submit
- Show confirmation on success
- Show validation errors if any required field is missing

---

## 5) Testing & Verification

### 5.1 Backend checks
- Parent cannot edit non-owned application
- Parent cannot edit when status not allowed
- PATCH saves partial data
- SUBMIT enforces full validation
- Status transitions correctly to SUBMITTED

### 5.2 Manual flow
1. Invite parent and log in
2. Open application
3. Fill some fields and save
4. Reload and verify persistence
5. Submit application
6. Verify status is SUBMITTED

---

## 6) Acceptance Criteria

This task is complete when:
- Full registration data is persisted correctly
- Parents can save drafts
- Parents can submit applications
- Status transitions correctly
- No document upload or admin logic exists yet

---

## 7) Guardrails
- Do not implement document upload
- Do not implement admin review
- Do not create student records
- Do not change RBAC rules
- Do not auto-approve applications

---

## 8) Task Completion Rule
Once completed:
- Parents can fully complete registration data
- Applications are ready for document upload
- Project is ready for **Task 06: Documents Upload**

---

### Status
Ready for execution in Cursor


