from django.db import models

class Composition(models.Model):
    name = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    description = models.TextField()
    youtube_link = models.URLField()
    sheet_music = models.FileField(upload_to="sheet_music/", blank=True, null=True) 

    class Meta:
        ordering = ["-year", "name"]  # newest first, then alphabetical

    def __str__(self):
        return f"{self.name} ({self.year})"
