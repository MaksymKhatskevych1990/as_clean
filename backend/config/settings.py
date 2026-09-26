import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-dev-only-change-me')
DEBUG = os.getenv('DJANGO_DEBUG', '1') == '1'
ALLOWED_HOSTS = [host.strip() for host in os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if host.strip()]
if DEBUG:
    ALLOWED_HOSTS = list({*ALLOWED_HOSTS, '*'})
elif SECRET_KEY.startswith('django-insecure-'):
    raise ValueError('Set DJANGO_SECRET_KEY before running with DJANGO_DEBUG=0')

SITE_URL = os.getenv('SITE_URL', 'http://localhost:5173').rstrip('/')
FRONTEND_DIST = Path(os.getenv('FRONTEND_DIST', BASE_DIR.parent / 'clean' / 'dist'))

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'cms',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [FRONTEND_DIST] if FRONTEND_DIST.exists() else [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

_sqlite_path = Path(os.getenv('DJANGO_SQLITE_PATH', BASE_DIR / 'db.sqlite3'))
_sqlite_path.parent.mkdir(parents=True, exist_ok=True)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': _sqlite_path,
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'uk'
TIME_ZONE = 'Europe/Kyiv'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [FRONTEND_DIST] if FRONTEND_DIST.exists() else []
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
if not DEBUG:
    SESSION_COOKIE_SECURE = os.getenv('DJANGO_SECURE', '1') == '1'
    CSRF_COOKIE_SECURE = os.getenv('DJANGO_SECURE', '1') == '1'
    SECURE_SSL_REDIRECT = os.getenv('DJANGO_SECURE', '0') == '1'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]
if SITE_URL and SITE_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(SITE_URL)
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = list({*CORS_ALLOWED_ORIGINS, SITE_URL})

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
}

JAZZMIN_SETTINGS = {
    'site_title': 'AS clean',
    'site_header': 'AS clean',
    'site_brand': 'AS clean',
    'welcome_sign': 'Адмінка сайту AS clean',
    'copyright': 'AS clean',
    'site_logo_classes': 'img-circle',
    'search_model': ['cms.Booking', 'cms.Service'],
    'topmenu_links': [
        {'name': 'Сайт', 'url': f'{SITE_URL}/', 'new_window': True},
        {'name': 'Заявки', 'model': 'cms.booking'},
        {'name': 'Фото «До і після»', 'model': 'cms.portfolioitem'},
    ],
    'show_sidebar': True,
    'navigation_expanded': True,
    'order_with_respect_to': [
        'cms',
        'cms.Booking',
        'cms.TelegramSettings',
        'cms.SeoSettings',
        'cms.SiteChrome',
        'cms.NavLink',
        'cms.Hero',
        'cms.TrustBadge',
        'cms.ServicesSection',
        'cms.Service',
        'cms.WhyUsSection',
        'cms.Advantage',
        'cms.Statistic',
        'cms.PortfolioSection',
        'cms.PortfolioCategory',
        'cms.PortfolioItem',
        'cms.VideosSection',
        'cms.VideoItem',
        'cms.PricingSection',
        'cms.PricingPlan',
        'cms.TestimonialsSection',
        'cms.Testimonial',
        'cms.FAQSection',
        'cms.FAQItem',
        'cms.BookingSection',
        'cms.PropertyType',
        'cms.CleaningType',
        'cms.TimeSlot',
        'cms.ContactSection',
        'cms.ContactCard',
        'cms.SocialLink',
        'cms.FooterService',
        'auth',
    ],
    'icons': {
        'auth': 'fas fa-users-cog',
        'auth.user': 'fas fa-user',
        'auth.Group': 'fas fa-users',
        'cms.Booking': 'fas fa-clipboard-list',
        'cms.TelegramSettings': 'fab fa-telegram',
        'cms.SeoSettings': 'fas fa-search',
        'cms.SiteChrome': 'fas fa-window-maximize',
        'cms.NavLink': 'fas fa-bars',
        'cms.Hero': 'fas fa-star',
        'cms.TrustBadge': 'fas fa-certificate',
        'cms.ServicesSection': 'fas fa-th-large',
        'cms.Service': 'fas fa-broom',
        'cms.WhyUsSection': 'fas fa-heart',
        'cms.Advantage': 'fas fa-check-circle',
        'cms.Statistic': 'fas fa-chart-bar',
        'cms.PortfolioSection': 'fas fa-images',
        'cms.PortfolioCategory': 'fas fa-folder',
        'cms.PortfolioItem': 'fas fa-camera',
        'cms.VideosSection': 'fas fa-film',
        'cms.VideoItem': 'fas fa-video',
        'cms.PricingSection': 'fas fa-tags',
        'cms.PricingPlan': 'fas fa-tag',
        'cms.TestimonialsSection': 'fas fa-comments',
        'cms.Testimonial': 'fas fa-quote-right',
        'cms.FAQSection': 'fas fa-question-circle',
        'cms.FAQItem': 'fas fa-question',
        'cms.BookingSection': 'fas fa-edit',
        'cms.PropertyType': 'fas fa-home',
        'cms.CleaningType': 'fas fa-spray-can',
        'cms.TimeSlot': 'fas fa-clock',
        'cms.ContactSection': 'fas fa-address-book',
        'cms.ContactCard': 'fas fa-phone',
        'cms.SocialLink': 'fas fa-share-alt',
        'cms.FooterService': 'fas fa-list',
        'cms.BookingPhoto': 'fas fa-image',
    },
    'default_icon_parents': 'fas fa-chevron-circle-right',
    'default_icon_children': 'fas fa-circle',
    'related_modal_active': True,
    'changeform_format': 'horizontal_tabs',
}

JAZZMIN_UI_TWEAKS = {
    'navbar_small_text': False,
    'footer_small_text': False,
    'body_small_text': False,
    'brand_small_text': False,
    'brand_colour': 'navbar-success',
    'accent': 'accent-success',
    'navbar': 'navbar-white navbar-light',
    'no_navbar_border': True,
    'navbar_fixed': True,
    'layout_boxed': False,
    'footer_fixed': False,
    'sidebar_fixed': True,
    'sidebar': 'sidebar-dark-success',
    'sidebar_nav_small_text': False,
    'sidebar_disable_expand': False,
    'sidebar_nav_child_indent': True,
    'sidebar_nav_compact_style': False,
    'sidebar_nav_legacy_style': False,
    'sidebar_nav_flat_style': True,
    'theme': 'default',
    'dark_mode_theme': None,
    'button_classes': {
        'primary': 'btn-success',
        'secondary': 'btn-outline-secondary',
        'info': 'btn-info',
        'warning': 'btn-warning',
        'danger': 'btn-danger',
        'success': 'btn-success',
    },
}
