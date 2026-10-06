import mimetypes
from pathlib import Path

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import FileResponse
from django.urls import include, path, re_path
from django.views.generic import TemplateView

admin.site.site_header = 'AS clean'
admin.site.site_title = 'Адмінка'
admin.site.index_title = 'Контент сайту'

_SCRIPT_TYPES = {
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
}


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
    return TemplateView.as_view(template_name='index.html')(request)


urlpatterns = [
    path('as_admin/', admin.site.urls),
    path('api/', include('cms.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.FRONTEND_DIST.exists():
    urlpatterns += [
        re_path(r'^(?P<resource>.*)$', frontend),
    ]
