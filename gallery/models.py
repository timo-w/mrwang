from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from .utils import photo_upload_path

class Photo(models.Model):
    image = models.ImageField(upload_to=photo_upload_path)
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField()
    location = models.CharField(max_length=255, blank=True)

    # Automatically generated thumbnail
    thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(300, 300)], # Thumbnail size
        format='JPEG',
        options={'quality': 70}
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location or 'Untitled'} ({self.year})"