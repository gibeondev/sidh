# adr-000: API Bootstrap Without Database Connection

## Context
During repository bootstrap (Task 00), the backend API is expected to start reliably in local development and CI environments. At this stage of the system lifecycle, database infrastructure may not be available, configured, or required.

The API uses Prisma as its ORM, which by default may attempt to establish a database connection during application startup.

## Options Considered

### Option 1: Require database connectivity during API startup
The API would attempt to connect to the database as part of its bootstrap process.

### Option 2: Defer database connectivity until explicitly required
The API would configure Prisma but avoid establishing a database connection during application startup.

## Decision
The API will start without requiring a database connection. Prisma will not automatically connect to the database during application startup.

## Rationale
Requiring database connectivity during bootstrap introduces unnecessary coupling to external infrastructure and increases friction during early development and CI execution. Deferring database connectivity improves reliability, developer experience, and task isolation.

## Consequences
- The API can boot in environments where no database is available.
- Health checks and infrastructure validation can run independently of persistence.
- Database connectivity must be explicitly initiated when required in later tasks.
