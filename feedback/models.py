from django.db import models

class Feedback(models.Model):
    CATEGORY_CHOICES = [
        ("feature", "Feature Request"),
        ("bug", "Bug Report"),
        ("question", "General Question"),
        ("gdpr_data", "Request Personal Data"),
        ("gdpr_delete", "Request Data Deletion"),
        ("other", "Other"),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    message = models.TextField()
    email = models.EmailField(blank=True)  # optional
    timestamp = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)

    def __str__(self):
        return f"{self.get_category_display()} ({self.timestamp:%Y-%m-%d})"
