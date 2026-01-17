# 08 — Technical Architecture (Phase 1)

## 0) Purpose
This document defines the **technical architecture decisions** for Phase 1.

Its purpose is to:
- Ensure consistency across all generated code
- Prevent architectural drift during Cursor execution
- Reduce refactoring risk
- Provide stable technical constraints for all tasks

This document does not define business rules or data fields.

---

## 1) Architectural Style

### 1.1 Overall approach
Phase 1 uses a **Modular Monolith** architecture.

- Single NestJS backend application
- Modules organized by bounded context
- Clear separation of concerns
- No microservices in Phase 1

This approach balances structure and development speed.

---

## 2) Backend Architecture (NestJS)

### 2.1 Module boundaries
Backend code is organized by domain modules.

Minimum modules:
- auth
- registration-periods
- applications
- documents
- students
- admin (or admin controllers within domain modules)

Rules:
- Each module owns its controllers, services, and DTOs
- Cross-module access must go through services
- No circular dependencies between modules

---

### 2.2 Controller responsibilities
Controllers must be **thin**.

Controllers:
- Handle routing and HTTP concerns
- Parse request parameters
- Apply guards and pipes
- Delegate all logic to services

Controllers must not:
- Contain business logic
- Perform database access
- Enforce workflow rules

---

### 2.3 Service responsibilities
Services contain **all business logic**.

Services:
- Enforce workflow and status rules
- Perform cross-field validation
- Coordinate database operations
- Control transactional boundaries
- Trigger side effects (email, file handling)

---

## 3) Data Access & ORM

### 3.1 ORM choice
**Prisma** is the selected ORM for Phase 1.

Reasons:
- Strong TypeScript type safety
- Explicit schema and migrations
- Predictable behavior for AI-generated code
- Good fit for small to medium systems

---

### 3.2 Prisma usage rules
- Prisma Client accessed only via a shared `PrismaService`
- No raw SQL unless explicitly justified
- Relations must be explicit in schema
- Avoid implicit cascading behavior

---

### 3.3 Transaction boundaries
The following operations must be **transactional**:
- Application approval → student creation
- Status transitions with side effects
- Invitation acceptance → user creation + application linking

---

## 4) Validation Strategy

### 4.1 Validation approach (locked)
Phase 1 uses **DTO-based validation with class-validator**.

Rules:
- Every request body has a DTO
- Validation occurs at controller boundary
- DTO rules match the Data Dictionary
- Required vs optional fields are enforced consistently

Cross-field or workflow validation belongs in services.

---

## 5) Authentication & Authorization

### 5.1 Authentication
- JWT-based authentication
- JWT stored in **httpOnly cookies**
- Access token used for API authorization
- Refresh strategy may be added later (not Phase 1)

---

### 5.2 Authorization
Authorization is enforced **server-side only**.

Rules:
- Role-based access via NestJS Guards
- Ownership checks in services
- UI restrictions are not trusted
- Registration-period state is always enforced

---

## 6) File & Document Handling

### 6.1 Storage model
- Binary files stored in private object storage
- Database stores metadata only
- Storage keys are never exposed directly

---

### 6.2 Access rules
- Parents:
  - Can upload documents
  - Cannot download documents
- Admins:
  - Can view and download all documents

---

### 6.3 Access method
Phase 1 allows either:
- Backend proxy streaming, or
- Short-lived signed URLs

The chosen method must be consistent per environment.

---

## 7) Registration Period Enforcement

Rules enforced at service layer:
- Parent and public actions blocked when period is CLOSED
- Admin actions always allowed
- Enforcement must be centralized and consistent

---

## 8) Error Handling & API Behavior

### 8.1 Error principles
- Use standard HTTP status codes
- Validation errors → 400 or 422
- Unauthorized → 401
- Forbidden → 403
- Not found → 404

---

### 8.2 Error payloads
- Machine-readable error codes preferred
- Human-readable messages optional
- Do not leak internal details

---

## 9) Frontend Architecture (Next.js)

### 9.1 Structure
- Next.js App Router
- Server Components by default
- Client Components only when required (forms, interactivity)

---

### 9.2 Data access
- Frontend communicates only via backend APIs
- No direct database or storage access
- API client centralized

---

### 9.3 Validation
- Frontend validation mirrors backend DTO rules
- Backend remains the source of truth

---

## 10) Observability & Quality Baseline

Phase 1 minimum:
- Structured logging
- Health endpoint (`GET /health`)
- Environment-based configuration
- Linting and type checking enforced

Advanced observability is deferred.

---

## 11) Non-Goals (Phase 1)
This architecture explicitly excludes:
- Microservices
- CQRS
- Event sourcing
- Heavy domain entity models
- Background job orchestration
- Full audit trails

These may be introduced in later phases.

---

## 12) Architecture Stability Rule
This document is **frozen for Phase 1**.

Any change to:
- ORM
- Validation strategy
- Module boundaries
- Authentication mechanism
- File access model

must be reflected here **before** implementation continues.

---

### Status
Approved — Phase 1 Technical Architecture
