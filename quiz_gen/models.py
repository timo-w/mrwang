from django.db import models

# Data collection
class QuizGenerationEvent(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=255, blank=True)
    topic = models.TextField(blank=True)
    level = models.CharField(max_length=50, blank=True)
    no_of_questions = models.IntegerField()
    no_of_choices = models.IntegerField()
    additional_info = models.TextField(blank=True)
    quiz_type = models.CharField(max_length=50)
    file_uploaded = models.BooleanField(default=False)
    user_agent = models.TextField(blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)  # optional