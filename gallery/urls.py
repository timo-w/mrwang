from django.urls import path
from . import views

urlpatterns = [
    path("", views.gallery_home, name="gallery_home"),
    path("<int:year>/", views.gallery_year, name="gallery_year"),
]