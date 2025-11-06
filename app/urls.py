from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about, name="about"),
    path("teacher", views.teacher, name="teacher"),
    path("pupil", views.pupil, name="pupil"),
    path("quiz_gen", views.quiz_gen, name="quiz_gen"),
]

