# Pre-Registration Screen — Component Tree

Based on the Figma frame "New Student Pre-Registration Form" (step 2: Student Parent / Guardian Data).

## 1. Component tree overview

```
PreRegisterPage (app/pre-register/page.tsx)
├── PreRegisterHeader
│   └── Logo placeholder + "Sekolah Indonesia di Nederland"
│   └── Title: "New Student Pre-Registration Form"
├── PreRegisterStepper
│   └── Step 1: Registration procedure
│   └── Step 2: Student parent / guardian data (active)
│   └── Step 3: Student identity
├── PreRegisterBanner
│   └── "Pre-Registration Form for SPMB & Transfer of Even Semester Academic Year 2025/2026 SIDH"
└── <form>
    ├── [Step 1] Registration procedure (intro copy)
    ├── [Step 2] ParentGuardianForm
    │   ├── Section heading: "STUDENT PARENT / GUARDIAN DATA"
    │   ├── Input (applicant email)
    │   ├── Input (type of assignment / reason living abroad)
    │   ├── Input (motivation for enrolling in SIDH)
    │   ├── RadioGroup (relationship: Father / Mother / Guardian)
    │   ├── Input (parent/guardian name)
    │   ├── Input (address of domicile)
    │   ├── Select (country)
    │   ├── Input (planned domicile period start)
    │   ├── Input (planned domicile period end)
    │   └── Input (visa/residence permit validity date)
    ├── [Step 3] Student identity (placeholder)
    └── StepActions
        ├── Back (link to home on step 1, else previous step)
        └── Next / Submit pre-registration (submit on last step)
```

## 2. Reusable pieces

| Component | Path | Role |
|-----------|------|------|
| **UI primitives** | | |
| Label | `components/ui/label.tsx` | Accessible label with optional required asterisk |
| Input | `components/ui/input.tsx` | Text/date/email input, Tailwind + focus ring |
| Button | `components/ui/button.tsx` | default (primary) and outline variants |
| Select | `components/ui/select.tsx` | Native select with placeholder |
| RadioGroup | `components/ui/radio-group.tsx` | Group of radio options with label |
| **Pre-register layout** | | |
| PreRegisterHeader | `components/pre-register/PreRegisterHeader.tsx` | Logo + title |
| PreRegisterStepper | `components/pre-register/PreRegisterStepper.tsx` | 3-step progress |
| PreRegisterBanner | `components/pre-register/PreRegisterBanner.tsx` | Teal context banner |
| ParentGuardianForm | `components/pre-register/ParentGuardianForm.tsx` | Step 2 form section |
| StepActions | `components/pre-register/StepActions.tsx` | Back / Next (or Submit) |

## 3. Main page

- **File:** `app/pre-register/page.tsx`
- **Behavior:** Client component; holds step (1–3), form state, and submit handler. Renders header, stepper, banner, current step content, and StepActions. Success state shows confirmation and link home.
- **Layout:** Flex/grid; no absolute positioning. Semantic sections with `section` and `aria-labelledby` where appropriate.

## 4. Styling

- Tailwind CSS only (no shadcn installed). UI components use Tailwind classes compatible with a future shadcn migration (e.g. `border-input`, `ring-ring` in `tailwind.config`).
- Accessible: labels linked via `htmlFor`/`id`, `aria-label` on RadioGroup and Select, `aria-current="step"` on active stepper step.
