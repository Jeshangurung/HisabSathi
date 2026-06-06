# Backend Testing Guide

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

## Automated Checks

From the repository root:

```bash
python -m compileall backend
```

From `backend/`:

```bash
python manage.py makemigrations --check --dry-run
python manage.py check
python manage.py test -v 2
```

## Manual Postman or Thunder Client Flow

Use `http://127.0.0.1:8000/api` as the base URL. After login, add `Authorization: Bearer <access_token>` to authenticated requests.

Required testing order:

1. Register two users with `POST /api/auth/register/`.
2. Login users with `POST /api/auth/token/`.
3. Create a group with `POST /api/groups/`.
4. Add a member with `POST /api/groups/{id}/add-member/`.
5. Add an equal split expense with `POST /api/expenses/`.
6. Add a custom split expense with `POST /api/expenses/`.
7. View settlements with `GET /api/settlements/`, `/i-owe/`, and `/owed-to-me/`.
8. Mark settlement as paid with `POST /api/settlements/{id}/mark-paid/`.
9. Confirm settlement with `POST /api/settlements/{id}/confirm-received/`.
10. Create loan with `POST /api/loans/`.
11. Mark loan as paid with `POST /api/loans/{id}/mark-paid/`.
12. Confirm loan paid with `POST /api/loans/{id}/confirm-paid/`.
13. View reminders with `GET /api/reminders/`.
14. View dashboard summary with `GET /api/dashboard/`.

## Edge Cases

- Custom split total must equal the expense total.
- The payer should not owe themselves.
- Only group owners can remove members or delete groups.
- Only debtors can mark settlements as paid.
- Only receivers can confirm or reject settlement proof.
- Only borrowers can mark loans as paid.
- Only lenders can confirm loan repayment.
