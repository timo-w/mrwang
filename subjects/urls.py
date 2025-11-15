from django.urls import path
from . import views

urlpatterns = [
    path("generate-quiz/", views.generate_quiz_from_file, name="generate-quiz"),
    
    path('', views.subjects, name='subjects'),
    path('<slug:subject_slug>/', views.subject_detail, name='subject_detail'),
    path('<slug:subject_slug>/<slug:module_slug>/', views.module_detail, name='module_detail'),
]