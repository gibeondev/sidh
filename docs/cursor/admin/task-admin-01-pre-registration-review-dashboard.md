You are implementing: docs/specs/task-04-admin-application-review.md

Goal:
Build a production-grade Admin Dashboard UI for reviewing submitted pre-registration applications ONLY (no invitation/full registration/documents/student creation).

Hard rules:
- Use Next.js App Router with an (admin) route group and a dedicated admin layout (no mixing with public layouts).
- Use Tailwind + shadcn/ui components.
- Use the centralized API client (apps/web/lib/api/client.ts) for all API calls.
- Reuse components; no UI duplication.
- Enforce that Reject and Request Changes require a note before submission.
- After Approve succeeds, show a prominent UI-only banner: “Next step: Invitation onboarding (not implemented yet)”.

Backend endpoints to integrate:
- GET /admin/applications
- GET /admin/applications/:id
- POST /admin/applications/:id/approve
- POST /admin/applications/:id/reject
- POST /admin/applications/:id/request-changes

Deliver:
1) app/(admin)/layout.tsx with sidebar nav (Dashboard, Applications, Registration Periods) and consistent container styling.
2) /admin/applications list page with status filter, table, loading/empty/error states.
3) /admin/applications/[id] detail page rendering pre-registration fields grouped into readable sections, with decision panel + validations + success states.
4) Shared reusable UI components (StatusBadge, AdminPageHeader, DecisionPanel, etc.) in the project’s shared component conventions.

Do not implement:
- invitation onboarding
- email sending
- document upload/viewing
- student creation
- export

Proceed to implement with clean code, types, and consistent styling.
