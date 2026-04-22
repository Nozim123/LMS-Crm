# API Route Design (v1)

All routes except `/auth/*` require:
- `Authorization: Bearer <JWT>`
- `x-tenant-id: <tenant_uuid>`

## Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## CRM
- `GET /api/v1/crm/pipeline`
- `GET /api/v1/crm/leads`
- `POST /api/v1/crm/leads`
- `POST /api/v1/crm/leads/:id/notes`

## LMS
- `GET /api/v1/lms/courses`
- `POST /api/v1/lms/courses`
- `POST /api/v1/lms/quizzes/attempts`

## HEMIS
- `GET /api/v1/hemis/students`
- `GET /api/v1/hemis/students/:studentId/gpa`
- `POST /api/v1/hemis/attendance`

## Payments
- `GET /api/v1/payment/invoices`
- `POST /api/v1/payment/invoices`
- `POST /api/v1/payment/payments`
- `GET /api/v1/payment/debts`

## Dashboard
- `GET /api/v1/dashboard/overview`

## Notifications
- `POST /api/v1/notifications`

## Files
- `POST /api/v1/files/upload` (`multipart/form-data`, field: `file`)
