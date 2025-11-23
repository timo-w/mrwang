from django.forms import Textarea
from django.db import models
from django.contrib import admin
from .models import Topic, Program, ProgramLine


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("name", "lesson_url")
    search_fields = ("name",)


class ProgramLineInline(admin.TabularInline):
    model = ProgramLine
    extra = 1
    fields = ("line_number", "content")
    ordering = ("line_number",)
    show_change_link = True

    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 1, 'style': 'height: 1.8em;'})},
    }


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title", "description")
    filter_horizontal = ("topics",)
    inlines = [ProgramLineInline]


@admin.register(ProgramLine)
class ProgramLineAdmin(admin.ModelAdmin):
    list_display = ("program", "line_number", "content")
    list_filter = ("program",)
    ordering = ("program", "line_number")
    search_fields = ("content",)

    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 1, 'style': 'height: 1.8em;'})},
    }