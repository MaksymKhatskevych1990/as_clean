from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookingPhoto
from .serializers import BookingSerializer, serialize_site
from .telegram import notify_telegram


class SiteContentView(APIView):
    def get(self, request):
        return Response(serialize_site(request))


class BookingCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        for photo in request.FILES.getlist('photos'):
            BookingPhoto.objects.create(booking=booking, image=photo)
        notify_telegram(booking)
        return Response({'ok': True}, status=status.HTTP_201_CREATED)
