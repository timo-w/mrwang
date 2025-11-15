from django.urls import path
from . import views

urlpatterns = [
    path('', views.subjects, name='subjects'),
    path('<slug:subject_slug>/', views.subject_detail, name='subject_detail'),
    path('<slug:subject_slug>/<slug:module_slug>/', views.module_detail, name='module_detail'),
    path('media-preview/<path:file_path>', views.media_preview, name='media_preview'),
]