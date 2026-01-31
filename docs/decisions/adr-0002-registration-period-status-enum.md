# ADR-002: Registration Period Status as Named Enum

## Status
Accepted

## Context
Task 02 (Registration Period) introduced a registration period status with two values: open and closed. The specs initially described this as free text ("OPEN / CLOSED"). The implementation and Prisma schema use a named enum `RegistrationPeriodStatus` with values OPEN and CLOSED. Aligning the specification documents with this enum avoids ambiguity and keeps one source of truth.

## Options Considered

### Option 1: Keep free-text values in specs
Document registration period status as "OPEN / CLOSED" in the data dictionary and contract skeleton without a formal enum.

### Option 2: Define and reference RegistrationPeriodStatus enum in specs
Add `RegistrationPeriodStatus` (OPEN, CLOSED) to the contract skeleton enums and reference it by name in the data dictionary, consistent with ApplicationStatus and other enums.

## Decision
Use a **named enum RegistrationPeriodStatus** (OPEN, CLOSED) in the specification documents.

- Contract Skeleton (Phase 1) defines the enum with values OPEN and CLOSED.
- Data Dictionary references the enum by name for the `registration_period.status` field.
- Implementation (Prisma, API) continues to use the same enum.

## Rationale
- Single source of truth for allowed values; consistent with how ApplicationStatus is defined and referenced.
- Reduces drift between specs and code; future status values are added in one place (enum definition).
- Aligns Phase 1 docs with Task 02 implementation and technical architecture.

## Consequences
- Specs (02-contract-skeleton, 05-data-dictionary) reference RegistrationPeriodStatus instead of ad-hoc text.
- Any future registration period status value must be added to the enum in the contract skeleton and in implementation.
