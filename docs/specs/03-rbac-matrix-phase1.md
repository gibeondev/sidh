# 03 — RBAC Matrix (Phase 1)

## 0) Purpose
This document defines **Role-Based Access Control (RBAC)** for Phase 1.

It answers:
- Who can do what
- Under which conditions (status, ownership, registration period)

RBAC is enforced **server-side**. UI visibility is not a security mechanism.

---

## 1) Roles
- **PUBLIC**: unauthenticated user
- **PARENT**: authenticated parent user
- **ADMIN**: authenticated admin user

---

## 2) Global Enforcement Rules

### 2.1 Ownership
- **PARENT** may only access **own** resources:
  - `application.parent_user_id == current_user.id`

### 2.2 Registration period closure
When a registration period is **CLOSED**:
- **PUBLIC/PARENT actions are blocked** (create/edit/submit/upload)
- **ADMIN actions remain allowed** (view/review/decide/export/download)

### 2.3 Application status constraints
- Parent editing/uploading allowed only when:
  - `application.status IN (DRAFT, CHANGES_REQUESTED)`

### 2.4 Documents confidentiality
- **PARENT**: upload only, no download
- **ADMIN**: download allowed

---

## 3) RBAC Matrix — Actions

Legend:
- ✅ Allowed
- ❌ Not allowed
- ⚠️ Allowed with conditions (see notes)

### 3.1 Authentication & Session

| Resource / Action | PUBLIC | PARENT | ADMIN | Conditions / Notes |
|---|---:|---:|---:|---|
| Login | ✅ | ✅ | ✅ | Valid credentials |
| Logout | ⚠️ | ✅ | ✅ | Requires session for meaningful logout |
| Me (session check) | ❌ | ✅ | ✅ | Returns user id/email/role |
| Accept invitation | ✅ | ❌ | ❌ | Token-based onboarding (Invitation Rule C) |

---

### 3.2 Registration Periods

| Resource / Action | PUBLIC | PARENT | ADMIN | Conditions / Notes |
|---|---:|---:|---:|---|
| View active period | ✅ | ✅ | ✅ | Public may need this to know if registration is open |
| Create / update / close period | ❌ | ❌ | ✅ | Admin only |
| View all periods | ❌ | ❌ | ✅ | Admin only |

---

### 3.3 Applications (Core)

| Resource / Action | PUBLIC | PARENT | ADMIN | Conditions / Notes |
|---|---:|---:|---:|---|
| Create pre-registration (new application) | ✅ | ✅ | ✅ | Blocked if period CLOSED for PUBLIC/PARENT |
| View application list | ❌ | ✅ | ✅ | Parent: own only |
| View application detail | ❌ | ✅ | ✅ | Parent: own only |
| Edit application (draft changes) | ❌ | ⚠️ | ✅ | Parent: own + status DRAFT/CHANGES_REQUESTED + period OPEN |
| Submit application | ❌ | ⚠️ | ✅ | Parent: own + status DRAFT/CHANGES_REQUESTED + period OPEN |
| Request changes (re-open) | ❌ | ❌ | ✅ | Admin only; sets CHANGES_REQUESTED |
| Approve application | ❌ | ❌ | ✅ | Admin only; creates Student |
| Reject application | ❌ | ❌ | ✅ | Admin only; requires decision reason |
| Set UNDER_REVIEW | ❌ | ❌ | ✅ | Admin only (optional step) |

---

### 3.4 Documents & Files

| Resource / Action | PUBLIC | PARENT | ADMIN | Conditions / Notes |
|---|---:|---:|---:|---|
| Upload document to application | ❌ | ⚠️ | ✅ | Parent: own + status DRAFT/CHANGES_REQUESTED + period OPEN |
| View document metadata | ❌ | ⚠️ | ✅ | Parent: own (metadata only); Admin: all |
| Download document file | ❌ | ❌ | ✅ | Admin only |
| Review document (approve/reject + note) | ❌ | ❌ | ✅ | Admin only |

---

### 3.5 Students

| Resource / Action | PUBLIC | PARENT | ADMIN | Conditions / Notes |
|---|---:|---:|---:|---|
| View student list | ❌ | ❌ | ✅ | Admin only |
| View student detail | ❌ | ❌ | ✅ | Admin only |
| Create student | ❌ | ❌ | ✅ | System action triggered by approve application |
| Export students (CSV) | ❌ | ❌ | ✅ | Admin only |

---

## 4) Notes for Implementation (Non-Negotiable)

### 4.1 RBAC must be enforced at API level
- Guards enforce role and authentication
- Services enforce ownership and status constraints

### 4.2 Parent access pattern
- All parent endpoints must scope by `parent_user_id = current_user.id`
- Never allow parent to specify arbitrary IDs without ownership checks

### 4.3 Period closure enforcement
- Parent/Public must be blocked consistently when period is CLOSED
- Admin remains allowed

---

### Status
Frozen for Phase 1
