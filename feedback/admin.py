from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "category", "email")
    list_filter = ("category", "timestamp")
    ordering = ("-timestamp",)
