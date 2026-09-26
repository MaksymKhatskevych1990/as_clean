from django.contrib import admin
from django.forms import PasswordInput
from django.utils.html import format_html

from . import models


def thumb(url, alt=''):
    if not url:
        return '—'
    return format_html(
        '<img src="{}" alt="{}" style="width:72px;height:54px;object-fit:cover;border-radius:8px;" />',
        url,
        alt,
    )


class SingletonAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class OrderedAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'order')
    list_editable = ('order',)
    ordering = ('order', 'id')


@admin.register(models.SeoSettings)
class SeoSettingsAdmin(SingletonAdmin):
    fieldsets = (
        ('Базові мета', {
            'fields': ('meta_title', 'meta_description', 'robots', 'canonical_url'),
            'description': 'charset, viewport, favicon і підключення шрифтів залишаються в HTML.',
        }),
        ('Open Graph', {
            'fields': ('og_title', 'og_description', 'og_image', 'og_image_url', 'og_type', 'og_locale'),
        }),
        ('Twitter', {
            'fields': ('twitter_card', 'twitter_title', 'twitter_description', 'twitter_image', 'twitter_image_url'),
        }),
    )


@admin.register(models.TelegramSettings)
class TelegramSettingsAdmin(SingletonAdmin):
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'bot_token':
            kwargs['widget'] = PasswordInput(render_value=True)
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    fields = ('is_enabled', 'bot_token', 'chat_id')


@admin.register(models.SiteChrome)
class SiteChromeAdmin(SingletonAdmin):
    fieldsets = (
        ('Шапка', {'fields': ('brand_primary', 'brand_accent', 'header_cta_text', 'floating_button_text')}),
        ('Футер', {
            'fields': (
                'footer_tagline',
                'footer_nav_title',
                'footer_services_title',
                'copyright_name',
                'privacy_label',
                'privacy_url',
                'terms_label',
                'terms_url',
            ),
        }),
    )


@admin.register(models.NavLink)
class NavLinkAdmin(OrderedAdmin):
    list_display = ('label', 'href', 'order')
    list_editable = ('order',)


@admin.register(models.FooterService)
class FooterServiceAdmin(OrderedAdmin):
    pass


@admin.register(models.Hero)
class HeroAdmin(SingletonAdmin):
    readonly_fields = ('image_preview',)
    fieldsets = (
        ('Тексти', {'fields': ('eyebrow', 'title', 'subtitle', 'caption')}),
        ('Кнопки', {'fields': ('primary_cta_text', 'primary_cta_href', 'secondary_cta_text', 'secondary_cta_href')}),
        ('Фото', {'fields': ('image_preview', 'image', 'image_url', 'image_alt')}),
    )

    def image_preview(self, obj):
        return thumb(obj.image.url if obj.image else obj.image_url, obj.image_alt)

    image_preview.short_description = 'Превʼю'


@admin.register(models.TrustBadge)
class TrustBadgeAdmin(OrderedAdmin):
    pass


@admin.register(models.ServicesSection)
class ServicesSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.Service)
class ServiceAdmin(OrderedAdmin):
    list_display = ('preview', 'title', 'order')
    list_editable = ('order',)
    readonly_fields = ('preview',)
    fields = ('title', 'description', 'preview', 'image', 'image_url', 'order')

    def preview(self, obj):
        return thumb(obj.image.url if obj.image else obj.image_url, obj.title)

    preview.short_description = 'Фото'


@admin.register(models.WhyUsSection)
class WhyUsSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.Advantage)
class AdvantageAdmin(OrderedAdmin):
    list_display = ('title', 'order')
    list_editable = ('order',)


@admin.register(models.Statistic)
class StatisticAdmin(OrderedAdmin):
    list_display = ('label', 'value', 'suffix', 'decimals', 'order')
    list_editable = ('order',)


@admin.register(models.PortfolioSection)
class PortfolioSectionAdmin(SingletonAdmin):
    fields = ('title', 'subtitle', 'all_category_label', 'before_label', 'after_label')


@admin.register(models.PortfolioCategory)
class PortfolioCategoryAdmin(OrderedAdmin):
    pass


@admin.register(models.PortfolioItem)
class PortfolioItemAdmin(OrderedAdmin):
    list_display = ('preview', 'title', 'category', 'order')
    list_editable = ('order',)
    list_filter = ('category',)
    readonly_fields = ('preview',)
    fieldsets = (
        ('Картка на сайті', {'fields': ('title', 'category', 'order')}),
        ('Фото «До»', {'fields': ('before_image', 'before_image_url')}),
        ('Фото «Після»', {'fields': ('after_image', 'after_image_url')}),
        ('Превʼю', {'fields': ('preview',)}),
    )

    def preview(self, obj):
        before = obj.before_image.url if obj.before_image else obj.before_image_url
        after = obj.after_image.url if obj.after_image else obj.after_image_url
        return format_html('{} {}', thumb(before, 'До'), thumb(after, 'Після'))

    preview.short_description = 'До / Після'


@admin.register(models.VideosSection)
class VideosSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.VideoItem)
class VideoItemAdmin(OrderedAdmin):
    list_display = ('preview', 'title', 'order')
    list_editable = ('order',)
    readonly_fields = ('preview',)
    fields = ('title', 'description', 'preview', 'thumbnail', 'thumbnail_url', 'video', 'video_url', 'order')

    def preview(self, obj):
        return thumb(obj.thumbnail.url if obj.thumbnail else obj.thumbnail_url, obj.title)

    preview.short_description = 'Превʼю'


@admin.register(models.PricingSection)
class PricingSectionAdmin(SingletonAdmin):
    pass


class PricingFeatureInline(admin.TabularInline):
    model = models.PricingFeature
    extra = 1


@admin.register(models.PricingPlan)
class PricingPlanAdmin(OrderedAdmin):
    list_display = ('name', 'price', 'highlighted', 'order')
    list_editable = ('order',)
    inlines = [PricingFeatureInline]


@admin.register(models.TestimonialsSection)
class TestimonialsSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.Testimonial)
class TestimonialAdmin(OrderedAdmin):
    list_display = ('name', 'role', 'rating', 'order')
    list_editable = ('order',)


@admin.register(models.FAQSection)
class FAQSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.FAQItem)
class FAQItemAdmin(OrderedAdmin):
    list_display = ('question', 'order')
    list_editable = ('order',)


@admin.register(models.BookingSection)
class BookingSectionAdmin(SingletonAdmin):
    fieldsets = (
        ('Заголовки', {'fields': ('title', 'step_contacts', 'step_object', 'step_details')}),
        ('Поля кроку 1', {
            'fields': (
                'name_label', 'name_placeholder',
                'phone_label', 'phone_placeholder',
                'email_label', 'email_placeholder',
            ),
        }),
        ('Поля кроку 2', {
            'fields': (
                'address_label', 'address_placeholder',
                'property_type_label', 'property_type_placeholder',
                'area_label', 'area_placeholder',
                'cleaning_type_label', 'cleaning_type_placeholder',
            ),
        }),
        ('Поля кроку 3', {
            'fields': (
                'date_label',
                'time_label', 'time_placeholder',
                'comment_label', 'comment_placeholder',
                'photos_label', 'photos_hint', 'photos_note',
            ),
        }),
        ('Кнопки та успіх', {'fields': ('back_text', 'next_text', 'submit_text', 'success_title', 'success_text')}),
    )


@admin.register(models.PropertyType)
class PropertyTypeAdmin(OrderedAdmin):
    pass


@admin.register(models.CleaningType)
class CleaningTypeAdmin(OrderedAdmin):
    pass


@admin.register(models.TimeSlot)
class TimeSlotAdmin(OrderedAdmin):
    pass


@admin.register(models.ContactSection)
class ContactSectionAdmin(SingletonAdmin):
    pass


@admin.register(models.ContactCard)
class ContactCardAdmin(OrderedAdmin):
    list_display = ('label', 'value', 'order')
    list_editable = ('order',)


@admin.register(models.SocialLink)
class SocialLinkAdmin(OrderedAdmin):
    list_display = ('name', 'url', 'order')
    list_editable = ('order',)


class BookingPhotoInline(admin.TabularInline):
    model = models.BookingPhoto
    extra = 0
    readonly_fields = ('image',)


@admin.register(models.Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'cleaning_type', 'date', 'time', 'telegram_sent', 'created_at')
    list_filter = ('telegram_sent', 'cleaning_type', 'created_at')
    search_fields = ('name', 'phone', 'email', 'address')
    readonly_fields = (
        'name', 'phone', 'email', 'address', 'property_type', 'area',
        'cleaning_type', 'date', 'time', 'comment', 'telegram_sent', 'telegram_error', 'created_at',
    )
    inlines = [BookingPhotoInline]
