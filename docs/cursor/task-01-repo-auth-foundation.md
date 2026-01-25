# Task 01 — Authentication Foundation (Phase 1)

## 0) Purpose
This task establishes the **authentication and authorization foundation** for Phase 1.

It introduces:
- User authentication
- Role handling (ADMIN / PARENT)
- Secure session handling
- Authorization guards

No domain workflows (applications, registration, documents) are implemented yet.

---

## 1) Scope

### 1.1 In Scope
- User entity and persistence
- Authentication (login/logout)
- JWT-based session handling (httpOnly cookies)
- Role-based authorization guards
- Ownership guard foundation (generic)
- Auth module structure

### 1.2 Out of Scope
- Registration flows
- Invitation onboarding
- Application logic
- Document handling
- Registration period logic
- Admin dashboards or UI

---

## 2) Backend Architecture

### 2.1 Auth module
Create an `auth` module in `apps/api` containing:
- controller
- service
- DTOs
- guards
- strategies

Rules:
- Controllers remain thin
- Services contain all auth logic
- Guards enforce authorization rules

---

## 3) User Model

### 3.1 User entity (Prisma)
`User` model fields:

- `id` (Int, autoincrement)
- `email` (String, globally unique)
- `passwordHash` (String, mapped to DB column `password_hash`)
- `role` (`UserRole`: ADMIN | PARENT)
- `createdAt` (DateTime, mapped to `created_at`)
- `updatedAt` (DateTime, mapped to `updated_at`)

Table mapping:
- DB table name: `users

Rules:
- Passwords stored as hashes only
- No plaintext passwords
- No profile data yet

---

## 4) Authentication Mechanism

### 4.1 Login
Implement:
POST /auth/login

Behavior:
- Accepts email + password
- Validates credentials
- Issues JWT on success
- Stores JWT in httpOnly cookie named `access_token` with:
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: lax`
  - `path: /`
  - `maxAge` derived from `JWT_EXPIRES_IN`


---

### 4.2 Logout
Implement:
POST /auth/logout


Behavior:
- Clears authentication cookie
- Invalidates session client-side

---

### 4.3 Password handling
Rules:
- Use a secure hashing algorithm (e.g. bcrypt)
- Hashing logic lives in auth service
- Password comparison done server-side only

---

## 5) JWT Strategy

### 5.1 JWT configuration
- Access token only (Phase 1)
- Stored in httpOnly cookie `access_token`
- Secret: `JWT_SECRET`
- Expiration: `JWT_EXPIRES_IN`

---

### 5.2 Auth guard
Implement a global or reusable auth guard that:
- Validates JWT
- Attaches user identity to request context
- Rejects unauthenticated requests

---

## 6) Authorization Guards

### 6.1 Role guard
Implement a role-based guard that:
- Restricts endpoints by role
- Supports ADMIN and PARENT
- Can be composed with auth guard

---

### 6.2 Ownership guard (foundation only)
Prepare a generic ownership-check pattern:
- Accepts a resource identifier
- Verifies the current user owns the resource
- Actual application ownership logic implemented later

This guard is a **foundation only**, not used by domain features yet.

---

## 7) API Endpoints

### Implement the following endpoints:
POST /auth/login
POST /auth/logout
GET /auth/me


#### `GET /auth/me`
Returns:
- authenticated user id
- email
- role

Used by frontend to determine session state.

---

## 8) Frontend Integration (Minimal)

### 8.1 API client
- Add a basic auth API client
- Supports login, logout, and session check

### 8.2 Session awareness
- Frontend must be able to detect:
  - authenticated
  - unauthenticated
- No UI flows beyond basic validation

---

## 9) Security Rules (Strict)

- All auth endpoints protected against timing attacks
- Cookies must be:
  - httpOnly
  - secure (when applicable)
  - sameSite configured
- No sensitive data returned in responses

---

## 10) Acceptance Criteria

This task is complete when:
- User can log in with valid credentials
- Invalid credentials are rejected
- JWT cookie is set correctly
- Authenticated requests succeed
- Unauthenticated requests are blocked
- Role guard correctly restricts access
- `GET /auth/me` returns correct user info
- No domain logic exists yet

---

## 11) Guardrails

- Do not implement invitation onboarding
- Do not create parent profiles
- Do not create admin UI
- Do not implement application entities
- Do not bypass guards in controllers

---

## 12) Task Completion Rule
Once completed:
- Auth foundation is stable
- Roles are enforced
- Project is ready for **Task 02: Registration Period**

---

### Status
Ready for execution in Cursor
