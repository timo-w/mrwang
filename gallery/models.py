from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

class Photo(models.Model):
    image = models.ImageField(upload_to='gallery/')
    title = models.CharField(max_length=200, blank=True)
    
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
        return f"{self.title or 'Untitled'} ({self.year})"