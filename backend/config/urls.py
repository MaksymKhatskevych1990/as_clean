import html
import mimetypes
import json
import re
from pathlib import Path

from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, HttpResponse, HttpResponsePermanentRedirect
from django.urls import include, path, re_path
from django.views.generic import RedirectView, TemplateView
from django.views.static import serve

admin.site.site_header = 'AS clean'
admin.site.site_title = 'Адмінка'
admin.site.index_title = 'Контент сайту'

_SCRIPT_TYPES = {
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
}

_SEO_PAGES = {
    'prybyrannia-kvartyr-dnipro': {
        'title': 'Прибирання квартир у Дніпрі від 130 грн/м² | AS clean',
        'description': 'Прибирання квартир у Дніпрі від 130 грн/м². Підтримуюче, генеральне та після ремонту. Узгоджуємо вартість до початку робіт.',
        'name': 'Прибирання квартир у Дніпрі',
        'price': 'від 130 грн/м²',
        'image': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=82',
    },
    'heneralne-prybyrannia-dnipro': {
        'title': 'Генеральне прибирання у Дніпрі від 160 грн/м² | AS clean',
        'description': 'Генеральне прибирання квартир і будинків у Дніпрі від 160 грн/м². Глибоке очищення кухні, санвузлів, поверхонь і важкодоступних зон.',
        'name': 'Генеральне прибирання у Дніпрі',
        'price': 'від 160 грн/м²',
        'image': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=82',
    },
    'prybyrannia-pislia-remontu-dnipro': {
        'title': 'Прибирання після ремонту у Дніпрі від 200 грн/м² | AS clean',
        'description': 'Прибирання квартир і будинків після ремонту у Дніпрі від 200 грн/м². Видаляємо будівельний пил і готуємо приміщення до заселення.',
        'name': 'Прибирання після ремонту у Дніпрі',
        'price': 'від 200 грн/м²',
        'image': 'https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=1200&q=82',
    },
    'khimchystka-mebliv-dnipro': {
        'title': 'Хімчистка меблів у Дніпрі від 1000 грн | AS clean',
        'description': 'Виїзна хімчистка диванів, крісел і матраців у Дніпрі від 1000 грн. Професійне обладнання, погоджена ціна та сушіння меблів.',
        'name': 'Хімчистка меблів у Дніпрі',
        'price': 'від 1000 грн',
        'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=82',
    },
    'prybyrannia-ofisiv-dnipro': {
        'title': 'Прибирання офісів у Дніпрі — ціна заздалегідь | AS clean',
        'description': 'Регулярне та генеральне прибирання офісів у Дніпрі. Графік під роботу команди, погоджений перелік послуг і вартість до початку робіт.',
        'name': 'Прибирання офісів у Дніпрі',
        'price': 'індивідуальний розрахунок',
        'image': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82',
    },
}

_SITEMAP_LASTMOD = '2026-11-05'


def robots_txt(request):
    sitemap = f'{settings.SITE_URL}/sitemap.xml'
    body = (
        'User-agent: *\n'
        'Allow: /\n'
        'Disallow: /as_admin/\n'
        'Disallow: /api/\n'
        '\n'
        f'Sitemap: {sitemap}\n'
    )
    return HttpResponse(body, content_type='text/plain; charset=utf-8')


def sitemap_xml(request):
    base = settings.SITE_URL.rstrip('/')
    urls = [f'{base}/', *(f'{base}/{slug}/' for slug in _SEO_PAGES)]
    entries = '\n'.join(
        '  <url>\n'
        f'    <loc>{html.escape(url)}</loc>\n'
        f'    <lastmod>{_SITEMAP_LASTMOD}</lastmod>\n'
        '  </url>'
        for url in urls
    )
    body = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{entries}\n</urlset>\n'
    return HttpResponse(body, content_type='application/xml; charset=utf-8')


def _replace_meta(source, pattern, replacement):
    return re.sub(pattern, lambda _match: replacement, source, count=1, flags=re.IGNORECASE)


def _service_html(dist, slug, page):
    source = (dist / 'index.html').read_text(encoding='utf-8')
    canonical = f"{settings.SITE_URL.rstrip('/')}/{slug}/"
    title_attr = html.escape(page['title'], quote=True)
    description_attr = html.escape(page['description'], quote=True)
    canonical_attr = html.escape(canonical, quote=True)
    image_attr = html.escape(page['image'], quote=True)
    replacements = (
        (r'<title>.*?</title>', f'<title>{title_attr}</title>'),
        (r'<meta name="description"[^>]*>', f'<meta name="description" content="{description_attr}" />'),
        (r'<link rel="canonical"[^>]*>', f'<link rel="canonical" href="{canonical_attr}" />'),
        (r'<link rel="preload" as="image"[^>]*>', f'<link rel="preload" as="image" fetchpriority="high" href="{image_attr}" />'),
        (r'<meta property="og:title"[^>]*>', f'<meta property="og:title" content="{title_attr}" />'),
        (r'<meta property="og:description"[^>]*>', f'<meta property="og:description" content="{description_attr}" />'),
        (r'<meta property="og:image"[^>]*>', f'<meta property="og:image" content="{image_attr}" />'),
        (r'<meta property="og:url"[^>]*>', f'<meta property="og:url" content="{canonical_attr}" />'),
        (r'<meta name="twitter:title"[^>]*>', f'<meta name="twitter:title" content="{title_attr}" />'),
        (r'<meta name="twitter:description"[^>]*>', f'<meta name="twitter:description" content="{description_attr}" />'),
        (r'<meta name="twitter:image"[^>]*>', f'<meta name="twitter:image" content="{image_attr}" />'),
    )
    for pattern, replacement in replacements:
        source = _replace_meta(source, pattern, replacement)
    schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': f'{canonical}#service',
        'name': page['name'],
        'description': page['description'],
        'image': page['image'],
        'areaServed': {'@type': 'City', 'name': 'Дніпро'},
        'provider': {
            '@type': 'HouseCleaner',
            '@id': f"{settings.SITE_URL.rstrip('/')}/#business",
            'name': 'AS clean',
            'url': f"{settings.SITE_URL.rstrip('/')}/",
            'telephone': '+380635429553',
        },
        'offers': {'@type': 'Offer', 'priceCurrency': 'UAH', 'description': page['price'], 'url': canonical},
    }
    source = source.replace('</head>', f'<script type="application/ld+json" id="ld-service-static">{json.dumps(schema, ensure_ascii=False)}</script>\n</head>')
    related = ''.join(
        f'<a href="/{related_slug}/">{html.escape(related_page["name"])}</a>'
        for related_slug, related_page in _SEO_PAGES.items()
        if related_slug != slug
    )
    initial_content = (
        '<div id="root">'
        '<style>'
        '.seo-initial{position:fixed;inset:0;z-index:9999;overflow:auto;background:#071422;color:#fff;'
        'font-family:Manrope,Arial,sans-serif;-webkit-font-smoothing:antialiased}'
        '.seo-initial *{box-sizing:border-box}.seo-initial a{text-decoration:none}'
        '.seo-initial-header{height:84px;background:#fff;display:flex;align-items:center;justify-content:space-between;'
        'padding:0 max(24px,calc((100vw - 1152px)/2));box-shadow:0 8px 24px rgba(7,20,34,.08)}'
        '.seo-initial-brand{font-size:23px;font-weight:800;color:#071422}.seo-initial-brand span{color:#2b6de0}'
        '.seo-initial-order{border-radius:999px;background:#f0b429;color:#071422;padding:13px 22px;font-weight:800}'
        '.seo-initial-hero{min-height:calc(100vh - 84px);display:grid;grid-template-columns:1.05fr .95fr;'
        'align-items:center;gap:48px;max-width:1152px;margin:auto;padding:64px 24px}'
        '.seo-initial-breadcrumb{font-size:14px;color:rgba(255,255,255,.62)}'
        '.seo-initial-breadcrumb a{color:inherit}.seo-initial-kicker{margin:42px 0 0;color:#f0b429;font-size:12px;'
        'font-weight:800;letter-spacing:.2em;text-transform:uppercase}'
        '.seo-initial h1{max-width:700px;margin:16px 0 0;font-size:clamp(40px,5vw,64px);line-height:1.05;letter-spacing:-.04em}'
        '.seo-initial-copy{max-width:650px;margin:24px 0 0;color:rgba(255,255,255,.76);font-size:18px;line-height:1.65}'
        '.seo-initial-price{margin:22px 0 0;color:#f0b429;font-size:27px;font-weight:800}'
        '.seo-initial-cta{display:inline-block;margin-top:30px;border-radius:999px;background:#f0b429;color:#071422;'
        'padding:15px 24px;font-weight:800}.seo-initial-photo{width:100%;aspect-ratio:4/3;border-radius:32px;object-fit:cover}'
        '.seo-initial-related{display:flex;flex-wrap:wrap;gap:10px;grid-column:1/-1}'
        '.seo-initial-related a{border:1px solid rgba(255,255,255,.25);border-radius:999px;color:#fff;padding:9px 14px;font-size:13px}'
        '@media(max-width:760px){.seo-initial-header{height:70px;padding:0 18px}.seo-initial-order{padding:10px 15px;font-size:13px}'
        '.seo-initial-hero{min-height:auto;display:block;padding:44px 20px}.seo-initial h1{font-size:42px}'
        '.seo-initial-copy{font-size:16px}.seo-initial-photo{margin-top:38px}.seo-initial-related{margin-top:30px}}'
        '</style>'
        '<div class="seo-initial">'
        '<header class="seo-initial-header"><a class="seo-initial-brand" href="/">AS <span>clean</span></a>'
        '<a class="seo-initial-order" href="/#booking">Замовити прибирання</a></header>'
        '<main class="seo-initial-hero"><article>'
        f'<nav class="seo-initial-breadcrumb"><a href="/">Головна</a> &nbsp;/&nbsp; {html.escape(page["name"])}</nav>'
        '<p class="seo-initial-kicker">Професійний клінінг у Дніпрі</p>'
        f'<h1>{html.escape(page["name"])}</h1>'
        f'<p class="seo-initial-copy">{html.escape(page["description"])}</p>'
        f'<p class="seo-initial-price">{html.escape(page["price"])}</p>'
        '<a class="seo-initial-cta" href="/#booking">Розрахувати вартість</a></article>'
        f'<img class="seo-initial-photo" src="{image_attr}" alt="{html.escape(page["name"], quote=True)}" '
        'width="1200" height="900" fetchpriority="high">'
        f'<nav class="seo-initial-related" aria-label="Інші послуги">{related}</nav>'
        '</main></div></div>'
    )
    source = source.replace('<div id="root"></div>', initial_content)
    return HttpResponse(source, content_type='text/html; charset=utf-8')


def frontend(request, resource=''):
    dist = Path(settings.FRONTEND_DIST).resolve()
    relative = resource.lstrip('/')
    if relative:
        candidate = (dist / relative).resolve()
        try:
            candidate.relative_to(dist)
        except ValueError:
            candidate = None
        if candidate and candidate.is_file():
            content_type = _SCRIPT_TYPES.get(candidate.suffix)
            if not content_type:
                content_type, _encoding = mimetypes.guess_type(candidate.name)
            return FileResponse(candidate.open('rb'), content_type=content_type or 'application/octet-stream')
    if not relative:
        return TemplateView.as_view(template_name='index.html')(request)
    slug = relative.rstrip('/')
    if slug in _SEO_PAGES:
        if not relative.endswith('/'):
            return HttpResponsePermanentRedirect(f'/{slug}/')
        return _service_html(dist, slug, _SEO_PAGES[slug])
    return HttpResponse(
        '<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="robots" content="noindex">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Сторінку не знайдено | AS clean</title>'
        '</head><body><main><h1>Сторінку не знайдено</h1><p><a href="/">Повернутися на головну</a></p></main></body></html>',
        status=404,
        content_type='text/html; charset=utf-8',
    )


urlpatterns = [
    path('as_admin', RedirectView.as_view(url='/as_admin/', permanent=False)),
    path('as_admin/', admin.site.urls),
    path('api/', include('cms.urls')),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap_xml),
]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

if settings.FRONTEND_DIST.exists():
    urlpatterns += [
        re_path(r'^(?P<resource>.*)$', frontend),
    ]
