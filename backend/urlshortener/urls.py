from django.contrib import admin
from django.urls import path
from shortener.views import ShortenURLView, redirect_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/shorten/', ShortenURLView.as_view(), name='shorten_url'),
    path('<str:short_code>/', redirect_view, name='redirect_url'),
]
