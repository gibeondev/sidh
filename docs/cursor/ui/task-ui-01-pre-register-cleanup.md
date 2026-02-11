# Task UI — Pre-registration Step 1

## Purpose
Implement **Pre-registration Step 1 UI** using the selected Figma frame via MCP, following the established pre-register Step 2 patterns (Indonesian UI, 2-column `FormRow` layout, reusable header/stepper/actions).

Step 1 should capture the “initial applicant / student overview” information as designed in Figma and prepare the user to continue to Step 2.

---

## Scope

### In Scope
- Create or update `apps/web/app/pre-register/step-1/page.tsx`
  - If a placeholder exists, replace it with the real UI.
- Implement a Step 1 form component under:
  - `apps/web/components/pre-register/` (or an existing `steps/` subfolder if you already use one)
  - Suggested name: `ApplicantStudentStep.tsx` or `PreRegisterStep1.tsx`
- Use canonical shared components:
  - `PreRegisterHeader`
  - `Stepper`
  - `Banner` (only if used consistently across steps; keep consistent)
  - `StepActions`
  - `FormRow`
- Implement **minimal UI logic only**:
  - Use `react-hook-form` for form state and validation (UX-only)
  - Back/Next navigation:
    - Back can return to `/pre-register` or be hidden/disabled (depending on your existing pattern)
    - Next navigates to `/pre-register/step-2`
- Keep Indonesian display text as canonical.

### Out of Scope
- No API integration (no POST yet)
- No auth/login work
- No backend changes
- No visual redesign outside the selected frame
- No changes to `apps/web/app/pre-register/step-2/*`

---

## Inputs
- Selected Figma frame via MCP (Pre-register Step 1)
- UI guidelines: `docs/specs/09-ui-guidelines-phase1.md`
- UI routes map: `docs/specs/10-ui-routes-and-pages-phase1.md`
- Cursor rules:
  - `.cursor/rules/00-core.mdc`
  - `.cursor/rules/10-ui-standards.mdc`

---

## Implementation Rules (Must Follow)

### Layout consistency
- All fields must be rendered using `FormRow` (2-column alignment).
- No stacked label-above-input layout unless explicitly required by the frame.
- Reuse existing shared components; do not create new duplicates.

### Form & state
- `page.tsx` orchestrates state and navigation.
- Step component renders fields and calls `onChange` / uses RHF field bindings.
- Validation is UX-only; backend remains the source of truth later.

### MCP usage
- Use MCP output as layout reference.
- If MCP suggests conflicting layout primitives, keep the established `FormRow` + shared component approach.

---

## Deliverables
- Step 1 page renders without errors and matches the Figma frame structure.
- Stepper highlights Step 1 correctly.
- “Next” advances to `/pre-register/step-2`.
- No duplicate stepper/banner/header components exist after implementation.

---

## Acceptance Criteria
- `pnpm -C apps/web typecheck` passes (or repo equivalent)
- `pnpm dev` runs and these routes render:
  - `/pre-register/step-1`
  - `/pre-register/step-2`
- No changes to files under `apps/web/app/pre-register/step-2/`
- UI remains consistent with the established Step 2 Indonesian, 2-column form layout pattern.

---

## Notes
- Keep Indonesian labels as the canonical text.
- Use shadcn/ui components for inputs/selects/radios consistent with Step 2.
- If `/pre-register/page.tsx` currently acts as a temporary Step 1, do not remove it in this task; only ensure `/pre-register/step-1` is correct and functional.
