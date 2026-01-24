# 04 — API Surface (Phase 1)

## 0) Purpose
This document defines the **API surface** for Phase 1 as a stable contract at the level of:
- HTTP method + path
- Audience (PUBLIC / PARENT / ADMIN)
- Primary intent

It does not define DTO schemas (those belong to the Contract Skeleton/Data Dictionary).

---

## 1) Audience Definitions
- **PUBLIC**: unauthenticated
- **PARENT**: authenticated user with role PARENT
- **ADMIN**: authenticated user with role ADMIN

Global rule:
- When registration period is **CLOSED**, block PUBLIC/PARENT write actions (create/edit/submit/upload). Admin actions remain allowed.

---

## 2) Health
| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /health | PUBLIC | Service health check |

---

## 3) Authentication & Session
| Method | Path | Audience | Intent |
|---|---|---|---|
| POST | /auth/login | PUBLIC | Start session (JWT in httpOnly cookie) |
| POST | /auth/logout | PARENT/ADMIN | End session (clear cookie) |
| GET | /auth/me | PARENT/ADMIN | Return current user (id, email, role) |

---

## 4) Invitations (Onboarding)
Invitation rule: **token primary, email secondary**.

| Method | Path | Audience | Intent |
|---|---|---|---|
| POST | /auth/invitations/:token/accept | PUBLIC | Create parent user + link application(s) per rule C |

---

## 5) Registration Periods
| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /public/registration-periods/active | PUBLIC | Get active registration period (if any) |
| GET | /admin/registration-periods | ADMIN | List periods |
| POST | /admin/registration-periods | ADMIN | Create period |
| PATCH | /admin/registration-periods/:id | ADMIN | Update period |
| POST | /admin/registration-periods/:id/close | ADMIN | Close period (blocks parent/public actions) |
| POST | /admin/registration-periods/:id/open | ADMIN | Open period (optional if supporting reopen) |

---

## 6) Applications — Public (Pre-registration)
| Method | Path | Audience | Intent |
|---|---|---|---|
| POST | /public/applications/pre-register | PUBLIC | Create application + pre-registration data (email-based) |

---

## 7) Applications — Parent
| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /parent/applications | PARENT | List own applications |
| GET | /parent/applications/:id | PARENT | Get own application detail |
| PATCH | /parent/applications/:id | PARENT | Update own application (DRAFT/CHANGES_REQUESTED only; period OPEN) |
| POST | /parent/applications/:id/submit | PARENT | Submit own application (DRAFT/CHANGES_REQUESTED only; period OPEN) |

---

## 8) Documents — Parent
Parents can upload only; no download.

| Method | Path | Audience | Intent |
|---|---|---|---|
| POST | /parent/applications/:id/documents | PARENT | Upload document for own application (DRAFT/CHANGES_REQUESTED; period OPEN) |
| GET | /parent/applications/:id/documents | PARENT | List document metadata for own application |

---

## 9) Applications — Admin (Review & Decision)
| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /admin/applications | ADMIN | List applications (filter by period/status/search) |
| GET | /admin/applications/:id | ADMIN | Get application detail |
| POST | /admin/applications/:id/under-review | ADMIN | Set UNDER_REVIEW (optional step) |
| POST | /admin/applications/:id/request-changes | ADMIN | Set CHANGES_REQUESTED (re-open for parent) |
| POST | /admin/applications/:id/approve | ADMIN | Approve application (creates Student) |
| POST | /admin/applications/:id/reject | ADMIN | Reject application (requires decision reason) |

---

## 10) Documents — Admin
Admins can download all documents.

| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /admin/applications/:id/documents | ADMIN | List documents for application |
| GET | /admin/documents/:id/download | ADMIN | Download document file |
| POST | /admin/documents/:id/approve | ADMIN | Mark document approved |
| POST | /admin/documents/:id/reject | ADMIN | Mark document rejected with note |

---

## 11) Students — Admin
| Method | Path | Audience | Intent |
|---|---|---|---|
| GET | /admin/students | ADMIN | List students |
| GET | /admin/students/export.csv | ADMIN | Export students to CSV |

---

## 12) API Naming & Consistency Rules
- Keep path prefixes consistent: `/public`, `/parent`, `/admin`
- Prefer nouns for resources and POST for transitions
- Do not introduce new endpoints outside this document without updating the contract

---

### Status
Frozen for Phase 1
