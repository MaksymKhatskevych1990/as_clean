from django.contrib import admin
from django.urls import reverse

GROUPS = (
    ('leads', 'Заявки', ('Booking', 'TelegramSettings')),
    ('screen', 'Перший екран', ('Hero', 'TrustBadge', 'SectionVisibility')),
    ('offer', 'Послуги і ціни', ('ServicesSection', 'Service', 'PricingSection', 'PricingPlan')),
    (
        'proof',
        'Роботи і довіра',
        (
            'PortfolioSection',
            'PortfolioCategory',
            'PortfolioItem',
            'VideosSection',
            'VideoItem',
            'WhyUsSection',
            'Advantage',
            'Statistic',
            'TestimonialsSection',
            'Testimonial',
            'FAQSection',
            'FAQItem',
        ),
    ),
    ('contacts', 'Контакти', ('ContactSection', 'ContactCard', 'SocialLink')),
    ('chrome', 'Меню і підвал', ('NavLink', 'SiteChrome', 'FooterService', 'SeoSettings')),
    ('form', 'Форма', ('BookingSection', 'PropertyType', 'CleaningType', 'TimeSlot')),
)


def install():
    original = admin.site.get_app_list

    def get_app_list(request, app_label=None):
        app_list = original(request, app_label)
        if app_label:
            return app_list

        cms_models = {}
        other_apps = []
        for app in app_list:
            if app['app_label'] != 'cms':
                other_apps.append(app)
                continue
            for model in app['models']:
                cms_models[model['object_name']] = model

        grouped = []
        used = set()
        for label, name, keys in GROUPS:
            models = []
            for key in keys:
                model = cms_models.get(key)
                if not model:
                    continue
                models.append(model)
                used.add(key)
            if models:
                grouped.append({
                    'name': name,
                    'app_label': label,
                    'app_url': reverse('admin:index'),
                    'has_module_perms': True,
                    'models': models,
                })

        for app in other_apps:
            if app['app_label'] == 'auth':
                app['name'] = 'Користувачі'

        leftover = [model for key, model in cms_models.items() if key not in used]
        if leftover:
            grouped.append({
                'name': 'Інше',
                'app_label': 'cms',
                'app_url': reverse('admin:index'),
                'has_module_perms': True,
                'models': leftover,
            })
        return grouped + other_apps

    admin.site.get_app_list = get_app_list
