# 00 — Overview (Phase 1)

## 0) Purpose
This document explains how the Phase 1 specifications are organized, how they relate to each other, and how they must be used when building the system with Cursor.

It does not define business rules or technical constraints.  
It defines how to read and apply the specifications.

---

## 1) Phase 1 Goal (Context Only)
Phase 1 delivers a secure, controlled student registration workflow including:
- Pre-registration
- Invitation-based onboarding
- Full registration
- Administrative review
- Student creation

All functional and technical rules are defined in dedicated specification files.

---

## 2) Specification Layers (Mental Model)

Phase 1 specifications are split into three intentional layers:
Narrative → explains WHAT and WHY
Contract → defines SHAPES and RULES
Tasks → define WHAT TO BUILD NEXT

Each layer has a distinct purpose and must not overlap responsibilities.

---

## 3) Directory Structure and Responsibilities
docs/
specs/ ← Stable truth (rarely changes)
cursor/ ← Execution tasks (used step-by-step)
sources/ ← Raw reference material (read-only)


### 3.1 `docs/specs/`
Contains authoritative specifications for Phase 1.

These files:
- Define business intent and rules
- Define data shapes and constraints
- Define technical architecture decisions
- Are not executed directly
- Are attached to Cursor only when relevant

---

### 3.2 `docs/cursor/`
Contains execution instructions for Cursor.

These files:
- Describe exactly one implementation task
- Are executed sequentially
- Must be attached one at a time
- Reference specs in `docs/specs/`

Cursor must never execute more than one task file at once.

---

### 3.3 `docs/sources/`
Contains original reference documents (Word, Excel, PDF).

These files:
- Are read-only
- Are not attached to Cursor during normal execution
- Exist only for traceability

---

## 4) Active vs Passive Files

- Files existing in the repository are passive
- Files attached to a Cursor prompt become active context

Presence in Git does not imply usage by Cursor.

---

## 5) Order of Execution (Phase 1)

Recommended execution order:

1. task-00-repo-bootstrap.md
2. task-01-auth-foundation.md
3. task-02-registration-period.md
4. task-03-pre-registration.md
5. task-04-invitation-onboarding.md
6. task-05-full-registration-wizard.md
7. task-06-documents-upload.md
8. task-07-admin-review-decision.md
9. task-08-student-create-export.md
10. task-90-quality-gates.md

---

## 6) Change Management Rule
If a change is required:
- Update the relevant spec file first
- Then update or rerun affected tasks

Code must never silently diverge from specs.

---

## 7) Stability Rule
Narrative intent, contract skeleton, and technical architecture are considered stable for Phase 1.

Any change requires conscious review before implementation continues.

---

### Status
Active — Phase 1 entry point


