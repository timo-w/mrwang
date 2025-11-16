from django.urls import path
from . import views

urlpatterns = [
    path("", views.gallery_overview, name="gallery_overview"),
    path("<int:year>/", views.gallery_year, name="gallery_year"),
]