# HisabSathi Frontend

Premium React client for the HisabSathi MVP. It connects to the Django REST API and provides responsive workflows for authentication, groups, expenses, settlements, loans, reminders, and profile management.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- React Hot Toast
- ESLint

## Setup

```bash
cd frontend
npm install
npm run dev
```

The local frontend runs at:

```text
http://127.0.0.1:5173
```

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`.

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

For production:

```text
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Page List

- `/`: landing page.
- `/login`: login form.
- `/register`: registration form.
- `/dashboard`: dashboard summary.
- `/groups`: group list.
- `/groups/new`: create group.
- `/groups/:groupId`: group detail and member view.
- `/expenses/new`: add equal or custom split expense.
- `/expenses/:expenseId`: expense detail and split statuses.
- `/settlements`: money owed, money owed to me, proof upload, confirmation.
- `/loans`: loans given, loans borrowed, overdue loans.
- `/loans/new`: create personal loan.
- `/reminders`: reminders, mark read, mark all read.
- `/profile`: user profile.
- `/profile/payment`: payment profile.

Protected pages require a valid JWT access token. The app clears local auth state when refresh fails or logout completes.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

- `npm run dev`: starts the Vite development server.
- `npm run lint`: runs ESLint with React Hooks rules.
- `npm run build`: creates the production build in `dist/`.
- `npm run preview`: previews the production build locally.

## Deployment

Deploy with `frontend/` as the project root.

### Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

See [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for full deployment details.
