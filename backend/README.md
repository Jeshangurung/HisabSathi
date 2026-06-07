# HisabSathi Backend

Django REST Framework API for the HisabSathi MVP. It handles users, payment profiles, groups, expenses, settlements, personal loans, reminders, and dashboard summaries.

## Tech Stack

- Django 5
- Django REST Framework
- Simple JWT
- django-cors-headers
- dj-database-url
- PostgreSQL-ready configuration
- Pillow for image uploads
- Gunicorn for production serving

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API runs at:

```text
http://127.0.0.1:8000/api
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

```text
SECRET_KEY=replace-with-a-long-random-secret-key
DEBUG=True
DJANGO_SETTINGS_MODULE=config.settings.development
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=
ACCESS_TOKEN_LIFETIME_MINUTES=30
REFRESH_TOKEN_LIFETIME_DAYS=7
MEDIA_URL=/media/
STATIC_URL=/static/
```

Use `DEBUG=False`, `DJANGO_SETTINGS_MODULE=config.settings.production`, PostgreSQL, production allowed hosts, and production CORS origins before deployment.

## Apps

- `accounts`: custom user, register, login, logout, current user, payment profile.
- `groups`: expense groups, member roles, add/remove member workflows.
- `expenses`: equal/custom split creation, decimal validation, settlement generation.
- `settlements`: money owed, mark paid, proof upload, confirm/reject payment.
- `loans`: personal loan creation, mark paid, confirm paid, overdue views.
- `reminders`: reminders, mark read, mark all read.
- `common`: pagination, validation, responses, dashboard summary.

## Core Endpoints

```text
POST   /api/auth/register/
POST   /api/auth/token/
POST   /api/auth/token/refresh/
POST   /api/auth/logout/
GET    /api/auth/me/
PATCH  /api/auth/me/
GET    /api/dashboard/
GET    /api/payment-profiles/
PATCH  /api/payment-profiles/{id}/
GET    /api/groups/
POST   /api/groups/
POST   /api/groups/{id}/add-member/
DELETE /api/groups/{id}/remove-member/{user_id}/
POST   /api/expenses/
GET    /api/expenses/{id}/
GET    /api/settlements/i-owe/
GET    /api/settlements/owed-to-me/
POST   /api/settlements/{id}/mark-paid/
POST   /api/settlements/{id}/confirm-received/
POST   /api/settlements/{id}/reject/
POST   /api/loans/
GET    /api/loans/given/
GET    /api/loans/borrowed/
GET    /api/loans/overdue/
POST   /api/loans/{id}/mark-paid/
POST   /api/loans/{id}/confirm-paid/
GET    /api/reminders/
POST   /api/reminders/{id}/mark-read/
POST   /api/reminders/mark-all-read/
```

`POST /api/auth/token/` accepts either username or email in the `username` field.

## Example Expense Requests

Equal split:

```json
{
  "group": 1,
  "title": "Dinner",
  "description": "Saturday dinner",
  "total_amount": "3600.00",
  "paid_by": 1,
  "split_type": "equal",
  "category": "Food",
  "split_participant_ids": [1, 2, 3, 4]
}
```

Custom split:

```json
{
  "group": 1,
  "title": "Hotel",
  "total_amount": "12000.00",
  "paid_by": 1,
  "split_type": "custom",
  "custom_splits": [
    { "user": 2, "amount": "4000.00" },
    { "user": 3, "amount": "4000.00" },
    { "user": 4, "amount": "4000.00" }
  ]
}
```

## Validation

```bash
cd backend
python -m compileall .
python manage.py makemigrations --check --dry-run
python manage.py migrate --noinput
python manage.py check
python manage.py test -v 2
```

## Deployment

Deployment files are included:

- `Procfile`
- `runtime.txt`
- `build.sh`

See [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) and [../docs/PRODUCTION_CHECKLIST.md](../docs/PRODUCTION_CHECKLIST.md) before launching.
