from django.urls import path
from . import views

urlpatterns = [
    path("", views.quiz_gen, name="quiz_gen"),
]