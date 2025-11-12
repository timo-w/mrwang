from django.urls import path
from . import views

urlpatterns = [
    path('', views.subject_list, name='subject_list'),
    path('<slug:subject_slug>/', views.subject_detail, name='subject_detail'),
    path('<slug:subject_slug>/<slug:module_slug>/', views.module_detail, name='module_detail'),
]