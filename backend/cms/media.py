def media_url(request, file_field, fallback_url=''):
    if file_field:
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url
    return fallback_url or ''
