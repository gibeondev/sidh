# Task UI — Add Step 4 Indicator & Align Stepper

## Purpose
Add a 4th step ("KONFIRMASI") to the shared Stepper component and ensure the Stepper aligns perfectly with the form container in the pre-registration flow.

This improves structural completeness of the flow while keeping the existing UI visually unchanged.

## Scope
- Update shared Stepper component to support 4 steps.
- Ensure correct active step state for:
  - /pre-register/step-2
  - /pre-register/step-3
- Align Stepper width with the form container below.
- Slightly expand max-width only if necessary to prevent wrapping.

Out of scope:
- Business logic changes
- Navigation flow changes
- Validation updates
- Any modifications inside apps/web/app/pre-register/step-2/

## Inputs
- Figma MCP frames (when available)
- UI guidelines (09-ui-guidelines-phase1.md)
- UI routes map (10-ui-routes-and-pages-phase1.md)

## Deliverables
- Stepper renders 4 steps:
  1. PROSEDUR PENDAFTARAN
  2. DATA ORANG TUA/ WALI SISWA
  3. IDENTITAS SISWA
  4. KONFIRMASI
- Step 2 page shows step 2 active.
- Step 3 page shows step 3 active.
- Step 4 visible but inactive.
- Stepper and form container share the same horizontal alignment.
- No visual regression in Step 2.

## Acceptance Criteria
- All 4 steps render in a single horizontal row on desktop.
- No wrapping or layout break.
- Stepper left/right edges match the form container.
- No changes to existing behavior.
- Typecheck and lint pass.
- Routes render correctly:
  - /pre-register/step-2
  - /pre-register/step-3

## Notes
This is a shared component update with medium UI risk.
Make minimal structural changes only.
Do not introduce new UI libraries.
Keep styling, spacing rhythm, and design language identical.
