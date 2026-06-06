from datetime import timedelta
from pathlib import Path
from urllib.parse import quote

import dj_database_url
from decouple import config


BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config(
    "SECRET_KEY",
    default=config("DJANGO_SECRET_KEY", default="unsafe-development-secret-key-change-me-for-local-development-only"),
)
DEBUG = config("DEBUG", default=config("DJANGO_DEBUG", default=False), cast=bool)
ALLOWED_HOSTS = [
    host.strip()
    for host in config("ALLOWED_HOSTS", default=config("DJANGO_ALLOWED_HOSTS", default="localhost,127.0.0.1")).split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "apps.common",
    "apps.accounts",
    "apps.groups",
    "apps.expenses",
    "apps.settlements",
    "apps.loans",
    "apps.reminders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASE_URL = config("DATABASE_URL", default="")
POSTGRES_DB = config("POSTGRES_DB", default="")
POSTGRES_USER = config("POSTGRES_USER", default="")
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD", default="")
POSTGRES_HOST = config("POSTGRES_HOST", default="localhost")
POSTGRES_PORT = config("POSTGRES_PORT", default="5432")

if DATABASE_URL:
    DEFAULT_DATABASE_URL = DATABASE_URL
elif POSTGRES_DB and POSTGRES_USER:
    DEFAULT_DATABASE_URL = (
        f"postgresql://{quote(POSTGRES_USER)}:{quote(POSTGRES_PASSWORD)}"
        f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{quote(POSTGRES_DB)}"
    )
else:
    DEFAULT_DATABASE_URL = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"

DATABASES = {
    "default": dj_database_url.config(
        default=DEFAULT_DATABASE_URL,
        conn_max_age=600,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kathmandu"
USE_I18N = True
USE_TZ = True

STATIC_URL = config("STATIC_URL", default="static/")
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = config("MEDIA_URL", default="media/")
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.StandardResultsSetPagination",
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),
    "EXCEPTION_HANDLER": "apps.common.exception_handlers.custom_exception_handler",
    "PAGE_SIZE": 20,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=config("ACCESS_TOKEN_LIFETIME_MINUTES", default=30, cast=int)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=config("REFRESH_TOKEN_LIFETIME_DAYS", default=7, cast=int)),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in config("CORS_ALLOWED_ORIGINS", default="http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
