# ADR-000: API Bootstrap Without Database Connection

## Context
During Task 00 (repository bootstrap), the backend API must be able to start reliably in local development and CI environments. At this stage, database infrastructure may not be available or required.

The API uses Prisma as its ORM, which may attempt to establish a database connection during application startup.

## Options Considered

### Option 1: Require database connectivity during API startup
The API connects to the database as part of its bootstrap process.

### Option 2: Defer database connectivity until explicitly required
The API configures Prisma but does not establish a database connection during application startup.

## Decision
The API will start without requiring a database connection. Prisma will not automatically connect to the database during application startup.

## Rationale
Requiring database connectivity during bootstrap introduces unnecessary coupling to external infrastructure and increases friction during early development and CI execution. Deferring database connectivity improves reliability, developer experience, and task isolation.

## Consequences
- The API can boot without a running database.
- Health checks and infrastructure validation can run independently of persistence.
- Database connectivity must be explicitly initiated in later tasks when required.
