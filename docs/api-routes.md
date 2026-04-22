# API Route Design (v1)

## Auth
- `POST /api/v1/auth/login`

## CRM
- `GET /api/v1/crm/pipeline`
- `POST /api/v1/crm/leads`
- `POST /api/v1/crm/leads/:id/notes`
- `POST /api/v1/crm/leads/:id/reminders`
- `POST /api/v1/crm/leads/:id/convert`

## LMS
- `GET /api/v1/lms/courses`
- `POST /api/v1/lms/courses`
- `GET /api/v1/lms/courses/:id/lessons`
- `POST /api/v1/lms/homework/submissions`
- `POST /api/v1/lms/quizzes/:id/attempts`
- `POST /api/v1/lms/certificates/generate`

## HEMIS
- `GET /api/v1/hemis/attendance`
- `POST /api/v1/hemis/attendance`
- `GET /api/v1/hemis/students/:studentId/gpa`
- `GET /api/v1/hemis/timetable`
- `POST /api/v1/hemis/groups`

## Payments
- `GET /api/v1/payment/invoices`
- `POST /api/v1/payment/invoices`
- `POST /api/v1/payment/payments`
- `GET /api/v1/payment/debts`
- `POST /api/v1/payment/webhooks/:provider`

## Dashboard
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/dashboard/teacher-performance`
- `GET /api/v1/dashboard/student-progress`
