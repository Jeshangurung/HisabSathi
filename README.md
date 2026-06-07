# HisabSathi

HisabSathi is a Nepal-focused group expense, bill splitting, personal loan tracking, and payment reminder platform for friends, students, roommates, travel groups, and office groups.

## Tech Stack

- Backend: Django, Django REST Framework, Simple JWT, PostgreSQL, django-cors-headers, Pillow
- Frontend: React, Vite, Tailwind CSS, Axios, React Router

This repository is organized as a professional full-stack monorepo:

```text
HisabSathi/
  backend/    Django REST Framework API
  frontend/   React, Vite, Tailwind client
```

## MVP Scope

- JWT authentication
- User and payment profiles
- Group expense management
- Equal and custom split tracking
- Settlement status workflow
- Payment proof uploads
- Personal loan tracker
- Due date reminders
- Dashboard-ready API structure
- Mobile-first frontend structure

## Quick Start

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend setup is currently prepared for the Step 3 implementation pass.

## Documentation

- [Backend README](backend/README.md)
- [API Documentation](docs/API.md)
- [Backend Testing Guide](docs/BACKEND_TESTING.md)

## Repository Status

The backend API is implemented for the MVP domain modules. The frontend structure is ready for the next implementation pass.
