from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Project(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="projects"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to="project_thumbnails/")
    link = models.CharField()
    
    def __str__(self):
        return self.name