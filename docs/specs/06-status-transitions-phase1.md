# 06 — Status Transitions (Phase 1)

## 0) Purpose
This document defines the **authoritative status transitions** for Phase 1.

It specifies:
- Allowed `ApplicationStatus` transitions
- Who can trigger each transition
- Preconditions (registration period state, ownership)
- Side effects (e.g., student creation)

No other transitions are permitted.

---

## 1) Status Enum (ApplicationStatus)
- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `CHANGES_REQUESTED`
- `APPROVED`
- `REJECTED`

---

## 2) Global Preconditions

### 2.1 Ownership
- Parent actions apply only to applications owned by the current parent:
  - `application.parent_user_id == current_user.id`

### 2.2 Registration period closure
When the registration period is **CLOSED**:
- **PUBLIC/PARENT transitions are blocked**
- **ADMIN transitions remain allowed**

### 2.3 Parent editability constraint
Parent may modify application data and upload documents only when:
- `status IN (DRAFT, CHANGES_REQUESTED)`
- AND registration period is OPEN

---

## 3) Allowed Transitions

### 3.1 Parent-triggered transitions

#### T1 — Submit Application
- **From:** `DRAFT` or `CHANGES_REQUESTED`
- **To:** `SUBMITTED`
- **Triggered by:** `PARENT`
- **Preconditions:**
  - Registration period is OPEN
  - Parent owns the application
  - Required fields satisfied per Data Dictionary at submission time
  - Required documents present (Phase 1 rules)
- **Side effects:**
  - Set `submitted_at = now()`
- **Failure cases:**
  - If missing required fields/documents → reject with validation error (400/422)
  - If period CLOSED → 403

---

### 3.2 Admin-triggered transitions

#### T2 — Move to Under Review (optional step)
- **From:** `SUBMITTED`
- **To:** `UNDER_REVIEW`
- **Triggered by:** `ADMIN`
- **Preconditions:**
  - Application exists
- **Side effects:**
  - None required (optional to store review start timestamp)
- **Failure cases:**
  - If current status not SUBMITTED → 409/422

---

#### T3 — Request Changes (re-open)
- **From:** `SUBMITTED` or `UNDER_REVIEW`
- **To:** `CHANGES_REQUESTED`
- **Triggered by:** `ADMIN`
- **Preconditions:**
  - Application exists
- **Side effects:**
  - Optional: store admin note/message (if implemented)
- **Failure cases:**
  - If current status not SUBMITTED/UNDER_REVIEW → 409/422

---

#### T4 — Approve Application
- **From:** `UNDER_REVIEW` (preferred)  
  *(Optionally allow from `SUBMITTED` if admin skips UNDER_REVIEW; if allowed, it must be explicit in implementation.)*
- **To:** `APPROVED`
- **Triggered by:** `ADMIN`
- **Preconditions:**
  - Application exists
  - Application data complete (Phase 1)
  - Document review complete per admin policy (Phase 1)
- **Side effects (mandatory):**
  - Create `Student` record (1:1) derived from the approved application
- **Transactional requirement:**
  - Status update + student creation must be atomic (single transaction)
- **Failure cases:**
  - If already has student → 409
  - If status not allowed → 409/422

---

#### T5 — Reject Application
- **From:** `UNDER_REVIEW` (preferred)  
  *(Optionally allow from `SUBMITTED` if admin skips UNDER_REVIEW; if allowed, it must be explicit in implementation.)*
- **To:** `REJECTED`
- **Triggered by:** `ADMIN`
- **Preconditions:**
  - Application exists
  - `decision_reason` provided (required)
- **Side effects:**
  - Persist `decision_reason`
- **Failure cases:**
  - Missing decision_reason → 400/422
  - Status not allowed → 409/422

---

## 4) Disallowed Transitions (Explicit)
The following are not allowed in Phase 1:
- Any transition from `APPROVED` to any other status
- Any transition from `REJECTED` to any other status
- Parent changing status directly to anything other than SUBMITTED
- Parent editing data in statuses other than `DRAFT` or `CHANGES_REQUESTED`

---

## 5) Transition Summary Table

| Transition | From | To | Actor |
|---|---|---|---|
| T1 Submit | DRAFT / CHANGES_REQUESTED | SUBMITTED | PARENT |
| T2 Under Review | SUBMITTED | UNDER_REVIEW | ADMIN |
| T3 Request Changes | SUBMITTED / UNDER_REVIEW | CHANGES_REQUESTED | ADMIN |
| T4 Approve | UNDER_REVIEW *(or SUBMITTED if explicitly allowed)* | APPROVED | ADMIN |
| T5 Reject | UNDER_REVIEW *(or SUBMITTED if explicitly allowed)* | REJECTED | ADMIN |

---

## 6) Stability Rule
This transition model is **frozen for Phase 1**.

If any transition is added or modified:
- Update this document first
- Then update API surface and RBAC accordingly

---

### Status
Frozen for Phase 1
