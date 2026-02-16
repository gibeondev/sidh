# Task UI — Full Registration Wizard

## Purpose

Implement the Full Registration multi-step wizard using the Pre-registration module as the architectural and UI blueprint.

The Full Registration Wizard must:
- Follow the exact same layout, look & feel, spacing, typography and structure as Pre-registration.
- Use the same shared component strategy (FormRow, Stepper, Header, StepActions).
- Use react-hook-form with a single shared form state across all steps.
- Include field-level validation before allowing navigation to the next step.
- Map fields exactly to the MCP Desktop Figma design.
- Persist data only on final submit (or draft-save if backend supports it).

This task builds the complete parent-side full registration flow.

---

## Blueprint Reference (Mandatory)

Use the working Pre-registration implementation as reference:

- Same FormRow 2-column layout
- Same Stepper visual structure
- Same header positioning
- Same button placement
- Same spacing scale
- Same Tailwind + shadcn usage
- Same react-hook-form pattern
- Same centralized API client structure

Full registration must feel like the same product — just extended.

---

## Scope

### In Scope

Frontend only (apps/web):

1) Create full registration route group:
   app/(parent)/applications/[id]/wizard/
     step-1/page.tsx
     step-2/page.tsx
     step-3/page.tsx
     step-4/page.tsx
     step-5/page.tsx (if required by MCP design)

2) Implement shared layout:
   - wizard/layout.tsx
   - Wrap all steps with a single FormProvider (react-hook-form)

3) Implement shared wizard components:
   - Reuse existing FormRow
   - Reuse Stepper pattern (adapt number of steps)
   - Reuse StepActions
   - Reuse Header structure
   - Do NOT create duplicate component variants

4) Implement step components under:
   components/full-registration/steps/

   Suggested structure:
   - StudentDataStep.tsx
   - ParentGuardianStep.tsx
   - AddressStep.tsx
   - EducationHistoryStep.tsx
   - ReviewSubmitStep.tsx

5) Validation
   - Each step must validate required fields before allowing navigation to next step.
   - Use react-hook-form validation (no new validation library).
   - Do not allow Next if invalid.
   - Show field-level error messages.

6) Field Mapping
   - Field names and types must match the selected MCP Desktop Figma design.
   - Payload mapping must follow backend DTO (if already defined).
   - Do NOT guess field names.

7) Submission
   - Final step submits full registration via API.
   - Use centralized API client:
     apps/web/lib/api/fullRegistration.ts
   - Show loading state.
   - Redirect or show success message based on backend behavior.

---

## Out of Scope

- Backend schema changes
- Invitation flow changes
- Admin review logic
- Document upload (unless included in MCP step design)
- New UI libraries

---

## Inputs

- Selected MCP Desktop frames (Full Registration Steps)
- docs/specs/09-ui-guidelines-phase1.md
- docs/specs/10-ui-routes-and-pages-phase1.md
- Existing Pre-registration implementation (blueprint)
- Backend DTO for full registration (if available)

---

## UI & Architecture Rules (Mandatory)

1) Do NOT break Pre-registration.
2) Do NOT duplicate Stepper/Header/FormRow.
3) Use same spacing and visual rhythm.
4) Use same 2-column FormRow grid layout.
5) Use shadcn inputs consistently.
6) All API calls must go through lib/api.
7) No inline fetch calls in components.
8) Keep Indonesian labels consistent.

---

## Validation Rules

- Required fields must block Next.
- Email must match standard email pattern.
- Date fields must be valid dates.
- Numeric identifiers must be numeric only.
- Phone numbers must allow digits and optional "+".
- Select fields must require valid option.
- Cross-field validation where required (e.g., date ranges).

At the end of implementation, output:
- A list of all fields and their validation rules.

---

## Deliverables

- Multi-step full registration wizard.
- Shared form state across steps.
- Proper step validation before navigation.
- Final submission wired to backend.
- No UI duplication.
- Visual consistency with Pre-registration.

---

## Acceptance Criteria

- pnpm typecheck passes.
- Full flow works:
  Step 1 → Step 2 → Step 3 → Step 4 → Submit.
- No data loss when navigating back and forth.
- All validations block navigation correctly.
- API submission succeeds (if backend ready).
- UI matches Pre-registration style 1:1.

---

## Notes

This module must look and behave as a natural continuation of Pre-registration.

It is not a redesign — it is an expansion.
