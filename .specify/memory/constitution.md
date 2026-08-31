<!--
Sync Impact Report
- Version: initial -> 1.0.0
- Principles: 
  - Added: I. Full-Stack Separation
  - Added: II. Type Safety & Validation
  - Added: III. AI/ML Graceful Degradation
  - Added: IV. IoT Data Integrity
  - Added: V. Modern & Responsive UI
- Added sections: Technology Stack Constraints, Development Workflow
- Removed sections: N/A
- Follow-up TODOs: None
-->
# Cow Dashboard SFE Constitution

## Core Principles

### I. Full-Stack Separation
Frontend (React) and Backend (Node.js) MUST remain strictly decoupled. They communicate exclusively via RESTful APIs. No tight coupling between the UI logic and the database layer is permitted.

### II. Type Safety & Validation
Frontend MUST use strict TypeScript interfaces for all data models and API responses. Backend MUST use Zod for comprehensive runtime request validation before passing data to the Prisma ORM or external services.

### III. AI/ML Graceful Degradation
The system MUST implement robust fallback mechanisms (e.g., rule-based database lookups) whenever the external Python Machine Learning prediction service is unavailable or times out, ensuring continuous and uninterrupted operation of the dashboard.

### IV. IoT Data Integrity
IoT weight measurements are considered immutable once recorded. Adjustments to a cow's static metadata (breed, gender, date of birth) MUST NOT retroactively alter or corrupt historical measurement timestamps or raw recorded weights.

### V. Modern & Responsive UI
The dashboard MUST prioritize a premium, modern aesthetic using TailwindCSS. It MUST maintain strict responsiveness across desktop and mobile devices, utilizing clear visual aids like interactive charts and color-coded status badges for immediate readability.

## Technology Stack Constraints

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **ML Service**: External Python API (communicating via HTTP)

## Development Workflow

- All new features and significant architectural changes MUST be defined in the Spec Kit workflow (`spec.md`, `plan.md`, `tasks.md`) before implementation begins.
- Database schema changes MUST be carefully planned and synced with Prisma migrations. 

## Governance

This constitution guides the architectural and design decisions of the Cow Dashboard project. Any deviation from the defined technology stack, or any introduction of fundamentally new core principles, MUST be discussed and reflected in a constitution amendment prior to implementation. All agents and developers MUST verify compliance with these rules during code review.

**Version**: 1.0.0 | **Ratified**: 2026-08-30 | **Last Amended**: 2026-08-30
