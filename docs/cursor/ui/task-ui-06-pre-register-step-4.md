# Task UI — Pre-registration Step 4 (Ringkasan & Konfirmasi)

## Purpose
Implement **Pre-registration Step 4** based on the **selected Figma frame via MCP**.
Step 4 is the final confirmation step that:
- displays a **read-only summary** of everything filled in Steps 1–3
- includes a confirmation checkbox
- submits the pre-registration (POST) and redirects to success (if API wiring task is already active)

UI must match the existing pre-register steps (Indonesian language, same layout, same shared components).

## Scope

### In Scope
- Create/update `apps/web/app/pre-register/step-4/page.tsx` (replace placeholder if exists)
- Implement a Step 4 component under `apps/web/components/pre-register/` (or existing steps folder)
  - Suggested name: `ReviewConfirmStep.tsx` or `PreRegisterStep4.tsx`
- Use canonical shared components:
  - `PreRegisterHeader`
  - `Stepper`
  - `Banner` (only if consistently used)
  - `StepActions`
  - `FormRow`
- Render a **summary view** grouped into sections (no editable inputs):
  - Data Calon Siswa
  - Data Orang Tua / Wali
  - (Optional) Ringkasan Kelengkapan Dokumen (if present in pre-reg scope)
- Add confirmation checkbox:
  - “Saya menyatakan bahwa seluruh data yang saya isi adalah benar dan dapat dipertanggungjawabkan.”
- Navigation:
  - Back → `/pre-register/step-3`
  - Submit button → triggers submit handler (see note below)

### Out of Scope (unless already part of your integration task)
- If API submission is not yet implemented, Step 4 may show a disabled “Kirim” button with TODO note.
- No authentication changes
- No new UI libraries
- No refactor of Step 2

## Inputs
- Selected Figma MCP frame (Step 4)
- UI rules: `.cursor/rules/10-ui-standards.mdc` (+ `.cursor/rules/00-core.mdc`)
- UI specs:
  - `docs/specs/09-ui-guidelines-phase1.md`
  - `docs/specs/10-ui-routes-and-pages-phase1.md`
- If API wiring is included in your current sprint:
  - `docs/specs/11-pre-register-field-mapping.md`

## Deliverables
- Step 4 page that matches the style/layout of other steps (FormRow grid, same spacing, Indonesian)
- Stepper highlights Step 4 correctly
- Summary displays values from shared form state (no data loss when returning from Step 3)
- Confirmation checkbox required before submit is enabled
- Back button works

## Acceptance Criteria
- `pnpm -C apps/web typecheck` passes (or repo equivalent)
- `pnpm dev` runs and these routes render:
  - `/pre-register/step-3`
  - `/pre-register/step-4`
- Step 4 uses existing canonical components and does not introduce duplicates
- No changes or deletions under `apps/web/app/pre-register/step-2/`

## Notes
- Step 4 must be **read-only recap**; edits happen by going back to earlier steps.
- Keep labels and headings in Indonesian.
- If submit integration is already active:
  - Step 4 should call the existing submit function and redirect to `/pre-register/success` on success.
