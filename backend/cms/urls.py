from django.urls import path

from .views import BookingCreateView, SiteContentView

urlpatterns = [
    path('site/', SiteContentView.as_view(), name='site-content'),
    path('bookings/', BookingCreateView.as_view(), name='bookings-create'),
]
