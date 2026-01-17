# SIDH - Student Information and Document Hub

Phase 1 Monorepo

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Generate Prisma Client:
   ```bash
   pnpm prisma:generate
   ```

3. Set up environment variables:
   - Copy `apps/api/env.example` to `apps/api/.env` and configure `DATABASE_URL`
   - Copy `apps/web/.env.example` to `apps/web/.env.local` if needed

4. Run database migrations:
   ```bash
   pnpm prisma:migrate
   ```

5. Start development servers:
   ```bash
   pnpm dev
   ```

This will start:
- API server on http://localhost:4000
- Web app on http://localhost:3000

## Project Structure

- `apps/web` - Next.js frontend application
- `apps/api` - NestJS backend application
- `packages/prisma` - Prisma schema and migrations
- `packages/types` - Shared TypeScript types
- `packages/config` - Shared configuration utilities

## Scripts

- `pnpm dev` - Start both apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run Prisma migrations
- `pnpm prisma:studio` - Open Prisma Studio
