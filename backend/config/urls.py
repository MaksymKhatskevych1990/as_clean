from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

admin.site.site_header = 'AS clean'
admin.site.site_title = 'Адмінка'
admin.site.index_title = 'Контент сайту'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('cms.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.FRONTEND_DIST.exists():
    urlpatterns += [
        re_path(
            r'^(?!api/|admin/|media/|static/).*$',
            TemplateView.as_view(template_name='index.html'),
        ),
    ]
