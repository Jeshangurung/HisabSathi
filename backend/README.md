# HisabSathi Backend

Django REST Framework API for HisabSathi: group expenses, equal/custom bill splitting, settlements, payment proof, personal loans, reminders, and dashboard analytics.

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

## Environment Variables

Set these in your local shell, hosting provider, or secret manager:

```text
DJANGO_SECRET_KEY
DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
DATABASE_URL
DJANGO_SETTINGS_MODULE
```

`DATABASE_URL` supports PostgreSQL in production and SQLite fallback for local development.

## Apps

- `accounts`: custom user, registration, current user, logout, payment profile.
- `groups`: groups, members, owner/member roles, member management.
- `expenses`: equal/custom splits, money validation, settlement generation.
- `settlements`: mark paid, confirm received, reject proof, proof upload.
- `loans`: personal loans, due reminders, mark/confirm paid workflow.
- `reminders`: reminder list, mark read, mark all read.
- `common`: pagination, responses, validation, dashboard summary.

## Core Endpoints

```text
POST   /api/auth/register/
POST   /api/auth/token/
POST   /api/auth/token/refresh/
POST   /api/auth/logout/
GET    /api/auth/me/
PATCH  /api/auth/me/
GET    /api/dashboard/
GET    /api/groups/
POST   /api/groups/
POST   /api/groups/{id}/add-member/
DELETE /api/groups/{id}/remove-member/{user_id}/
POST   /api/expenses/
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

## Example Expense Request

```json
{
  "group": 1,
  "title": "Dinner",
  "description": "Saturday dinner",
  "total_amount": "3600.00",
  "paid_by": 1,
  "split_type": "equal",
  "category": "food",
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

## Testing

```bash
python -m compileall backend
cd backend
python manage.py makemigrations --check --dry-run
python manage.py migrate
python manage.py check
python manage.py test
```

Use Postman or Thunder Client with a `Bearer <access_token>` authorization header after login.
