# EduCore SaaS Platform (LMS + HEMIS + CRM)

Production-ready multi-tenant architecture blueprint and starter kit for:
- Private learning centers
- Universities
- Training academies

## 1) Project Folder Structure

```txt
.
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rbac.js
│   │   │   ├── tenant.js
│   │   │   └── errorHandler.js
│   │   ├── shared/
│   │   │   └── logger.js
│   │   └── modules/
│   │       ├── tenant/
│   │       ├── auth/
│   │       ├── crm/
│   │       ├── lms/
│   │       ├── hemis/
│   │       ├── payment/
│   │       └── dashboard/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── app/store.js
│   │   ├── app/router.jsx
│   │   ├── components/layout/
│   │   ├── pages/
│   │   ├── features/
│   │   └── i18n/
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── schema.sql
├── docs/
│   └── api-routes.md
├── docker-compose.yml
└── README.md
```

## 2) Database Schema (ERD)

See full DDL in `database/schema.sql`.

### Core multi-tenant entities
- `tenants` (organization/school level partition)
- `users` (global auth users)
- `tenant_users` (user-role per tenant)
- `audit_logs` (tenant-scoped action trails)

### CRM entities
- `leads`, `lead_notes`, `lead_reminders`, `enrollments`

### LMS entities
- `courses`, `lessons`, `course_materials`, `homework_submissions`, `quizzes`, `quiz_questions`, `quiz_attempts`, `certificates`

### HEMIS entities
- `student_profiles`, `groups`, `group_students`, `attendances`, `gradebook`, `timetables`

### Payments entities
- `invoices`, `payments`, `discounts`

## 3) Backend API Routes

Detailed route list: `docs/api-routes.md`

Sample route groups:
- `/api/v1/auth/*`
- `/api/v1/crm/*`
- `/api/v1/lms/*`
- `/api/v1/hemis/*`
- `/api/v1/payment/*`
- `/api/v1/dashboard/*`

All business routes are tenant-scoped via `x-tenant-id` header + JWT claims.

## 4) Frontend Pages Structure

- Auth: Login, Forgot Password
- Dashboard: KPI cards, revenue/attendance/progress charts
- CRM: Leads board, lead detail, reminders, call notes
- LMS: Courses, lesson player, quizzes, homework submission
- HEMIS: Students, attendance, gradebook, timetable, groups
- Payments: Invoices, transactions, debt/discounts
- Settings: Roles, Integrations (SMS/Telegram/Payments), Audit logs, Localization

## 5) Step-by-Step Implementation Plan

1. **Foundation**: bootstrap monorepo, Docker, CI, lint/test format rules.
2. **Identity & tenancy**: JWT auth, RBAC, tenant middleware, seed super admin.
3. **CRM MVP**: lead capture, pipeline status transitions, reminder scheduler.
4. **HEMIS core**: groups, attendance, gradebook, GPA service.
5. **LMS core**: course/lesson CRUD, progress tracking, quizzes/autograde.
6. **Payments**: invoices, monthly plans, debt aging, gateway abstraction.
7. **Analytics**: pre-aggregated daily metrics + dashboard endpoints.
8. **Integrations**: SMS/Telegram adapters + webhooks.
9. **Hardening**: audit logs, rate limiting, observability, backups.
10. **Scale**: queue workers, caching, read replicas, tenant sharding strategy.

## 6) Starter Code for Key Modules

Implemented in:
- Backend: `backend/src/*`
- Frontend: `frontend/src/*`
- SQL DDL: `database/schema.sql`

### SaaS scalability patterns used
- Tenant-aware middleware and data model
- UUID primary keys and strict foreign keys
- Module-based backend boundaries
- Stateless API for horizontal scaling
- Payment provider adapter abstraction
- Ready for queue-based background jobs and outbox pattern
