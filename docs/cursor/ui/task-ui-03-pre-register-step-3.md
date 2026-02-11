# Task UI — Pre-registration Step 3

## Purpose
Implement **Pre-registration Step 3 UI** using the selected Figma frame via MCP, following the existing pre-register Step 2 architecture and shared components.

This task delivers a working Step 3 page that matches the established Indonesian, 2-column form layout pattern.

---

## Scope

### In Scope
- Create `apps/web/app/pre-register/step-3/page.tsx` (or update if placeholder exists)
- Implement Step 3 form UI using existing shared components:
  - `PreRegisterHeader`
  - `Stepper`
  - `Banner` (only if used consistently across steps)
  - `StepActions`
  - `FormRow`
- Create/implement a Step 3 component under `apps/web/components/pre-register/` (or `components/pre-register/steps/` if already adopted):
  - Example name: `AssignmentStep.tsx` or `PreRegisterStep3.tsx`
- Implement **minimal UI logic** only:
  - react-hook-form for field handling
  - Back/Next navigation (no API integration)
  - Maintain Indonesian labels as the canonical UI language
- Ensure consistent styling and layout with Step 2

### Out of Scope
- No API integration (no POST/PATCH yet)
- No authentication/login changes
- No new UI libraries
- No changes to Step 2 route content
- No refactors outside pre-register components unless required for consistency

---

## Inputs
- Selected Figma frame via MCP (Step 3)
- `docs/specs/09-ui-guidelines-phase1.md`
- `docs/specs/10-ui-routes-and-pages-phase1.md`
- `.cursor/rules/00-core.mdc`
- `.cursor/rules/10-ui-standards.mdc`

---

## Implementation Rules (Must Follow)

### Layout & components
- All fields must be rendered through `FormRow` (two-column layout).
- Do not stack labels above inputs unless the Figma frame explicitly demands it.
- Do not create duplicate versions of Stepper/Banner/Header.
- Step page orchestrates; Step component renders fields and calls handlers.

### Form logic
- Use `react-hook-form` consistently (same approach as Step 2).
- Step 3 must operate on the same overall pre-registration form shape (even if stored locally for now).
- Validation is UX-only (backend will enforce later).

### MCP usage
- Use MCP output as layout reference.
- If MCP suggests new layout primitives that conflict with our FormRow/Stepper approach, keep our approach.

---

## Deliverables
- Step 3 page renders without errors and looks consistent with Step 2
- Stepper highlights Step 3 correctly
- Navigation buttons work:
  - Back → Step 2
  - Next → Step 4 (placeholder is acceptable if Step 4 not implemented yet)
- No new duplicate components created

---

## Acceptance Criteria
- `pnpm -C apps/web typecheck` passes (or repo equivalent)
- `pnpm dev` runs and these routes render:
  - `/pre-register/step-2`
  - `/pre-register/step-3`
- Step 3 uses canonical shared components and FormRow layout
- No changes to files under `apps/web/app/pre-register/step-2/`

---

## Notes
- Keep Indonesian labels as canonical.
- If Step 3 introduces new field types (date/select), use shadcn/ui equivalents consistently.
