# HisabSathi

HisabSathi is a Nepal-focused group expense, bill splitting, personal loan tracking, and payment reminder platform for friends, students, roommates, travel groups, and office groups.

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

## Repository Status

This is the initial professional project structure. The codebase is ready for iterative backend and frontend feature implementation.
