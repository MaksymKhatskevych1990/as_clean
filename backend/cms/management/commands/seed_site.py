import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from cms.models import (
    Advantage,
    BookingSection,
    CleaningType,
    ContactCard,
    ContactSection,
    FAQItem,
    FAQSection,
    FooterService,
    Hero,
    NavLink,
    PortfolioCategory,
    PortfolioItem,
    PortfolioSection,
    PricingFeature,
    PricingPlan,
    PricingSection,
    PropertyType,
    SeoSettings,
    SectionVisibility,
    Service,
    ServicesSection,
    SiteChrome,
    SocialLink,
    Statistic,
    TelegramSettings,
    Testimonial,
    TestimonialsSection,
    TimeSlot,
    TrustBadge,
    VideoItem,
    VideosSection,
    WhyUsSection,
)

LIST_MODELS = [
    NavLink,
    FooterService,
    TrustBadge,
    Service,
    Advantage,
    Statistic,
    PortfolioItem,
    PortfolioCategory,
    VideoItem,
    PricingFeature,
    PricingPlan,
    Testimonial,
    FAQItem,
    PropertyType,
    CleaningType,
    TimeSlot,
    ContactCard,
    SocialLink,
]


class Command(BaseCommand):
    help = 'Заповнює адмінку поточним контентом лендингу'

    def add_arguments(self, parser):
        parser.add_argument('--reset', action='store_true', help='Перезаписати списковий контент')

    def handle(self, *args, **options):
        if NavLink.objects.exists() and not options['reset']:
            self.stdout.write('Контент уже є. Для перезапису: python manage.py seed_site --reset')
            self._ensure_admin()
            return

        if options['reset']:
            for model in LIST_MODELS:
                model.objects.all().delete()

        self._seed_singletons()
        self._seed_lists()
        self._ensure_admin()
        self.stdout.write(self.style.SUCCESS('Контент сайту заповнено'))

    def _ensure_admin(self):
        user_model = get_user_model()
        if user_model.objects.filter(is_superuser=True).exists():
            return
        if os.getenv('DJANGO_DEBUG', '1') != '1':
            return
        user_model.objects.create_superuser('admin', 'admin@ac-clean.local', 'admin')
        self.stdout.write('Створено суперкористувача admin / admin')

    def _seed_singletons(self):
        SeoSettings.objects.update_or_create(
            pk=1,
            defaults={
                'meta_title': 'Прибирання квартир у Дніпрі від 130 грн/м² | AS clean',
                'meta_description': 'Прибирання квартир, будинків і офісів у Дніпрі: базове від 130 грн/м², генеральне від 160, після ремонту від 200. Хімчистка меблів від 1000 грн. Ціну фіксуємо до початку робіт.',
                'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                'canonical_url': 'https://asclean.dp.ua/',
                'og_title': 'Прибирання квартир у Дніпрі від 130 грн/м² | AS clean',
                'og_description': 'Квартири, будинки, офіси, після ремонту і хімчистка меблів у Дніпрі та області. Ціну називаємо до початку робіт.',
                'og_image_url': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&h=630&q=80',
                'og_type': 'website',
                'og_locale': 'uk_UA',
                'twitter_card': 'summary_large_image',
                'twitter_title': 'Прибирання квартир у Дніпрі від 130 грн/м² | AS clean',
                'twitter_description': 'Базове від 130 грн/м², генеральне від 160, після ремонту від 200. Хімчистка меблів від 1000 грн. Дніпро та область.',
                'twitter_image_url': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&h=630&q=80',
            },
        )
        SiteChrome.objects.update_or_create(
            pk=1,
            defaults={
                'brand_primary': 'AS',
                'brand_accent': 'clean',
                'header_cta_text': 'Замовити прибирання',
                'floating_button_text': 'Замовити',
                'footer_tagline': 'Прибираємо квартири, будинки та офіси в Дніпрі та області. Спокійно, акуратно, без зайвого формалізму.',
                'footer_nav_title': 'Навігація',
                'footer_services_title': 'Послуги',
                'copyright_name': 'AS clean',
                'privacy_label': 'Конфіденційність',
                'privacy_url': '#',
                'terms_label': 'Умови',
                'terms_url': '#',
            },
        )
        SectionVisibility.objects.update_or_create(
            pk=1,
            defaults={
                'show_hero': True,
                'show_services': False,
                'show_why_us': False,
                'show_stats': False,
                'show_portfolio': False,
                'show_videos': False,
                'show_pricing': False,
                'show_testimonials': False,
                'show_faq': True,
                'show_booking': True,
                'show_contact': True,
            },
        )
        Hero.objects.update_or_create(
            pk=1,
            defaults={
                'eyebrow': 'Дніпро та область · з 2018 року',
                'title': 'Прибирання квартир у Дніпрі — без зайвого шуму',
                'subtitle': 'Будинки, офіси, прибирання після ремонту і хімчистка меблів. Базове від 130 грн/м² — ціну фіксуємо до початку робіт.',
                'primary_cta_text': 'Замовити прибирання',
                'primary_cta_href': '#booking',
                'secondary_cta_text': 'Подивитись роботи',
                'secondary_cta_href': '#portfolio',
                'image_url': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=900&q=80',
                'image_alt': 'Прибирання квартири у Дніпрі — чиста вітальня після роботи AS clean',
                'caption': '',
            },
        )
        ServicesSection.objects.update_or_create(pk=1, defaults={
            'title': 'Послуги',
            'subtitle': 'Прибирання квартир, будинків і офісів, генеральне, після ремонту та хімчистка меблів у Дніпрі й області.',
        })
        WhyUsSection.objects.update_or_create(pk=1, defaults={
            'title': 'Чому нас обирають',
            'subtitle': 'Невелика команда, зрозумілі правила і людяне спілкування — без «корпоративного» тону.',
        })
        PortfolioSection.objects.update_or_create(pk=1, defaults={
            'title': 'До і після',
            'subtitle': 'Перетягніть повзунок, щоб порівняти «до» та «після».',
            'all_category_label': 'Усі',
            'before_label': 'До',
            'after_label': 'Після',
        })
        VideosSection.objects.update_or_create(pk=1, defaults={'title': 'Як ми працюємо'})
        PricingSection.objects.update_or_create(pk=1, defaults={
            'title': 'Ціни',
            'subtitle': 'Кожна послуга рахується індивідуально. Мінімальне замовлення на прибирання — від 2 500 грн. Сушка меблів після хімчистки — у подарунок.',
        })
        TestimonialsSection.objects.update_or_create(pk=1, defaults={'title': 'Відгуки клієнтів'})
        FAQSection.objects.update_or_create(pk=1, defaults={'title': 'Часті запитання'})
        BookingSection.objects.update_or_create(pk=1, defaults={})
        ContactSection.objects.update_or_create(pk=1, defaults={
            'title': 'Контакти',
            'map_title': 'Карта AS clean у Дніпрі',
            'map_embed_url': 'https://www.openstreetmap.org/export/embed.html?bbox=34.98%2C48.43%2C35.10%2C48.50&layer=mapnik&marker=48.4647%2C35.0462',
        })
        TelegramSettings.objects.update_or_create(pk=1, defaults={'is_enabled': False})

    def _seed_lists(self):
        for order, (href, label) in enumerate([
            ('#hero', 'Головна'),
            ('#services', 'Послуги'),
            ('#portfolio', 'До і після'),
            ('#pricing', 'Ціни'),
            ('#testimonials', 'Відгуки'),
            ('#about', 'Про компанію'),
            ('#contact', 'Контакти'),
        ]):
            NavLink.objects.create(order=order, href=href, label=label)

        for order, title in enumerate(['Генеральне прибирання', 'Після ремонту', 'Миття вікон', 'Хімчистка меблів']):
            FooterService.objects.create(order=order, title=title)

        for order, text in enumerate([
            'Понад 5000 задоволених клієнтів',
            'Гарантія якості',
            'Екологічні засоби',
            'Працюємо 7 днів на тиждень',
        ]):
            TrustBadge.objects.create(order=order, text=text)

        services = [
            ('Прибирання квартир', 'від 130 грн/м²', 'Прибирання квартир у Дніпрі будь-якої площі: від підтримуючого до підготовки перед заселенням.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'),
            ('Прибирання будинків', 'від 130 грн/м²', 'Комплексний догляд за приватними будинками, садовими зонами та великими приміщеннями.', 'https://images.unsplash.com/photo-1527515637462-cff94cdd86dc?w=800&q=80'),
            ('Прибирання офісів', 'від 130 грн/м²', 'Підтримка чистоти робочого простору без перешкод для вашої команди та клієнтів.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'),
            ('Генеральне прибирання', 'від 160 грн/м²', 'Глибоке очищення всіх поверхонь, важкодоступних зон і санвузлів до ідеального блиску.', 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80'),
            ('Після ремонту', 'від 200 грн/м²', 'Видалення будівельного пилу, слідів фарби та підготовка приміщення до заселення.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'),
            ('Миття вікон', '', 'Без розводів і подряпин — професійне миття вікон, балконів та скляних фасадів.', 'https://images.unsplash.com/photo-1523419409543-0c2d524b0f8c?w=800&q=80'),
            ('Хімчистка меблів', 'від 250 грн', 'Оновлення диванів, крісел і матраців із використанням професійного обладнання.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'),
            ('Прибирання Airbnb', 'від 130 грн/м²', 'Швидка підготовка апартаментів між заїздами гостей з контролем якості кожного обʼєкта.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'),
        ]
        for order, (title, price, description, image_url) in enumerate(services):
            Service.objects.create(order=order, title=title, price=price, description=description, image_url=image_url)

        advantages = [
            ('Досвідчені фахівці', 'Команда з навчанням, перевіркою та стажем від 3 років.'),
            ('Сертифіковані засоби', 'Безпечна хімія для дітей, тварин і алергіків.'),
            ('Гарантія результату', 'Безкоштовне доопрацювання, якщо щось не влаштувало.'),
            ('Фіксована вартість', 'Ціна узгоджується до початку робіт без прихованих доплат.'),
            ('Швидкий виїзд', 'Можливе прибирання в день звернення по Дніпру та області.'),
            ('Онлайн-замовлення', 'Замовлення за 2 хвилини через форму або месенджер.'),
            ('Безпечна оплата', 'Готівка, картка або безготівковий розрахунок для бізнесу.'),
            ('Підтримка 24/7', 'Менеджер на звʼязку для зміни часу або термінових замовлень.'),
        ]
        for order, (title, description) in enumerate(advantages):
            Advantage.objects.create(order=order, title=title, description=description)

        stats = [
            (5000, '+', 'клієнтів', 0),
            (12000, '+', 'виконаних замовлень', 0),
            (4.9, '★', 'середня оцінка', 1),
            (8, '', 'років досвіду', 0),
        ]
        for order, (value, suffix, label, decimals) in enumerate(stats):
            Statistic.objects.create(order=order, value=value, suffix=suffix, label=label, decimals=decimals)

        categories = {}
        for order, name in enumerate(['Квартири', 'Офіси', 'Після ремонту', 'Будинки']):
            categories[name] = PortfolioCategory.objects.create(order=order, name=name)

        portfolio = [
            ('Квартири', 'Квартира 85 м², Соборний', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'),
            ('Офіси', 'Офіс IT-компанії, 240 м²', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'),
            ('Після ремонту', 'Квартира після ремонту, Лівобережний', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'),
            ('Будинки', 'Приватний будинок, Дніпровський район', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'),
            ('Квартири', 'Студія 42 м², центр', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'),
            ('Офіси', 'Коворкінг, 120 м²', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'),
        ]
        for order, (category, title, before, after) in enumerate(portfolio):
            PortfolioItem.objects.create(
                order=order,
                category=categories[category],
                title=title,
                before_image_url=before,
                after_image_url=after,
            )

        videos = [
            ('Як ми працюємо', 'Покроковий процес професійного прибирання', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'),
            ('Команда AS clean', 'Знайомство з нашими спеціалістами', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'),
            ('Відгук клієнта', 'Реальний досвід замовлення прибирання', 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80'),
        ]
        for order, (title, description, thumb) in enumerate(videos):
            VideoItem.objects.create(order=order, title=title, description=description, thumbnail_url=thumb)

        plans = [
            ('Базове прибирання', 'від 130', 'грн/м²', 'Підтримуюче прибирання квартир, будинків і офісів.', False, [
                'Розрахунок за площею', 'Мінімальне замовлення від 2 500 грн',
            ]),
            ('Генеральне прибирання', 'від 160', 'грн/м²', 'Глибоке очищення всіх поверхонь і важкодоступних зон.', True, [
                'Розрахунок за площею', 'Мінімальне замовлення від 2 500 грн',
            ]),
            ('Після ремонту', 'від 200', 'грн/м²', 'Видалення будівельного пилу та підготовка до заселення.', False, [
                'Розрахунок за площею', 'Мінімальне замовлення від 2 500 грн',
            ]),
            ('Матрац дитячий', 'від 1 000', 'грн/сторона', 'Хімчистка дитячого матраца.', False, [
                'Ціна за одну сторону', 'Сушка меблів у подарунок',
            ]),
            ('Матрац дорослий', 'від 1 300', 'грн/сторона', 'Хімчистка дорослого матраца.', False, [
                'Ціна за одну сторону', 'Сушка меблів у подарунок',
            ]),
            ('Диван стандарт', 'від 1 500', 'грн', 'Хімчистка стандартного дивана.', False, [
                'Сушка меблів у подарунок',
            ]),
            ('Стільці', 'від 250', 'грн', 'Хімчистка стільців.', False, [
                'Сушка меблів у подарунок',
            ]),
        ]
        for order, (name, price, unit, description, highlighted, features) in enumerate(plans):
            plan = PricingPlan.objects.create(
                order=order, name=name, price=price, unit=unit,
                description=description, highlighted=highlighted, cta_text='Замовити',
            )
            for feature_order, text in enumerate(features):
                PricingFeature.objects.create(plan=plan, order=feature_order, text=text)

        testimonials = [
            ('Олена Коваленко', 'Власниця квартири', 'Замовляла генеральне прибирання перед переїздом. Команда приїхала вчасно, працювала акуратно, навіть не помітила, що хтось був у квартирі — просто ідеальна чистота.'),
            ('Андрій Мельник', 'Керівник офісу', 'Обслуговуємо офіс на абонементі вже пів року. Персонал не заважає роботі, а приміщення завжди виглядає презентабельно для клієнтів.'),
            ('Марія Шевченко', 'Власниця Airbnb', 'Дуже зручно, що можна швидко замовити прибирання між гостями. Фото після роботи надсилають одразу — це економить купу часу.'),
            ('Ігор Бондаренко', 'Замовник після ремонту', 'Після будівельного пилу думав, що доведеться прибирати самому. AS clean зробили все за один день — квартира буквально сяє.'),
        ]
        for order, (name, role, text) in enumerate(testimonials):
            Testimonial.objects.create(order=order, name=name, role=role, text=text, rating=5)

        faqs = [
            ('Скільки часу займає прибирання квартири?', 'У середньому прибирання однокімнатної квартири займає 2–3 години, двокімнатної — 3–4 години. Точний час залежить від площі, ступеня забруднення та обраного пакета.'),
            ('Чи потрібно бути вдома під час прибирання?', 'Ні, це не обовʼязково. Багато клієнтів передають ключі курʼєру або залишають код від домофону. Усі співробітники проходять перевірку та працюють за договором.'),
            ('Які засоби ви використовуєте?', 'Ми застосовуємо професійну сертифіковану хімію європейських брендів. За запитом можемо використати лише гіпоалергенні або дитячі засоби.'),
            ('Чи можна замовити прибирання на сьогодні?', 'Так, за наявності вільної бригади ми можемо виїхати в день звернення. Рекомендуємо бронювати заздалегідь у вихідні та святкові дні.'),
            ('Скільки коштує прибирання квартири в Дніпрі?', 'Базове прибирання — від 130 грн/м², генеральне — від 160 грн/м², після ремонту — від 200 грн/м². Хімчистка меблів — від 1000 грн. Точну суму називаємо до початку робіт, без доплат після огляду.'),
            ('Як відбувається оплата?', 'Оплата після завершення робіт готівкою, карткою або безготівково для юридичних осіб. Передоплата не потрібна для стандартних замовлень.'),
        ]
        for order, (question, answer) in enumerate(faqs):
            FAQItem.objects.create(order=order, question=question, answer=answer)

        for order, name in enumerate(['Квартира', 'Будинок', 'Офіс', 'Комерційне приміщення', 'Airbnb / оренда']):
            PropertyType.objects.create(order=order, name=name)
        for order, name in enumerate(['Підтримуюче', 'Генеральне', 'Після ремонту', 'Миття вікон', 'Хімчистка меблів']):
            CleaningType.objects.create(order=order, name=name)
        for order, label in enumerate(['08:00 – 10:00', '10:00 – 12:00', '12:00 – 14:00', '14:00 – 16:00', '16:00 – 18:00', '18:00 – 20:00']):
            TimeSlot.objects.create(order=order, label=label)

        cards = [
            ('Телефон', '', '', 'peach'),
            ('Email', '', '', 'sage'),
            ('Адреса', 'м. Дніпро та область', '', 'lavender'),
            ('Графік', 'Пн–Нд: 08:00 – 22:00', '', 'sky'),
        ]
        for order, (label, value, href, tint) in enumerate(cards):
            ContactCard.objects.create(order=order, label=label, value=value, href=href, tint=tint)

        for order, (name, url) in enumerate([
            ('Instagram', 'https://www.instagram.com/as_clean_dnipro/'),
            ('Facebook', ''),
            ('Telegram', ''),
            ('Viber', ''),
        ]):
            SocialLink.objects.create(order=order, name=name, url=url)
