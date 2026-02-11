# 10 — UI Routes & Pages (Phase 1)

## 0) Purpose
This document defines the **intended page routes** for Phase 1.

It provides a shared map of public, parent, and admin pages without prescribing detailed UX.

---

## 1) Public Routes
| Route | Purpose |
|---|---|
| `/` | Public landing (minimal) |
| `/pre-register` | Pre-registration form (Task 03) |
| `/login` | Login form (Task 01) |
| `/invite/[token]` | Invitation acceptance (Task 04) |

---

## 2) Parent Routes (PARENT only)
| Route | Purpose |
|---|---|
| `/parent` | Parent home (optional, minimal) |
| `/parent/applications` | List own applications |
| `/parent/applications/[id]` | Application detail (read-only summary) |
| `/parent/applications/[id]/wizard` | Full registration wizard (Task 05) |
| `/parent/applications/[id]/documents` | Document upload page (Task 06) |

---

## 3) Admin Routes (ADMIN only)
| Route | Purpose |
|---|---|
| `/admin` | Admin home (optional, minimal) |
| `/admin/registration-periods` | Period management (Task 02) |
| `/admin/applications` | Applications list (Task 07) |
| `/admin/applications/[id]` | Application review + decision (Task 07) |
| `/admin/students` | Students list + export (Task 08) |

---

## 4) Route Guarding Rules
- Parent routes require authenticated role = PARENT
- Admin routes require authenticated role = ADMIN
- Public routes must not expose sensitive data
- Backend remains the source of truth for authorization

---

### Status
Active — Phase 1 route map
