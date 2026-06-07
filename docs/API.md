# HisabSathi Backend API

Base URL:

```text
http://127.0.0.1:8000/api
```

Use `Authorization: Bearer <access_token>` for authenticated endpoints.

## Authentication

Register:

```http
POST /api/auth/register/
```

```json
{
  "username": "sita",
  "email": "sita@example.com",
  "full_name": "Sita Gurung",
  "phone_number": "9800000000",
  "password": "strong-password"
}
```

Login:

```http
POST /api/auth/token/
```

```json
{
  "username": "sita",
  "password": "strong-password"
}
```

The `username` field accepts either a username or the user's email address.

Refresh:

```http
POST /api/auth/token/refresh/
```

```json
{
  "refresh": "refresh-token"
}
```

Logout:

```http
POST /api/auth/logout/
```

```json
{
  "refresh": "refresh-token"
}
```

Current user:

```http
GET /api/auth/me/
PATCH /api/auth/me/
```

Payment profile:

```http
GET /api/payment-profiles/
PATCH /api/payment-profiles/{id}/
```

Supports `phone_number`, `esewa_number`, `khalti_number`, `bank_name`, `bank_account_number`, `bank_account_name`, and `payment_qr`.

## Groups

```text
GET    /api/groups/
POST   /api/groups/
GET    /api/groups/{id}/
PATCH  /api/groups/{id}/
DELETE /api/groups/{id}/
POST   /api/groups/{id}/add-member/
DELETE /api/groups/{id}/remove-member/{user_id}/
GET    /api/group-members/
POST   /api/group-members/
```

Create group:

```json
{
  "name": "Pokhara Trip",
  "description": "June travel expenses"
}
```

Add member:

```json
{
  "user_id": 2,
  "role": "member"
}
```

## Expenses

```text
GET    /api/expenses/
POST   /api/expenses/
GET    /api/expenses/{id}/
PATCH  /api/expenses/{id}/
DELETE /api/expenses/{id}/
GET    /api/expense-splits/
```

Equal split:

```json
{
  "group": 1,
  "title": "Dinner",
  "description": "Saturday dinner",
  "total_amount": "3600.00",
  "paid_by": 1,
  "split_type": "equal",
  "category": "food",
  "expense_date": "2026-06-06",
  "split_participant_ids": [1, 2, 3, 4]
}
```

Custom split:

```json
{
  "group": 1,
  "title": "Hotel",
  "description": "Room booking",
  "total_amount": "12000.00",
  "paid_by": 1,
  "split_type": "custom",
  "category": "travel",
  "expense_date": "2026-06-06",
  "custom_splits": [
    { "user": 2, "amount": "4000.00" },
    { "user": 3, "amount": "4000.00" },
    { "user": 4, "amount": "4000.00" }
  ]
}
```

Expense creation automatically creates settlement rows and reminders.

## Settlements

```text
GET  /api/settlements/
GET  /api/settlements/pending/
GET  /api/settlements/i-owe/
GET  /api/settlements/owed-to-me/
POST /api/settlements/{id}/mark-paid/
POST /api/settlements/{id}/confirm-received/
POST /api/settlements/{id}/reject/
```

Mark paid:

```json
{
  "payment_method": "eSewa",
  "transaction_note": "Paid from 9800000000"
}
```

Use multipart form data with `proof_image` for proof upload.

## Loans

```text
GET  /api/loans/
POST /api/loans/
GET  /api/loans/given/
GET  /api/loans/borrowed/
GET  /api/loans/overdue/
POST /api/loans/{id}/mark-paid/
POST /api/loans/{id}/confirm-paid/
POST /api/loans/{id}/cancel/
```

Create loan:

```json
{
  "lender": 1,
  "borrower": 2,
  "amount": "5000.00",
  "reason": "Trip advance",
  "due_date": "2026-06-20"
}
```

## Reminders

```text
GET  /api/reminders/
POST /api/reminders/{id}/mark-read/
POST /api/reminders/mark-all-read/
```

## Dashboard

```http
GET /api/dashboard/
```

Example response:

```json
{
  "success": true,
  "message": "",
  "data": {
    "total_amount_i_owe": "750.00",
    "total_amount_i_am_owed": "1250.00",
    "pending_settlement_count": 3,
    "active_loans_borrowed_count": 1,
    "active_loans_given_count": 2,
    "recent_groups": [],
    "recent_expenses": [],
    "recent_settlements": [],
    "recent_reminders": []
  }
}
```

## Common Errors

Validation errors return HTTP `400`:

```json
{
  "success": false,
  "error": {
    "total_amount": ["Amount must be greater than zero."]
  }
}
```

Unauthenticated requests return HTTP `401`. Permission failures return HTTP `403`.
