from django.urls import path
from . import views

urlpatterns = [
    path("", views.puzzle_home, name="puzzle_home"),
    path("examples", views.examples, name="examples"),
    path("play", views.play, name="play"),
]
