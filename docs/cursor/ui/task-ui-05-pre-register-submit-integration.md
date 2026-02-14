# Task UI — Pre-registration Form Logic + API Integration

## Purpose
Complete the **end-to-end Pre-registration module** so that users can fill the multi-step UI form and submit it successfully, with data persisted in the database via the backend API.

This task adds:
- Shared multi-step form state (react-hook-form across steps)
- API client integration
- Step 4 submission logic
- Success page
- Frontend field validation (UX-only) aligned with backend DTO and mapping

---

## Scope

### In Scope
Frontend (apps/web):
1) **Single shared form state across steps**
- Implement a single `react-hook-form` provider shared across:
  - `/pre-register/step-1`
  - `/pre-register/step-2`
  - `/pre-register/step-3`
  - `/pre-register/step-4`
- Step pages reuse existing shared components:
  - `PreRegisterHeader`
  - `Stepper`
  - `StepActions`
  - `FormRow`
  - `Banner` (only if consistently used across steps)
- Steps 1–3 write into the same form state
- Step 4 reads state for summary and submits

2) **Centralized API client**
- Create if missing:
  - `apps/web/lib/api/client.ts`
- Add:
  - `apps/web/lib/api/preRegistration.ts`
- Web calls backend **directly** (no Next proxy)
  - Base URL: `http://localhost:4000`

3) **Step 4 submission**
- On Step 4 submit:
  - POST to `POST /public/applications/pre-register`
  - Payload must match field names exactly using the mapping spec
  - Map backend validation errors back to form fields where possible
- On success:
  - redirect to `/pre-register/success`
  - show `applicationNo` reference

4) **Success page**
- Create `apps/web/app/pre-register/success/page.tsx`
- Show:
  - “Terima kasih”
  - “Nomor Pendaftaran: {applicationNo}”
  - Short follow-up note

5) **Frontend validation (UX-only)**
- Use `react-hook-form` validation rules (no new validation libraries)
- Required fields, formats, date logic, numeric rules (as applicable)
- Backend remains source of truth

6) **Validation report**
- At the end, output a checklist:
  - `field_name -> validation rules`

---

## Out of Scope
- Backend changes (DTO/schema changes)
- Authentication/login flow
- Invitation onboarding
- Full registration wizard
- Document upload
- Any new UI libraries
- Next.js API proxy routes

---

## Inputs
- Figma MCP frames (when available)
- UI guidelines: `docs/specs/09-ui-guidelines-phase1.md`
- UI routes map: `docs/specs/10-ui-routes-and-pages-phase1.md`
- **Field mapping (authoritative): `docs/specs/11-pre-register-field-mapping.md`**
- Cursor rules:
  - `.cursor/rules/00-core.mdc`
  - `.cursor/rules/10-ui-standards.mdc`

---

## Hard Constraints (Must Follow)
- Do NOT change or delete anything under:
  - `apps/web/app/pre-register/step-2/`
- Keep Indonesian UI as canonical
- Use Tailwind CSS + shadcn/ui only
- Do not duplicate components (no new Stepper/Banner/Header variants)
- All API calls go through `apps/web/lib/api/*` (no inline fetch in components)

---

## Implementation Rules

### Shared form state
- Prefer a shared provider at the highest reasonable scope for pre-register routes:
  - Either a `layout.tsx` under `app/pre-register/`
  - Or a dedicated wrapper component used by each step page
- The provider must persist state when navigating between steps

### API integration
- Client must handle:
  - JSON requests
  - error parsing
  - returning typed results
- No proxy routes; direct calls to `http://localhost:4000`

### Payload mapping
- Payload field names must match backend DTO exactly
- Use `docs/specs/11-pre-register-field-mapping.md` as the source of truth
- If any field is ambiguous or missing in mapping, stop and ask (no guessing)

### Submit UX
- On success redirect:
  - `/pre-register/success`
- Backend response should contain:
  - `applicationId`
  - `applicationNo`
- Display `applicationNo` on success page

---

## Deliverables
- Central API client and pre-registration API module
- Shared multi-step form provider across steps
- Step 4 submits successfully and persists data in DB
- Success page displays `applicationNo`
- Field-level validation rules implemented
- Validation checklist output at end

---

## Acceptance Criteria
- `pnpm -C apps/web typecheck` passes (or repo equivalent)
- `pnpm dev` runs and the full flow works:
  - `/pre-register/step-1 → step-2 → step-3 → step-4 → submit → /pre-register/success`
- Data is persisted in DB (confirmed by API response + existing DB verification method)
- No changes were made to `apps/web/app/pre-register/step-2/*`
- Final output includes a complete list of frontend validations per field

---

## Notes
- This task is intentionally production-oriented: one finished module > many half-finished parts.
- Backend validation errors should be displayed clearly even if exact field mapping is not possible for all errors.
