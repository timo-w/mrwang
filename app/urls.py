from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about, name="about"),
    path("projects", views.projects, name="projects"),
    path("photography", views.photography, name="photography"),
    path("teacher", views.teacher, name="teacher"),
    path("pupil", views.pupil, name="pupil"),
]

