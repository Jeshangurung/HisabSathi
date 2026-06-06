# HisabSathi Backend

Django REST Framework API for HisabSathi.

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

## Apps

- `accounts`: users and payment profile
- `groups`: expense groups and members
- `expenses`: expenses and split calculations
- `settlements`: payment confirmation workflow
- `loans`: personal loan tracking
- `reminders`: pending payment and due date reminders
- `common`: shared models, permissions, and utilities

## Development Notes

- Use `config.settings.development` locally.
- Use PostgreSQL through `DATABASE_URL` in production.
- JWT authentication is provided by `djangorestframework-simplejwt`.
- Media uploads are stored under `backend/media/` during local development.
