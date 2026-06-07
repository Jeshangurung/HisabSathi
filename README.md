# HisabSathi

HisabSathi is a full-stack MVP for tracking shared expenses, settlements, personal loans, payment proof, and reminders. It is designed for college friends, hostel students, roommates, travel groups, and office lunch groups who need a clear record of who paid, who owes, and what has been settled.

## Problem

Shared money gets messy when groups rely on memory, chat screenshots, or informal notes. HisabSathi gives groups one place to record expenses, split bills, upload proof, confirm payments, and track personal loans.

## Features

- JWT authentication with registration, login, refresh, and logout.
- User profile and payment profile management.
- Group creation and member management.
- Equal and custom expense splits.
- Automatic settlement creation from expense splits.
- Payment proof upload and receiver confirmation.
- Expense split status sync after settlement confirmation.
- Personal loan tracking with borrower/lender confirmation.
- Due reminders and mark-read workflows.
- Dashboard summary for owed/receivable amounts and recent activity.
- Premium React UI with responsive desktop and mobile layouts.

## Tech Stack

- Backend: Django, Django REST Framework, Simple JWT, PostgreSQL-ready settings, django-cors-headers, Pillow, Gunicorn.
- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React.
- Database: SQLite for local development, PostgreSQL for production.

## Monorepo Structure

```text
HisabSathi/
  backend/    Django REST Framework API
  frontend/   React, Vite, Tailwind client
  docs/       API, testing, deployment, production, and launch docs
```

## Local Setup

Run the backend first, then the frontend.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000/api
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` from `frontend/.env.example`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The frontend runs at:

```text
http://127.0.0.1:5173
```

## Testing Commands

Backend:

```bash
cd backend
python -m compileall .
python manage.py makemigrations --check --dry-run
python manage.py migrate --noinput
python manage.py check
python manage.py test -v 2
```

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
```

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](docs/API.md)
- [Backend Testing Guide](docs/BACKEND_TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Production Checklist](docs/PRODUCTION_CHECKLIST.md)
- [MVP Launch Plan](docs/MVP_LAUNCH_PLAN.md)

## Screenshots

Screenshots can be added after the first deployed UI review:

- Dashboard desktop view.
- Group detail view.
- Add expense view.
- Settlements mobile view.
- Loan tracker view.

## Roadmap

- Improve member discovery so users do not need numeric user IDs.
- Add durable cloud media storage for payment proof and receipts.
- Add official eSewa/Khalti integration after manual proof flow is validated.
- Add push notifications and SMS reminders.
- Add receipt OCR and AI expense categorization.
- Add trip mode, roommate mode, and smart settlement simplification.
- Build a React Native mobile app after the web MVP proves retention.
