# HisabSathi Frontend

Premium React, Vite, and Tailwind CSS client for HisabSathi.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Scripts

- `npm run dev`: start local development server.
- `npm run build`: create production build.
- `npm run preview`: preview production build locally.
- `npm run lint`: run ESLint.

## Structure

- `src/app`: app shell and providers
- `src/components`: shared UI, cards, forms, and layout components
- `src/features`: product feature pages and API service modules
- `src/routes`: route declarations and protected route handling
- `src/services`: API clients and service modules
- `src/styles`: Tailwind entry styles

## Environment

Create `frontend/.env` locally:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
