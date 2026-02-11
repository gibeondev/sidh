# 09 — UI Guidelines (Phase 1)

## 0) Purpose
This document defines **UI conventions and guardrails** for Phase 1.

It ensures UI work stays consistent across tasks while remaining lightweight.
It does not define pixel-perfect design.

---

## 1) UI Principles
- Prioritize correctness and clarity over visual polish
- Keep screens minimal and functional
- Avoid feature creep: implement only what the current task requires
- Use consistent patterns for forms, errors, and loading states

---

## 2) Technology Constraints
Frontend stack is fixed:
- Next.js App Router
- React
- Tailwind CSS
- shadcn/ui components

---

## 3) Layout & Navigation

### 3.1 Areas
UI is divided into:
- **Public**: unauthenticated pages
- **Parent**: authenticated PARENT pages
- **Admin**: authenticated ADMIN pages

### 3.2 Minimal navigation
- Public pages: minimal header
- Parent pages: simple nav links (Applications, Logout)
- Admin pages: simple nav links (Periods, Applications, Students, Logout)

Navigation should not expose unauthorized pages as functional access; backend enforces authorization.

---

## 4) Forms & Validation

### 4.1 Form libraries
- Use a consistent form approach across the app
- Prefer a single form library (recommended: react-hook-form)

### 4.2 Validation alignment
- Frontend validation should mirror backend validation rules
- Backend is the source of truth
- Frontend validation is for UX only

### 4.3 Field requirements
- Required fields must be visibly indicated
- Submit should show clear missing-field errors

---

## 5) API Client & Data Fetching

### 5.1 API client
- Centralize API calls in a small client layer
- Avoid scattering fetch logic throughout components

### 5.2 Auth cookies
- Auth is cookie-based (httpOnly)
- Ensure requests include credentials where required

### 5.3 Error handling
- Standardize error mapping:
  - 401 → redirect to login (except public routes)
  - 403 → show access denied
  - 422/400 → show field errors
  - 500 → generic error

---

## 6) Loading, Empty, and Error States
Every page that loads data must have:
- Loading state
- Empty state
- Error state

Use simple shadcn/ui components.

---

## 7) Accessibility (Minimum)
- Proper labels for inputs
- Keyboard accessible buttons and dialogs
- Clear focus states (Tailwind defaults acceptable)

---

## 8) UI Scope Discipline
UI work must follow the same discipline as backend:
- Only implement screens required for the active task
- Do not build future screens early
- If a backend endpoint is missing, implement backend first

---

### Status
Active — Phase 1 UI conventions
