from django.contrib import admin
from .models import Composition


@admin.register(Composition)
class CompositionAdmin(admin.ModelAdmin):
    list_display = ("name", "year", "youtube_link", "has_sheet_music")
    search_fields = ("name", "description")
    list_filter = ("year",)

    def has_sheet_music(self, obj):
        return bool(obj.sheet_music)
    has_sheet_music.short_description = "Sheet Music?"
    has_sheet_music.boolean = True
