# Task 07 — Admin Review & Decision (Phase 1)

## 0) Purpose
This task implements the **administrative review and decision workflow** for applications.

It allows admins to:
- Review completed applications
- Review uploaded documents
- Request changes from parents
- Approve or reject applications

Approval triggers **student creation readiness**, but actual export is handled in Task 08.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Admin application review endpoints
- Status transitions per Status Transitions spec
- Decision reason handling
- Transactional approval logic (without export)

Frontend (apps/web):
- Minimal admin review UI
- Ability to approve, reject, or request changes

### 1.2 Out of Scope
- Student export (CSV)
- Advanced admin dashboards
- Audit/history tracking
- Notifications beyond basic feedback

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

### 3.1 Decision authority
- Only **ADMIN** may:
  - Request changes
  - Approve applications
  - Reject applications

### 3.2 Preconditions for decisions
Before an admin can approve or reject:
- Application must exist
- Application status must be `SUBMITTED` or `UNDER_REVIEW`
- Full registration data must exist
- Required documents must exist (Phase 1 completeness check)

---

## 4) Backend Implementation Requirements

### 4.1 Module
Use or extend the existing `applications` module with:
- admin controller(s)
- service methods for review and decision
- transactional logic

Controllers must remain thin.

---

### 4.2 Status transitions (must follow spec exactly)

Implement the following transitions:

- `SUBMITTED → UNDER_REVIEW` (optional)
- `SUBMITTED / UNDER_REVIEW → CHANGES_REQUESTED`
- `UNDER_REVIEW → APPROVED`
- `UNDER_REVIEW → REJECTED`

No other transitions are allowed.

---

### 4.3 API Endpoints (must match API surface)

Admin endpoints:
GET /admin/applications
GET /admin/applications/:id
POST /admin/applications/:id/under-review
POST /admin/applications/:id/request-changes
POST /admin/applications/:id/approve
POST /admin/applications/:id/reject


Behavior:
- All endpoints require ADMIN role
- All status transitions validated server-side
- Reject requires `decision_reason`

---

### 4.4 Approval logic (transactional)
When approving an application:
- Validate current status
- Validate application completeness
- Validate document review state (Phase 1 policy)
- Transition status to `APPROVED`
- Create `Student` record (1:1)
- All operations must be **atomic**

---

### 4.5 Request changes logic
When requesting changes:
- Set status to `CHANGES_REQUESTED`
- Optional admin message may be stored
- Application becomes editable again by parent

---

### 4.6 Rejection logic
When rejecting:
- `decision_reason` is required
- Status set to `REJECTED`
- Application becomes immutable

---

## 5) Frontend Implementation (apps/web)

### 5.1 Admin application list
Create a minimal list that:
- Displays applications
- Shows status
- Allows navigation to detail view

---

### 5.2 Admin application detail view
Detail view must show:
- Full registration data (read-only)
- Uploaded documents with review status
- Actions:
  - Request changes
  - Approve
  - Reject (with reason)

Rules:
- No design polish required
- Functional verification only

---

## 6) Testing & Verification

### 6.1 Backend checks
- Parent cannot access admin endpoints
- Invalid transitions are rejected
- Reject without decision_reason fails
- Approval creates exactly one Student
- Duplicate approvals are prevented

---

### 6.2 Manual flow
1. Parent submits application
2. Admin views application
3. Admin requests changes → parent edits → re-submits
4. Admin approves application
5. Verify:
   - Status is APPROVED
   - Student record exists

---

## 7) Acceptance Criteria

This task is complete when:
- Admins can review applications
- Status transitions behave exactly as specified
- Approvals and rejections are enforced correctly
- Student record is created on approval
- No export functionality exists yet

---

## 8) Guardrails
- Do not implement student export
- Do not add audit/history tracking
- Do not bypass transactional logic
- Do not auto-approve applications
- Do not allow parent access to admin endpoints

---

## 9) Task Completion Rule
Once completed:
- Administrative decision workflow is stable
- Applications can reach terminal states
- Project is ready for **Task 08: Student Create & Export**

---

### Status
Ready for execution in Cursor
