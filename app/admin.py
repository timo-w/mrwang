from django.contrib import admin
from .models import Category, Project

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "link")
    search_fields = ("name", "category__name")
    list_filter = ("category",)