from django.contrib import admin
from .models import QuizGenerationEvent

@admin.register(QuizGenerationEvent)
class QuizGenerationEventAdmin(admin.ModelAdmin):
    list_display = (
        "timestamp",
        "subject",
        "topic",
        "level",
        "no_of_questions",
        "no_of_choices",
        "quiz_type",
        "file_uploaded",
    )

    list_filter = ("level", "quiz_type", "file_uploaded", "timestamp")
    ordering = ("-timestamp",)
