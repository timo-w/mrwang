from django.urls import path
from . import views

urlpatterns = [
    path('', views.subject_list, name='subject_list'),
    path('<slug:slug>/', views.subject_detail, name='subject_detail'),
    path('module/<int:module_id>/', views.module_detail, name='module_detail'),
]