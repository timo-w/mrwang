from django.urls import path
from . import views

urlpatterns = [
    path("", views.subjects, name="subjects"),
]