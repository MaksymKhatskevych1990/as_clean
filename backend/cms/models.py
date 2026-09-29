from django.db import models


class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class OrderedModel(models.Model):
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        abstract = True
        ordering = ['order', 'id']


class SeoSettings(SingletonModel):
    meta_title = models.CharField('Title', max_length=255, blank=True)
    meta_description = models.TextField('Description', blank=True)
    robots = models.CharField('Robots', max_length=120, blank=True, default='index, follow')
    canonical_url = models.URLField('Canonical URL', blank=True)
    og_title = models.CharField('OG title', max_length=255, blank=True)
    og_description = models.TextField('OG description', blank=True)
    og_image = models.ImageField('OG image', upload_to='seo/', blank=True)
    og_image_url = models.URLField('OG image URL', blank=True)
    og_type = models.CharField('OG type', max_length=50, blank=True, default='website')
    og_locale = models.CharField('OG locale', max_length=20, blank=True, default='uk_UA')
    twitter_card = models.CharField('Twitter card', max_length=50, blank=True, default='summary_large_image')
    twitter_title = models.CharField('Twitter title', max_length=255, blank=True)
    twitter_description = models.TextField('Twitter description', blank=True)
    twitter_image = models.ImageField('Twitter image', upload_to='seo/', blank=True)
    twitter_image_url = models.URLField('Twitter image URL', blank=True)

    class Meta:
        verbose_name = 'SEO'
        verbose_name_plural = 'SEO'

    def __str__(self):
        return 'SEO'


class TelegramSettings(SingletonModel):
    is_enabled = models.BooleanField('Увімкнено', default=False)
    bot_token = models.CharField('Токен бота', max_length=255, blank=True)
    chat_id = models.CharField('Chat ID', max_length=64, blank=True)

    class Meta:
        verbose_name = 'Telegram'
        verbose_name_plural = 'Telegram'

    def __str__(self):
        return 'Telegram'


class SiteChrome(SingletonModel):
    brand_primary = models.CharField('Бренд (перша частина)', max_length=80, default='AS')
    brand_accent = models.CharField('Бренд (акцент)', max_length=80, default='clean')
    header_cta_text = models.CharField('Кнопка в шапці', max_length=80, default='Замовити прибирання')
    floating_button_text = models.CharField('Плаваюча кнопка', max_length=80, default='Замовити')
    footer_tagline = models.TextField('Текст у футері', blank=True)
    footer_nav_title = models.CharField('Заголовок навігації у футері', max_length=80, default='Навігація')
    footer_services_title = models.CharField('Заголовок послуг у футері', max_length=80, default='Послуги')
    copyright_name = models.CharField('Назва в copyright', max_length=120, default='AS clean')
    privacy_label = models.CharField('Посилання: конфіденційність', max_length=80, default='Конфіденційність')
    privacy_url = models.CharField('URL конфіденційності', max_length=255, blank=True, default='#')
    terms_label = models.CharField('Посилання: умови', max_length=80, default='Умови')
    terms_url = models.CharField('URL умов', max_length=255, blank=True, default='#')

    class Meta:
        verbose_name = 'Шапка і футер'
        verbose_name_plural = 'Шапка і футер'

    def __str__(self):
        return 'Шапка і футер'


class SectionVisibility(SingletonModel):
    show_hero = models.BooleanField('Hero', default=True)
    show_services = models.BooleanField('Послуги', default=False)
    show_why_us = models.BooleanField('Чому ми / про компанію', default=False)
    show_stats = models.BooleanField('Статистика', default=False)
    show_portfolio = models.BooleanField('До і після', default=False)
    show_videos = models.BooleanField('Відео', default=False)
    show_pricing = models.BooleanField('Ціни', default=False)
    show_testimonials = models.BooleanField('Відгуки', default=False)
    show_faq = models.BooleanField('FAQ', default=False)
    show_booking = models.BooleanField('Форма замовлення', default=True)
    show_contact = models.BooleanField('Контакти', default=True)

    class Meta:
        verbose_name = 'Видимість секцій'
        verbose_name_plural = 'Видимість секцій'

    def __str__(self):
        return 'Видимість секцій'


class NavLink(OrderedModel):
    href = models.CharField('Якір / URL', max_length=120)
    label = models.CharField('Текст', max_length=80)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Пункт меню'
        verbose_name_plural = 'Меню'

    def __str__(self):
        return self.label


class FooterService(OrderedModel):
    title = models.CharField('Назва', max_length=120)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Послуга у футері'
        verbose_name_plural = 'Послуги у футері'

    def __str__(self):
        return self.title


class Hero(SingletonModel):
    eyebrow = models.CharField('Надзаголовок', max_length=255, blank=True)
    title = models.TextField('Заголовок')
    subtitle = models.TextField('Підзаголовок', blank=True)
    primary_cta_text = models.CharField('Основна кнопка', max_length=80, default='Замовити прибирання')
    primary_cta_href = models.CharField('URL основної кнопки', max_length=120, default='#booking')
    secondary_cta_text = models.CharField('Друга кнопка', max_length=80, default='Подивитись роботи')
    secondary_cta_href = models.CharField('URL другої кнопки', max_length=120, default='#portfolio')
    image = models.ImageField('Фото', upload_to='hero/', blank=True)
    image_url = models.URLField('Фото (URL)', blank=True)
    image_alt = models.CharField('Alt фото', max_length=255, blank=True)
    caption = models.CharField('Підпис під фото', max_length=255, blank=True)

    class Meta:
        verbose_name = 'Hero'
        verbose_name_plural = 'Hero'

    def __str__(self):
        return 'Hero'


class TrustBadge(OrderedModel):
    text = models.CharField('Текст', max_length=255)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Бейдж довіри'
        verbose_name_plural = 'Бейджі довіри'

    def __str__(self):
        return self.text


class ServicesSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Послуги')
    subtitle = models.TextField('Підзаголовок', blank=True)

    class Meta:
        verbose_name = 'Секція послуг'
        verbose_name_plural = 'Секція послуг'

    def __str__(self):
        return self.title


class Service(OrderedModel):
    title = models.CharField('Назва', max_length=160)
    description = models.TextField('Опис')
    image = models.ImageField('Фото', upload_to='services/', blank=True)
    image_url = models.URLField('Фото (URL)', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Послуга'
        verbose_name_plural = 'Послуги'

    def __str__(self):
        return self.title


class WhyUsSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Чому нас обирають')
    subtitle = models.TextField('Підзаголовок', blank=True)

    class Meta:
        verbose_name = 'Секція «Чому ми»'
        verbose_name_plural = 'Секція «Чому ми»'

    def __str__(self):
        return self.title


class Advantage(OrderedModel):
    title = models.CharField('Заголовок', max_length=160)
    description = models.TextField('Опис')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Перевага'
        verbose_name_plural = 'Переваги'

    def __str__(self):
        return self.title


class Statistic(OrderedModel):
    value = models.FloatField('Число')
    suffix = models.CharField('Суфікс', max_length=20, blank=True)
    label = models.CharField('Підпис', max_length=80)
    decimals = models.PositiveSmallIntegerField('Знаків після коми', default=0)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Статистика'
        verbose_name_plural = 'Статистика'

    def __str__(self):
        return self.label


class PortfolioSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='До і після')
    subtitle = models.TextField('Підзаголовок', blank=True)
    all_category_label = models.CharField('Мітка «Усі»', max_length=40, default='Усі')
    before_label = models.CharField('Підпис «До»', max_length=40, default='До')
    after_label = models.CharField('Підпис «Після»', max_length=40, default='Після')

    class Meta:
        verbose_name = 'Налаштування блоку «До і після»'
        verbose_name_plural = 'Налаштування блоку «До і після»'

    def __str__(self):
        return 'Налаштування блоку «До і після»'


class PortfolioCategory(OrderedModel):
    name = models.CharField('Назва', max_length=80, unique=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Категорія «До і після»'
        verbose_name_plural = 'Категорії «До і після»'

    def __str__(self):
        return self.name


class PortfolioItem(OrderedModel):
    category = models.ForeignKey(PortfolioCategory, on_delete=models.PROTECT, related_name='items', verbose_name='Категорія')
    title = models.CharField('Назва', max_length=200)
    before_image = models.ImageField(
        'Фото «До»',
        upload_to='portfolio/before/',
        blank=True,
        help_text='Завантажте фото до прибирання',
    )
    before_image_url = models.URLField('Або URL фото «До»', blank=True)
    after_image = models.ImageField(
        'Фото «Після»',
        upload_to='portfolio/after/',
        blank=True,
        help_text='Завантажте фото після прибирання',
    )
    after_image_url = models.URLField('Або URL фото «Після»', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Фото «До і після»'
        verbose_name_plural = 'Фото «До і після»'

    def __str__(self):
        return self.title


class VideosSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Як ми працюємо')

    class Meta:
        verbose_name = 'Секція відео'
        verbose_name_plural = 'Секція відео'

    def __str__(self):
        return self.title


class VideoItem(OrderedModel):
    section = models.ForeignKey(
        VideosSection,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Секція',
        default=1,
    )
    title = models.CharField('Назва', max_length=200)
    description = models.TextField('Опис', blank=True)
    thumbnail = models.ImageField('Превʼю', upload_to='videos/thumbs/', blank=True)
    thumbnail_url = models.URLField('Превʼю (URL)', blank=True)
    video = models.FileField(
        'Відеофайл',
        upload_to='videos/',
        blank=True,
        help_text='MP4 / WebM, бажано до 80 МБ',
    )
    video_url = models.URLField(
        'Або посилання на відео',
        blank=True,
        help_text='YouTube, Vimeo або прямий URL на MP4',
    )

    class Meta(OrderedModel.Meta):
        verbose_name = 'Відео'
        verbose_name_plural = 'Відео'

    def __str__(self):
        return self.title


class PricingSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Ціни')
    subtitle = models.TextField('Підзаголовок', blank=True)

    class Meta:
        verbose_name = 'Секція цін'
        verbose_name_plural = 'Секція цін'

    def __str__(self):
        return self.title


class PricingPlan(OrderedModel):
    name = models.CharField('Назва', max_length=80)
    price = models.CharField('Ціна', max_length=40)
    unit = models.CharField('Одиниця', max_length=20, default='грн')
    description = models.TextField('Опис', blank=True)
    highlighted = models.BooleanField('Виділений', default=False)
    cta_text = models.CharField('Текст кнопки', max_length=80, default='Замовити')

    class Meta(OrderedModel.Meta):
        verbose_name = 'Тариф'
        verbose_name_plural = 'Тарифи'

    def __str__(self):
        return self.name


class PricingFeature(OrderedModel):
    plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE, related_name='features', verbose_name='Тариф')
    text = models.CharField('Пункт', max_length=255)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Пункт тарифу'
        verbose_name_plural = 'Пункти тарифів'

    def __str__(self):
        return self.text


class TestimonialsSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Відгуки клієнтів')

    class Meta:
        verbose_name = 'Секція відгуків'
        verbose_name_plural = 'Секція відгуків'

    def __str__(self):
        return self.title


class Testimonial(OrderedModel):
    name = models.CharField('Імʼя', max_length=120)
    role = models.CharField('Роль', max_length=160, blank=True)
    text = models.TextField('Текст')
    rating = models.PositiveSmallIntegerField('Оцінка', default=5)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Відгук'
        verbose_name_plural = 'Відгуки'

    def __str__(self):
        return self.name


class FAQSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Часті запитання')

    class Meta:
        verbose_name = 'Секція FAQ'
        verbose_name_plural = 'Секція FAQ'

    def __str__(self):
        return self.title


class FAQItem(OrderedModel):
    question = models.CharField('Питання', max_length=255)
    answer = models.TextField('Відповідь')

    class Meta(OrderedModel.Meta):
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQ'

    def __str__(self):
        return self.question


class BookingSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Замовте прибирання за 2 хвилини')
    step_contacts = models.CharField('Крок 1', max_length=40, default='Контакти')
    step_object = models.CharField('Крок 2', max_length=40, default='Обʼєкт')
    step_details = models.CharField('Крок 3', max_length=40, default='Деталі')
    name_label = models.CharField('Імʼя: підпис', max_length=80, default='Імʼя')
    name_placeholder = models.CharField('Імʼя: плейсхолдер', max_length=80, default='Ваше імʼя')
    phone_label = models.CharField('Телефон: підпис', max_length=80, default='Телефон')
    phone_placeholder = models.CharField('Телефон: плейсхолдер', max_length=80, default='+380 XX XXX XX XX')
    email_label = models.CharField('Email: підпис', max_length=80, default='Email')
    email_placeholder = models.CharField('Email: плейсхолдер', max_length=80, default='email@example.com')
    address_label = models.CharField('Адреса: підпис', max_length=80, default='Адреса')
    address_placeholder = models.CharField('Адреса: плейсхолдер', max_length=120, default='Вулиця, будинок, квартира')
    property_type_label = models.CharField('Тип приміщення: підпис', max_length=80, default='Тип приміщення')
    property_type_placeholder = models.CharField('Тип приміщення: плейсхолдер', max_length=80, default='Оберіть тип')
    area_label = models.CharField('Площа: підпис', max_length=80, default='Площа (м²)')
    area_placeholder = models.CharField('Площа: плейсхолдер', max_length=80, default='Наприклад, 65')
    cleaning_type_label = models.CharField('Вид прибирання: підпис', max_length=80, default='Вид прибирання')
    cleaning_type_placeholder = models.CharField('Вид прибирання: плейсхолдер', max_length=80, default='Оберіть вид')
    date_label = models.CharField('Дата: підпис', max_length=80, default='Бажана дата')
    time_label = models.CharField('Час: підпис', max_length=80, default='Бажаний час')
    time_placeholder = models.CharField('Час: плейсхолдер', max_length=80, default='Оберіть час')
    comment_label = models.CharField('Коментар: підпис', max_length=80, default='Коментар')
    comment_placeholder = models.CharField('Коментар: плейсхолдер', max_length=255, default='Додаткові побажання або особливості обʼєкта')
    photos_label = models.CharField('Фото: підпис', max_length=80, default='Завантажити фотографії')
    photos_hint = models.CharField('Фото: підказка', max_length=255, default='Натисніть або перетягніть файли сюди')
    photos_note = models.CharField('Фото: формат', max_length=120, default='PNG, JPG до 10 МБ')
    back_text = models.CharField('Кнопка «Назад»', max_length=40, default='Назад')
    next_text = models.CharField('Кнопка «Далі»', max_length=40, default='Далі')
    submit_text = models.CharField('Кнопка відправки', max_length=80, default='Замовити прибирання')
    success_title = models.CharField('Успіх: заголовок', max_length=160, default='Заявку надіслано!')
    success_text = models.TextField(
        'Успіх: текст',
        default='Дякуємо, {name}. Менеджер звʼяжеться з вами протягом 15 хвилин для підтвердження деталей.',
        help_text='Можна використати {name}',
    )

    class Meta:
        verbose_name = 'Форма замовлення'
        verbose_name_plural = 'Форма замовлення'

    def __str__(self):
        return 'Форма замовлення'


class PropertyType(OrderedModel):
    name = models.CharField('Назва', max_length=80)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Тип приміщення'
        verbose_name_plural = 'Типи приміщень'

    def __str__(self):
        return self.name


class CleaningType(OrderedModel):
    name = models.CharField('Назва', max_length=80)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Вид прибирання'
        verbose_name_plural = 'Види прибирання'

    def __str__(self):
        return self.name


class TimeSlot(OrderedModel):
    label = models.CharField('Інтервал', max_length=40)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Часовий слот'
        verbose_name_plural = 'Часові слоти'

    def __str__(self):
        return self.label


class ContactSection(SingletonModel):
    title = models.CharField('Заголовок', max_length=255, default='Контакти')
    map_embed_url = models.TextField('URL карти (iframe)', blank=True)
    map_title = models.CharField('Title карти', max_length=160, blank=True)

    class Meta:
        verbose_name = 'Секція контактів'
        verbose_name_plural = 'Секція контактів'

    def __str__(self):
        return self.title


class ContactCard(OrderedModel):
    label = models.CharField('Підпис', max_length=80)
    value = models.CharField('Значення', max_length=255, blank=True)
    href = models.CharField('Посилання', max_length=255, blank=True)
    tint = models.CharField(
        'Колір',
        max_length=20,
        choices=[
            ('peach', 'peach'),
            ('sage', 'sage'),
            ('lavender', 'lavender'),
            ('sky', 'sky'),
        ],
        default='peach',
    )

    class Meta(OrderedModel.Meta):
        verbose_name = 'Картка контакту'
        verbose_name_plural = 'Картки контактів'

    def __str__(self):
        return self.label


class SocialLink(OrderedModel):
    name = models.CharField('Назва', max_length=80)
    url = models.URLField('URL', blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = 'Соцмережа'
        verbose_name_plural = 'Соцмережі'

    def __str__(self):
        return self.name


class Booking(models.Model):
    name = models.CharField('Імʼя', max_length=120)
    phone = models.CharField('Телефон', max_length=40)
    email = models.EmailField('Email', blank=True)
    address = models.CharField('Адреса', max_length=255)
    property_type = models.CharField('Тип приміщення', max_length=80)
    area = models.CharField('Площа', max_length=20)
    cleaning_type = models.CharField('Вид прибирання', max_length=80)
    date = models.DateField('Дата')
    time = models.CharField('Час', max_length=40)
    comment = models.TextField('Коментар', blank=True)
    telegram_sent = models.BooleanField('Надіслано в Telegram', default=False)
    telegram_error = models.TextField('Помилка Telegram', blank=True)
    created_at = models.DateTimeField('Створено', auto_now_add=True)

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} · {self.phone}'


class BookingPhoto(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='photos', verbose_name='Заявка')
    image = models.ImageField('Фото', upload_to='bookings/')

    class Meta:
        verbose_name = 'Фото заявки'
        verbose_name_plural = 'Фото заявок'
