from django.db import models
from django.utils.text import slugify


# e.g. "Computing Science"
class Subject(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# e.g. "Database Design & Development"
class Module(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='modules')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Combine subject + module name to make unique slugs site-wide
            base_slug = slugify(f"{self.subject.slug}-{self.name}")
            self.slug = base_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject.name} - {self.name}"


# e.g. "https://www.bbc.co.uk/bitesize/subjects/zfs3kqt"
class Link(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='links')
    name = models.CharField(max_length=200)
    url = models.URLField()

    def __str__(self):
        return f"{self.name} ({self.subject.name})"


# e.g. "DDD Revision 1.pptx"
class Document(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')

    def __str__(self):
        return f"{self.name} ({self.module.name})"