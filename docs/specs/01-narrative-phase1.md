# 01 — Narrative Specification (Phase 1)

## 0) Purpose
This document defines the business intent, domain rules, and behavioral expectations for Phase 1 of the Student Registration & Administration system.

It explains what the system must do and why, without describing implementation details.

---

## 1) Phase 1 Objective
Phase 1 establishes a controlled registration workflow that allows:
- Parents to apply for student admission
- Administrators to review and decide on applications
- Secure handling of confidential documents
- Creation of student records upon approval

Phase 1 focuses on registration only.

---

## 2) Actors and Roles

### Parent
- Submits pre-registration
- Completes full registration after invitation
- Uploads required documents
- Manages applications for one or more students

Parents may not download documents or access other users’ data.

### Admin
- Manages registration periods
- Reviews pre-registrations
- Sends invitations
- Reviews full registrations and documents
- Approves or rejects applications
- Creates student records
- Exports student data

Admins may operate even when registration periods are closed.

---

## 3) Registration Period
All applications belong to a registration period.

Rules:
- Only one period is active at a time
- When OPEN: parents may submit and edit
- When CLOSED: parent actions blocked, admin actions allowed

---

## 4) Application Lifecycle

There is one canonical application lifecycle.

### Phases
1. Pre-registration (email-based, no account)
2. Invitation & account creation
3. Full registration (draft → submit)
4. Admin review
5. Student creation on approval

---

## 5) Status Model
Supported statuses:
- DRAFT
- SUBMITTED
- UNDER_REVIEW
- CHANGES_REQUESTED
- APPROVED
- REJECTED

Parents may edit only in DRAFT or CHANGES_REQUESTED.

---

## 6) Parent–Student Relationship
- One parent may manage multiple applications
- One application represents one student
- Student exists only after approval

---

## 7) Documents
- Documents are confidential
- Parents may upload but not download
- Admins may view and download
- Document types are fixed in code

---

## 8) Change Requests
Admins may re-open submitted applications for correction.

---

## 9) Non-Goals
Phase 1 does not include:
- Payments
- Academic lifecycle
- Audit trails
- Advanced automation

---

### Status
Stable for Phase 1
