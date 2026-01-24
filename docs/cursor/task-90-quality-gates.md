# Task 90 — Quality Gates (Phase 1)

## 0) Purpose
This task applies **quality gates** across the Phase 1 codebase.

It focuses on:
- Correctness
- Security
- Stability
- Maintainability

No new business features are introduced.

---

## 1) Scope

### 1.1 In Scope
Backend (apps/api):
- Validation coverage review
- Authorization enforcement verification
- Error handling normalization
- Transaction safety checks
- Basic automated tests (unit + minimal integration)

Frontend (apps/web):
- Build stability
- Type safety checks
- Basic flow verification (manual or lightweight tests)

Repo-wide:
- Linting
- Type checking
- Environment validation
- Documentation sanity checks

### 1.2 Out of Scope
- Performance tuning
- Load testing
- End-to-end browser automation
- CI/CD pipelines (optional if already present)
- Phase 2 refactors

---

## 2) Inputs (Authoritative Specs)
Review and enforce consistency with:
- `docs/specs/01-narrative-phase1.md`
- `docs/specs/02-contract-skeleton-phase1.md`
- `docs/specs/03-rbac-matrix-phase1.md`
- `docs/specs/04-api-surface-phase1.md`
- `docs/specs/05-data-dictionary-phase1.md`
- `docs/specs/06-status-transitions-phase1.md`
- `docs/specs/08-technical-architecture-phase1.md`
- All `docs/cursor/task-*.md` (Tasks 00–08)

---

## 3) Backend Quality Gates

### 3.1 Validation coverage
Ensure:
- All write endpoints have DTOs
- Required fields enforced per Data Dictionary
- Submit endpoints enforce full validation
- Partial updates allow partial validation

---

### 3.2 Authorization & RBAC
Verify:
- All admin endpoints require ADMIN role
- Parent endpoints enforce ownership checks
- Public endpoints expose no sensitive data
- Registration period CLOSED blocks parent/public writes

Add missing guards where necessary.

---

### 3.3 Status transition enforcement
Verify:
- All application status transitions match `06-status-transitions-phase1.md`
- Invalid transitions are rejected with clear errors
- Terminal states (APPROVED, REJECTED) are immutable

---

### 3.4 Transaction safety
Ensure transactional boundaries for:
- Application approval → student creation
- Invitation acceptance → user + application linking
- Any multi-write operation with side effects

---

### 3.5 Error handling consistency
Normalize:
- 400 / 422 for validation errors
- 401 for unauthenticated
- 403 for unauthorized
- 404 for missing resources
- 409 / 422 for invalid state transitions

Ensure no internal errors or stack traces are leaked.

---

## 4) Frontend Quality Gates

### 4.1 Build & type safety
Ensure:
- `pnpm build` passes for web and api
- No TypeScript `any` leakage in critical paths
- API client types align with backend responses

---

### 4.2 Flow sanity checks
Manually verify:
- Pre-registration → invitation → login → full registration → submit
- Document upload → admin review
- Admin approve → student appears → export works

No UI polish required.

---

## 5) Automated Tests (Minimal but Meaningful)

### 5.1 Backend tests (required minimum)
Add tests for:
- Auth login/logout/me
- Registration period open/close behavior
- Pre-registration creation
- Application submit transition
- Admin approve → student creation
- RBAC denial cases (parent accessing admin endpoint)

Tests may be:
- Unit tests
- Lightweight integration tests (preferred)

---

### 5.2 Frontend tests (optional)
Optional:
- Smoke test for key pages
- Build-time checks only

---

## 6) Linting & Formatting

Ensure:
- ESLint configured and passing
- Prettier (if used) consistent
- No unused imports or dead code in core paths

---

## 7) Environment & Configuration

Verify:
- All required env vars are documented
- Missing env vars fail fast with clear errors
- No secrets committed to repo
- Dev and prod configs are clearly separated

---

## 8) Documentation Sanity Check

Ensure:
- Specs reflect actual behavior
- Task files are not contradicted by implementation
- README (if present) reflects how to run the project

If discrepancies are found:
- Update specs OR code intentionally
- Do not leave silent drift

---

## 9) Acceptance Criteria

This task is complete when:
- All builds pass (`pnpm build`, `pnpm dev`)
- Core flows work end-to-end
- No critical authorization gaps exist
- Status transitions are enforced correctly
- Student export is stable
- No known spec violations remain

---

## 10) Guardrails
- Do not introduce new features
- Do not refactor architecture
- Do not add Phase 2 capabilities
- Fix issues surgically and intentionally

---

## 11) Task Completion Rule
Once completed:
- Phase 1 is considered **production-ready**
- Any further work belongs to Phase 2 or maintenance

---

### Status
Ready for execution in Cursor
