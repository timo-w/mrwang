from django.contrib import admin
from .models import Photo

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("year", "month", "location")
    list_filter = ("year", "month", "location")
    search_fields = ("year", "location")