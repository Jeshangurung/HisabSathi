# Production Checklist

Use this checklist before inviting real users to HisabSathi.

## Configuration

- [ ] `DEBUG=False` in production.
- [ ] `SECRET_KEY` is strong, private, and not committed.
- [ ] `DJANGO_SETTINGS_MODULE=config.settings.production`.
- [ ] `ALLOWED_HOSTS` includes every backend hostname.
- [ ] `CORS_ALLOWED_ORIGINS` includes every frontend URL.
- [ ] PostgreSQL is configured through `DATABASE_URL` or equivalent provider variables.
- [ ] JWT access and refresh token lifetimes are reviewed.
- [ ] HTTPS is enabled for frontend and backend.

## Data and Security

- [ ] Media storage is planned for payment proof, receipt images, QR images, and avatars.
- [ ] Admin URL is secured, monitored, or access-limited.
- [ ] Error handling and API responses are reviewed.
- [ ] Backups are planned and tested.
- [ ] Test accounts and test groups are removed from production.
- [ ] User data privacy note is prepared for early users.
- [ ] Payment integration is not yet enabled; payment proof is manual only.

## Operations

- [ ] Migrations run successfully with `python manage.py migrate --noinput`.
- [ ] Static files are collected with `python manage.py collectstatic --noinput`.
- [ ] A production superuser is created and stored securely.
- [ ] Frontend `VITE_API_BASE_URL` points to the production backend and includes `/api`.
- [ ] Backend health is checked after deploy.
- [ ] Frontend routes load after deploy and refresh correctly.
- [ ] Manual MVP flow is tested with two fresh users.

## Launch Readiness

- [ ] First user group is identified.
- [ ] Feedback collection channel is ready.
- [ ] Known limitations are explained to testers.
- [ ] Support contact is visible to early users.
- [ ] A rollback plan exists for backend and frontend deploys.
