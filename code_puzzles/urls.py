from django.urls import path
from . import views

urlpatterns = [
    path("", views.puzzle_home, name="puzzle_home"),
]
