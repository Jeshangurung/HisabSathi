# HisabSathi Deployment Guide

This guide prepares the MVP for a production-style deployment with the Django API on Render, Railway, DigitalOcean, or a VPS, and the React frontend on Vercel or Netlify.

## Backend Deployment

Use `backend/` as the deploy root when the platform supports monorepo subdirectories.

### Render

1. Create a PostgreSQL database.
2. Create a Web Service from this repository.
3. Set the root directory to `backend`.
4. Use `./build.sh` as the build command.
5. Use `gunicorn config.wsgi:application --log-file -` as the start command.
6. Add the environment variables listed below.
7. Run `python manage.py createsuperuser` from the Render shell after the first successful deploy.

### Railway

1. Create a new project and attach a PostgreSQL plugin.
2. Set the service root to `backend`.
3. Set the start command to `gunicorn config.wsgi:application --log-file -`.
4. Set `DATABASE_URL` from the PostgreSQL service.
5. Run migrations with `python manage.py migrate --noinput`.

### DigitalOcean App Platform

1. Create a PostgreSQL database.
2. Create an app from this repository.
3. Set the source directory to `backend`.
4. Use `./build.sh` as the build command.
5. Use `gunicorn config.wsgi:application --log-file -` as the run command.
6. Add app environment variables and database connection values.

### VPS

1. Install Python 3.12, PostgreSQL, Nginx, and a process manager such as systemd.
2. Clone the repository and move into `backend`.
3. Create a virtual environment and install requirements.
4. Configure production environment variables.
5. Run migrations and collect static files.
6. Run Gunicorn behind Nginx with HTTPS enabled.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
gunicorn config.wsgi:application --bind 127.0.0.1:8000
```

## Backend Environment Variables

```text
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings.production
ALLOWED_HOSTS=api.your-domain.com,your-service.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
DATABASE_URL=postgresql://user:password@host:5432/database
ACCESS_TOKEN_LIFETIME_MINUTES=30
REFRESH_TOKEN_LIFETIME_DAYS=7
MEDIA_URL=/media/
STATIC_URL=/static/
```

Use `DATABASE_URL` for production PostgreSQL. The individual `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, and `POSTGRES_PORT` values are available for local or provider-specific setups.

## PostgreSQL Setup

Create a production database and user with least-privilege access. On a VPS:

```sql
CREATE DATABASE hisabsathi;
CREATE USER hisabsathi_user WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE hisabsathi TO hisabsathi_user;
```

Then set `DATABASE_URL` in the hosting environment.

## CORS and Allowed Hosts

`ALLOWED_HOSTS` must include every backend domain. `CORS_ALLOWED_ORIGINS` must include every frontend origin exactly, including scheme:

```text
ALLOWED_HOSTS=api.hisabsathi.com,hisabsathi-api.onrender.com
CORS_ALLOWED_ORIGINS=https://hisabsathi.com,https://hisabsathi.vercel.app
```

If the frontend shows network or authentication errors after deployment, check CORS first.

## Static Files

Run static collection during deployment:

```bash
python manage.py collectstatic --noinput
```

For an API-only MVP, admin static files are the main static concern. On a VPS, serve `backend/staticfiles/` through Nginx. On managed platforms, configure static-file serving or add a storage/static middleware strategy before launch traffic grows.

## Media Files

Payment proof, loan proof, QR images, avatars, and receipts are media uploads. Local development stores them under `backend/media/`.

For production, plan durable media storage before real users upload sensitive payment proof. Recommended options:

- S3-compatible object storage.
- DigitalOcean Spaces.
- A mounted persistent disk on a VPS.

Do not rely on ephemeral platform storage for production payment proof.

## Migration and Superuser Commands

```bash
python manage.py migrate --noinput
python manage.py createsuperuser
```

Run migrations after every backend deploy. Create a superuser only once per production database.

## Frontend Deployment

Use `frontend/` as the deploy root.

### Vercel

1. Import the repository.
2. Set the root directory to `frontend`.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add `VITE_API_BASE_URL=https://your-backend-domain/api`.

### Netlify

1. Import the repository.
2. Set base directory to `frontend`.
3. Set build command to `npm run build`.
4. Set publish directory to `frontend/dist` or `dist` when base directory is configured.
5. Add `VITE_API_BASE_URL=https://your-backend-domain/api`.

## Common Deployment Errors

- `DisallowedHost`: add the backend hostname to `ALLOWED_HOSTS`.
- Browser CORS failure: add the frontend URL to `CORS_ALLOWED_ORIGINS`.
- Login works locally but not in production: confirm `VITE_API_BASE_URL` points to the production API and includes `/api`.
- Database tables missing: run `python manage.py migrate --noinput`.
- Admin CSS missing: run `python manage.py collectstatic --noinput` and configure static serving.
- Payment proof disappears after deploy: configure durable media storage.
- 500 on startup: confirm `SECRET_KEY`, `DJANGO_SETTINGS_MODULE`, and `DATABASE_URL`.
- Mixed content warning: use HTTPS for both frontend and backend.
