# Task 08 — Student Create & Export (Phase 1)

## 0) Purpose
This task completes Phase 1 by implementing:
- **Student listing** for admins
- **Student export (CSV)** for admins

Student creation itself must already occur **transactionally on application approval** (implemented in Task 07).  
This task focuses on **read/export** capabilities and any remaining hardening around student data access.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Admin students list endpoint
- Admin students export endpoint (CSV)
- Query filters (basic)
- Ensure student records are derived from approved applications (consistency checks)

Frontend (apps/web):
- Minimal admin students list page
- Download/export button (CSV)

### 1.2 Out of Scope
- Parent access to student records
- Academic lifecycle (classes, grades, attendance)
- Advanced reporting dashboards
- Audit/history logs
- Background job processing for exports

---

## 2) Inputs (Authoritative Specs)
Implementation must follow:
- `docs/specs/01-narrative-phase1.md`
- `docs/specs/02-contract-skeleton-phase1.md`
- `docs/specs/03-rbac-matrix-phase1.md`
- `docs/specs/04-api-surface-phase1.md`
- `docs/specs/05-data-dictionary-phase1.md`
- `docs/specs/08-technical-architecture-phase1.md`

---

## 3) Core Rules (Non-Negotiable)

### 3.1 Admin-only access
- Students endpoints are **ADMIN only**
- No parent endpoints for students in Phase 1

### 3.2 Student existence rule
- Student records exist **only after application approval**
- Each approved application must create **exactly one** student (1:1)

---

## 4) Backend Implementation Requirements

### 4.1 Module
Create or extend a `students` module containing:
- admin controller
- service
- DTOs for query parameters (if needed)

Controllers must remain thin.

---

### 4.2 Data model expectations
Use existing model:
- `Student` with 1:1 link to `Application`

If the `Student` model is missing fields required for export, extend it carefully:
- Keep Phase 1 minimal
- Prefer exporting from joined Application/RegistrationSubmission data rather than denormalizing

Use Prisma migrations for any schema changes.

---

## 5) API Endpoints (must match API surface)

### 5.1 List students
GET /admin/students


Behavior:
- ADMIN only
- Returns paginated or bounded list
- Includes enough fields for admin identification (minimum):
  - student.id
  - application_id
  - application_no (if available)
  - student name (from submission or derived)
  - created_at

Optional filters (Phase 1 basic):
- registration_period_id
- search by name/application_no

---

### 5.2 Export students as CSV
GET /admin/students/export.csv


Behavior:
- ADMIN only
- Returns `text/csv` response
- Includes header row
- Exports students derived from approved applications

CSV content must be deterministic:
- Stable column order
- Stable sorting (e.g., created_at asc, then id)

---

## 6) Export Data Columns (Phase 1 Minimum)
Export must include at minimum:
- student_id
- application_id
- application_no (if exists)
- applicant_email
- student_full_name
- birth_date
- nisn (if exists)
- created_at (student)

Data sources:
- `Student`
- joined `Application`
- joined `RegistrationSubmission` (full registration)

Do not include document files or storage keys.

---

## 7) Frontend Implementation (apps/web)

### 7.1 Students list page (minimal)
Create a minimal admin page that:
- Lists students (table)
- Shows key fields (name, application no, created date)
- Provides a CSV export button (link to export endpoint)

No design polish required.

---

## 8) Testing & Verification

### 8.1 Backend checks
- Non-admin requests to students endpoints return 403
- CSV export returns correct content type
- CSV export includes header row and stable columns
- Export contains only students that exist (approved applications)
- Sorting is stable and deterministic

### 8.2 Manual flow
1. Create and approve at least one application (Task 07)
2. Visit admin students list
3. Verify student appears
4. Download CSV export and verify columns/content

---

## 9) Acceptance Criteria
This task is complete when:
- Admin can list students via API and minimal UI
- Admin can export students as CSV via API and UI button
- Export format is stable and deterministic
- Access is restricted to ADMIN only
- No additional Phase 2 features are introduced

---

## 10) Guardrails
- Do not expose student endpoints to parents
- Do not export documents or file storage keys
- Do not introduce background jobs for export in Phase 1
- Do not redesign student schema beyond what is needed for Phase 1 export

---

## 11) Task Completion Rule
Once completed:
- Phase 1 functional scope is complete
- System supports end-to-end registration through approval and student export
- Project is ready for **Task 90: Quality Gates** (hardening, tests, CI discipline)

---

### Status
Ready for execution in Cursor



