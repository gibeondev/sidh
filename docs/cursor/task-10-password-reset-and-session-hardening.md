# Task 10 — Password Reset & Session Hardening (Future)

## 0) Purpose
This task introduces **password recovery and session hardening** features that are **intentionally excluded from Phase 1**.

It exists as a placeholder to:
- Make the omission explicit
- Prevent ad-hoc implementations
- Provide a clear future implementation boundary

This task must **not** be executed as part of Phase 1.

---

## 1) Status
🚧 **Deferred** — Planned for Phase 1.5 or Phase 2

---

## 2) Scope (When Activated)

### 2.1 In Scope
- Forgot password request flow
- Password reset via secure, single-use token
- Token expiration handling
- Email-based delivery
- Password reset confirmation
- Optional session hardening:
  - refresh tokens
  - remember-me support
  - session revocation

---

### 2.2 Out of Scope
- Phase 1 registration flows
- Invitation onboarding
- Admin review logic
- Student lifecycle features

---

## 3) High-Level Requirements (Preview Only)

### 3.1 Forgot password
- Public endpoint to request password reset
- No account enumeration
- Rate limiting

---

### 3.2 Reset password
- Token-based reset (hashed tokens)
- Expiration window
- One-time use only
- Strong password validation

---

### 3.3 Session management
- Optional refresh token strategy
- Ability to invalidate sessions
- Secure cookie handling

---

## 4) Non-Goals (Explicit)
- No implementation in Phase 1
- No partial or hidden implementations
- No “quick fixes” added to auth foundation

---

## 5) Activation Rule
This task may only be executed when:
- Phase 1 is completed
- Password policy is reviewed
- Email delivery strategy is finalized

---

### Status
Deferred — Not for Phase 1 execution
