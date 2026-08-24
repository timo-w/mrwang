from django.urls import path
from . import views

urlpatterns = [
    path("", views.quiz_gen, name="quiz_gen"),
    path("terms_of_use/", views.terms_of_use, name="terms_of_use"),
    path("privacy_policy/", views.privacy_policy, name="privacy_policy"),
]