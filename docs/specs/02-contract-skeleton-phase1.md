# 02 — Contract Skeleton (Phase 1)

## 0) Purpose
This document defines the authoritative data shapes, relationships, enums, status transitions, and API surface for Phase 1.

It prevents structural ambiguity during implementation.

---

## 1) Roles
- ADMIN
- PARENT

---

## 2) Core Rules
- One parent → many applications
- Student created only after application approval
- Registration period closure blocks parent actions
- Invitation linking uses token primary, email secondary

---

## 3) Enums

### ApplicationStatus
- DRAFT
- SUBMITTED
- UNDER_REVIEW
- CHANGES_REQUESTED
- APPROVED
- REJECTED

### DocumentType
Fixed enum defined in code (see data dictionary).

---

## 4) Core Entities (Summary)
- users
- registration_periods
- applications
- application_pre_registrations
- registration_submissions
- application_contacts
- documents
- students

All fields and required flags are defined in the data dictionary.

---

## 5) Status Transitions

### Parent
- DRAFT → SUBMITTED
- CHANGES_REQUESTED → SUBMITTED

### Admin
- SUBMITTED → UNDER_REVIEW
- UNDER_REVIEW → APPROVED
- UNDER_REVIEW → REJECTED
- SUBMITTED/UNDER_REVIEW → CHANGES_REQUESTED

---

## 6) API Surface (Skeleton)
- Public: pre-registration, active period
- Auth: invitation accept, login/logout
- Parent: application CRUD, submit, upload
- Admin: review, approve/reject, download, export

---

### Status
Frozen for Phase 1
