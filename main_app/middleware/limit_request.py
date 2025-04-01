from django.http import JsonResponse

def limit_request_middleware(get_response):
    def middleware(request):
        # 限制 HTTP 头大小（总大小）
        max_header_size = 8192  # 8KB
        header_size = sum(len(key) + len(value) for key, value in request.headers.items())
        if header_size > max_header_size:
            return JsonResponse({'error': 'Request headers too large'}, status=413)

        # 限制请求体大小
        max_body_size = 10 * 1024 * 1024  # 10MB
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.META.get('CONTENT_LENGTH') and int(request.META['CONTENT_LENGTH']) > max_body_size:
                return JsonResponse({'error': 'Request body too large'}, status=413)

        return get_response(request)

    return middleware
