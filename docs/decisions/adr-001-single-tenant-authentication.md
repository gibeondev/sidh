# ADR-001: Single-Tenant Authentication Model

## Status
Accepted

## Context
Phase 1 required an authentication foundation (login/logout/me, JWT cookies, role-based authorization). A multi-tenant or multi-vendor model would introduce tenant identification, tenant-scoped user identities, and tenant-scoped authorization rules.

## Options Considered

### Option 1: Multi-tenant authentication from the start
Add tenant resolution and tenant-scoped users and enforce tenant isolation across authentication and authorization.

### Option 2: Single-tenant authentication
Implement authentication for one logical system with globally unique users and system-wide roles.

## Decision
Use a **single-tenant authentication model**.

- No tenant, organization, or vendor separation exists in authentication or authorization.
- User identity is global and based on email + password.
- Roles (ADMIN, PARENT) are enforced system-wide.

## Rationale
- Minimizes scope and complexity for Phase 1 authentication foundation
- Aligns with current requirements
- Keeps authorization rules simple and consistent

## Consequences
- Email uniqueness is global across the system
- Authorization decisions are system-wide
- Multi-tenant support will require future schema changes, JWT payload changes, and additional middleware/guards
