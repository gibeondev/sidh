# Task 00 — Repository Bootstrap (Phase 1)

## 0) Purpose
Initialize the technical foundation for Phase 1.

This task sets up the monorepo, tooling, and development environment.
No domain or business logic is implemented.

---

## 1) Scope

### In Scope
- Monorepo setup
- Next.js frontend
- NestJS backend
- Prisma ORM setup
- Shared packages
- Environment configuration
- Health endpoint

### Out of Scope
- Authentication
- Domain entities
- Business APIs
- Authorization
- UI flows

---

## 2) Repository Structure
sidh/
apps/
web/
api/
packages/
types/
config/
prisma/
docs/
specs/
cursor/
decisions/

---

## 3) Tooling
- Package manager: pnpm
- TypeScript (strict)
- Prisma ORM
- PostgreSQL (local, not required during bootstrap)

---

## 4) Frontend (`apps/web`)
- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Simple i18n stub
- Demo page with language toggle

---

## 5) Backend (`apps/api`)
- NestJS
- Centralized config
- PrismaService (no automatic DB connection on startup)
- Health endpoint: GET /health

---

## 6) Environment Files

### API
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/sidh_dev?schema=public
PORT=4000

### Web
NEXT_PUBLIC_API_URL=http://localhost:4000

---

## 7) Acceptance Criteria
- pnpm install works
- pnpm dev runs both apps
- Web loads
- /health returns 200
- API starts without requiring database connectivity

---

## 8) Guardrails
- Do not add domain logic
- Do not add auth
- Do not anticipate future features

---

### Status
Ready for execution in Cursor

