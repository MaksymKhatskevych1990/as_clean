from rest_framework import serializers

from .media import media_url
from .models import (
    Advantage,
    Booking,
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
    PricingPlan,
    PricingSection,
    PropertyType,
    SeoSettings,
    Service,
    ServicesSection,
    SiteChrome,
    SocialLink,
    Statistic,
    Testimonial,
    TestimonialsSection,
    TimeSlot,
    TrustBadge,
    VideoItem,
    VideosSection,
    WhyUsSection,
)


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            'name', 'phone', 'email', 'address', 'property_type', 'area',
            'cleaning_type', 'date', 'time', 'comment',
        )
        extra_kwargs = {'email': {'required': False, 'allow_blank': True}}


def serialize_site(request):
    seo = SeoSettings.load()
    chrome = SiteChrome.load()
    hero = Hero.load()
    services_section = ServicesSection.load()
    why_us = WhyUsSection.load()
    portfolio = PortfolioSection.load()
    videos = VideosSection.load()
    pricing = PricingSection.load()
    testimonials = TestimonialsSection.load()
    faq = FAQSection.load()
    booking = BookingSection.load()
    contacts = ContactSection.load()

    return {
        'seo': {
            'title': seo.meta_title,
            'description': seo.meta_description,
            'robots': seo.robots,
            'canonical': seo.canonical_url,
            'og_title': seo.og_title or seo.meta_title,
            'og_description': seo.og_description or seo.meta_description,
            'og_image': media_url(request, seo.og_image, seo.og_image_url),
            'og_type': seo.og_type,
            'og_locale': seo.og_locale,
            'twitter_card': seo.twitter_card,
            'twitter_title': seo.twitter_title or seo.og_title or seo.meta_title,
            'twitter_description': seo.twitter_description or seo.og_description or seo.meta_description,
            'twitter_image': media_url(request, seo.twitter_image, seo.twitter_image_url) or media_url(request, seo.og_image, seo.og_image_url),
        },
        'header': {
            'brand_primary': chrome.brand_primary,
            'brand_accent': chrome.brand_accent,
            'cta_text': chrome.header_cta_text,
            'nav': [{'href': item.href, 'label': item.label} for item in NavLink.objects.all()],
        },
        'floating_button': chrome.floating_button_text,
        'footer': {
            'brand_primary': chrome.brand_primary,
            'brand_accent': chrome.brand_accent,
            'tagline': chrome.footer_tagline,
            'nav_title': chrome.footer_nav_title,
            'services_title': chrome.footer_services_title,
            'services': [item.title for item in FooterService.objects.all()],
            'copyright_name': chrome.copyright_name,
            'privacy_label': chrome.privacy_label,
            'privacy_url': chrome.privacy_url,
            'terms_label': chrome.terms_label,
            'terms_url': chrome.terms_url,
        },
        'hero': {
            'eyebrow': hero.eyebrow,
            'title': hero.title,
            'subtitle': hero.subtitle,
            'primary_cta_text': hero.primary_cta_text,
            'primary_cta_href': hero.primary_cta_href,
            'secondary_cta_text': hero.secondary_cta_text,
            'secondary_cta_href': hero.secondary_cta_href,
            'image': media_url(request, hero.image, hero.image_url),
            'image_alt': hero.image_alt,
            'caption': hero.caption,
            'badges': [item.text for item in TrustBadge.objects.all()],
        },
        'services': {
            'title': services_section.title,
            'subtitle': services_section.subtitle,
            'items': [
                {
                    'title': item.title,
                    'description': item.description,
                    'image': media_url(request, item.image, item.image_url),
                }
                for item in Service.objects.all()
            ],
        },
        'why_us': {
            'title': why_us.title,
            'subtitle': why_us.subtitle,
            'items': [{'title': item.title, 'description': item.description} for item in Advantage.objects.all()],
        },
        'stats': [
            {
                'value': item.value,
                'suffix': item.suffix,
                'label': item.label,
                'decimals': item.decimals,
            }
            for item in Statistic.objects.all()
        ],
        'portfolio': {
            'title': portfolio.title,
            'subtitle': portfolio.subtitle,
            'all_category_label': portfolio.all_category_label,
            'before_label': portfolio.before_label,
            'after_label': portfolio.after_label,
            'categories': [item.name for item in PortfolioCategory.objects.all()],
            'items': [
                {
                    'title': item.title,
                    'category': item.category.name,
                    'before': media_url(request, item.before_image, item.before_image_url),
                    'after': media_url(request, item.after_image, item.after_image_url),
                }
                for item in PortfolioItem.objects.select_related('category')
            ],
        },
        'videos': {
            'title': videos.title,
            'items': [
                {
                    'title': item.title,
                    'description': item.description,
                    'thumb': media_url(request, item.thumbnail, item.thumbnail_url),
                    'video': media_url(request, item.video, item.video_url),
                }
                for item in VideoItem.objects.all()
            ],
        },
        'pricing': {
            'title': pricing.title,
            'subtitle': pricing.subtitle,
            'plans': [
                {
                    'name': plan.name,
                    'price': plan.price,
                    'unit': plan.unit,
                    'description': plan.description,
                    'highlighted': plan.highlighted,
                    'cta_text': plan.cta_text,
                    'features': [feature.text for feature in plan.features.all()],
                }
                for plan in PricingPlan.objects.prefetch_related('features')
            ],
        },
        'testimonials': {
            'title': testimonials.title,
            'items': [
                {'name': item.name, 'role': item.role, 'text': item.text, 'rating': item.rating}
                for item in Testimonial.objects.all()
            ],
        },
        'faq': {
            'title': faq.title,
            'items': [{'question': item.question, 'answer': item.answer} for item in FAQItem.objects.all()],
        },
        'booking': {
            'title': booking.title,
            'steps': [booking.step_contacts, booking.step_object, booking.step_details],
            'name_label': booking.name_label,
            'name_placeholder': booking.name_placeholder,
            'phone_label': booking.phone_label,
            'phone_placeholder': booking.phone_placeholder,
            'email_label': booking.email_label,
            'email_placeholder': booking.email_placeholder,
            'address_label': booking.address_label,
            'address_placeholder': booking.address_placeholder,
            'property_type_label': booking.property_type_label,
            'property_type_placeholder': booking.property_type_placeholder,
            'area_label': booking.area_label,
            'area_placeholder': booking.area_placeholder,
            'cleaning_type_label': booking.cleaning_type_label,
            'cleaning_type_placeholder': booking.cleaning_type_placeholder,
            'date_label': booking.date_label,
            'time_label': booking.time_label,
            'time_placeholder': booking.time_placeholder,
            'comment_label': booking.comment_label,
            'comment_placeholder': booking.comment_placeholder,
            'photos_label': booking.photos_label,
            'photos_hint': booking.photos_hint,
            'photos_note': booking.photos_note,
            'back_text': booking.back_text,
            'next_text': booking.next_text,
            'submit_text': booking.submit_text,
            'success_title': booking.success_title,
            'success_text': booking.success_text,
            'property_types': [item.name for item in PropertyType.objects.all()],
            'cleaning_types': [item.name for item in CleaningType.objects.all()],
            'time_slots': [item.label for item in TimeSlot.objects.all()],
        },
        'contact': {
            'title': contacts.title,
            'map_embed_url': contacts.map_embed_url,
            'map_title': contacts.map_title,
            'cards': [
                {'label': item.label, 'value': item.value, 'href': item.href, 'tint': item.tint}
                for item in ContactCard.objects.all()
            ],
            'socials': [{'name': item.name, 'url': item.url} for item in SocialLink.objects.all()],
        },
    }
