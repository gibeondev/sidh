# Task 06 — Documents Upload (Phase 1)

## 0) Purpose
This task implements **document upload and review foundations**.

It allows:
- Parents to upload required documents for their own applications
- Admins to view and download uploaded documents
- Admins to approve or reject documents with notes

Documents are **confidential** and handled securely.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Document metadata persistence
- File upload handling
- Parent document upload endpoints
- Admin document list, download, approve/reject endpoints
- Enforcement of document access rules

Frontend (apps/web):
- Parent document upload UI (minimal)
- Admin document review UI (minimal)

### 1.2 Out of Scope
- Full admin dashboards
- Automatic document validation
- OCR or file processing
- Bulk upload/download
- Student creation
- Application approval/rejection (handled in Task 07)

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

### 3.1 Confidentiality
- Parents may **upload** documents
- Parents may **not download** documents
- Admins may **view and download** documents

### 3.2 Application constraints
Parents may upload documents only when:
- They own the application
- `application.status IN (DRAFT, CHANGES_REQUESTED)`
- Registration period is OPEN

---

## 4) Backend Implementation Requirements

### 4.1 Module
Use or extend a `documents` module containing:
- controller(s)
- service
- DTOs
- file handling utilities

Controllers must remain thin.

---

### 4.2 Data models
Use existing models:
- `Document`
- `File` (metadata only)

Rules:
- Each document is linked to exactly one application
- Document type is a fixed enum
- Document review status defaults to `PENDING`

---

### 4.3 File handling
- Store binary files in private storage
- Store metadata in DB only
- Never expose raw

## 5) API Endpoints (must match API surface)

### 5.1 Parent — Upload document
POST /parent/applications/:id/documents


Behavior:
- PARENT only
- Validates ownership, status, period
- Accepts multipart/form-data
- Requires document_type
- Persists file + document metadata
- Returns document metadata only

---

### 5.2 Parent — List document metadata
GET /parent/applications/:id/documents


Behavior:
- PARENT only
- Returns document metadata (no file access)
- Ownership enforced

---

### 5.3 Admin — List documents
GET /admin/applications/:id/documents


Behavior:
- ADMIN only
- Returns document metadata for application

---

### 5.4 Admin — Download document
GET /admin/documents/:id/download


Behavior:
- ADMIN only
- Streams file or returns signed URL
- Never expose storage key directly

---

### 5.5 Admin — Review document
POST /admin/documents/:id/approve
POST /admin/documents/:id/reject


Behavior:
- ADMIN only
- Reject requires review_note
- Update document review_status accordingly

---

## 6) Validation Rules
- Enforce document type enum
- Enforce file size limits
- Enforce MIME type whitelist
- Prevent duplicate uploads if policy requires (optional, Phase 1 may allow overwrite)

---

## 7) Frontend Implementation (apps/web)

### 7.1 Parent upload UI
Create a minimal UI that:
- Lists required document types
- Allows file selection and upload
- Shows upload success/failure
- Does not allow file download

---

### 7.2 Admin review UI
Create a minimal UI that:
- Lists documents per application
- Allows download
- Allows approve/reject with note

Rules:
- No advanced UI polish required
- Functional verification only

---

## 8) Testing & Verification

### 8.1 Backend checks
- Parent cannot upload to non-owned application
- Parent cannot upload when status not allowed
- Parent cannot download documents
- Admin can download documents
- Review status updates correctly

### 8.2 Manual flow
1. Parent uploads documents
2. Admin lists and downloads documents
3. Admin approves/rejects documents
4. Parent cannot download any file

---

## 9) Acceptance Criteria

This task is complete when:
- Parents can upload documents securely
- Admins can view and download documents
- Document review status is persisted
- Access rules are enforced correctly
- No application approval logic exists yet

---

## 10) Guardrails
- Do not allow parent document download
- Do not auto-approve documents
- Do not implement application approval
- Do not expose file storage keys
- Do not add new document types beyond the fixed enum

---

## 11) Task Completion Rule
Once completed:
- Document handling is stable
- Admins can review document completeness
- Project is ready for **Task 07: Admin Review & Decision**

---

### Status
Ready for execution in Cursor

