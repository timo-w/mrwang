from django.db import models


class Topic(models.Model):
    name = models.CharField(max_length=200, unique=True)
    lesson_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Program(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    topics = models.ManyToManyField(Topic, related_name="programs", blank=True)

    def __str__(self):
        return self.title


class ProgramLine(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="lines")
    line_number = models.PositiveIntegerField(blank=True, null=True)
    content = models.TextField()

    class Meta:
        ordering = ["line_number"]

    def save(self, *args, **kwargs):
        if self.line_number is None:
            last_line = (
                ProgramLine.objects.filter(program=self.program)
                .order_by("-line_number")
                .first()
            )
            self.line_number = (last_line.line_number + 1) if last_line else 1

        super().save(*args, **kwargs)