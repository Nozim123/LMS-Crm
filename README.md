# EduCore SaaS Platform

A real full-stack starter for **LMS + HEMIS-like SIS + CRM** with multi-tenant SaaS architecture for education institutions.

## 1) Project Folder Structure

```txt
.
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/              # env + PostgreSQL pool
│   │   ├── middleware/          # JWT, tenant, RBAC, error handling
│   │   ├── modules/
│   │   │   ├── auth/            # login/register
│   │   │   ├── crm/             # leads + notes + pipeline
│   │   │   ├── lms/             # courses + quiz autograde
│   │   │   ├── hemis/           # students + attendance + GPA
│   │   │   ├── payment/         # invoices + payments + debt summary
│   │   │   ├── dashboard/       # KPI analytics
│   │   │   ├── notifications/   # SMS/Telegram queue records
│   │   │   └── files/           # file upload endpoint
│   │   └── utils/               # audit log helpers
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── app/router.jsx
│   │   ├── app/store.js
│   │   ├── components/          # layout + UI cards
│   │   ├── pages/               # admin panels (dashboard, crm, lms, ...)
│   │   ├── features/auth/
│   │   └── i18n/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── Dockerfile
├── database/schema.sql
├── docs/api-routes.md
└── docker-compose.yml
```

## 2) Database Schema (ERD)

Core entities:
- **Multi-tenant + security**: `tenants`, `users`, `tenant_users`, `audit_logs`
- **CRM**: `leads`, `lead_notes`, `lead_reminders`, `enrollments`
- **LMS**: `courses`, `lessons`, `course_materials`, `homework_submissions`, `quizzes`, `quiz_questions`, `quiz_attempts`, `certificates`
- **HEMIS**: `student_profiles`, `groups`, `group_students`, `attendances`, `gradebook`, `timetables`
- **Payments**: `invoices`, `discounts`, `payments`
- **Notifications**: `notifications`

All business tables include `tenant_id` for strict tenant partitioning.

## 3) Backend API Routes

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### CRM
- `GET /api/v1/crm/pipeline`
- `GET /api/v1/crm/leads`
- `POST /api/v1/crm/leads`
- `POST /api/v1/crm/leads/:id/notes`

### LMS
- `GET /api/v1/lms/courses`
- `POST /api/v1/lms/courses`
- `POST /api/v1/lms/quizzes/attempts`

### HEMIS
- `GET /api/v1/hemis/students`
- `GET /api/v1/hemis/students/:studentId/gpa`
- `POST /api/v1/hemis/attendance`

### Payments
- `GET /api/v1/payment/invoices`
- `POST /api/v1/payment/invoices`
- `POST /api/v1/payment/payments`
- `GET /api/v1/payment/debts`

### Dashboard
- `GET /api/v1/dashboard/overview`

### Notifications + Files
- `POST /api/v1/notifications`
- `POST /api/v1/files/upload`

## 4) Frontend Pages Structure (Admin Panels)

- `/login` – tenant-aware login
- `/` – KPI dashboard
- `/crm` – lead creation + pipeline list/table
- `/lms` – courses management panel
- `/hemis` – student academic records panel
- `/payments` – invoices and payment status panel
- `/notifications` – SMS/Telegram queue panel
- `/settings` – localization and platform settings

## 5) Step-by-Step Implementation Plan

1. Add DB migration framework (Prisma/Knex) + seed command for demo tenant.
2. Add refresh token flow and password reset.
3. Implement full RBAC policies per endpoint (role matrix).
4. Add Telegram/SMS provider adapters and worker queue.
5. Add object storage for uploads (S3/MinIO).
6. Add tests: unit (services), integration (API), e2e (frontend).
7. Add SaaS billing, tenant subscription plans, and metering.
8. Add observability: OpenTelemetry, structured logs, metrics, alerts.
9. Split heavy analytics into background jobs + materialized views.
10. Introduce horizontal scale: Redis cache, queue workers, read replicas.

## 6) Starter Code for Key Modules

Implemented in:
- **Backend**: `backend/src/modules/*` with real DB-backed handlers.
- **Frontend**: `frontend/src/pages/*` with role/admin-oriented pages and API integration.
- **Database**: `database/schema.sql` with tenant-safe relational model.

---

## Quick Start

### Docker
```bash
docker compose up --build
```

### Local backend
```bash
cd backend
npm install
npm run dev
```

### Local frontend
```bash
cd frontend
npm install
npm run dev
```

> Send `x-tenant-id` on auth and API requests. Frontend stores and forwards it automatically.
