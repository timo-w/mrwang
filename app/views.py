from django.shortcuts import render
from .models import Category


# Home page
def index(request):
    return render(request, "app/index.html")

# About page
def about(request):
    return render(request, "app/about.html")

# Teacher page
def teacher(request):
    category = Category.objects.get(name="Teacher Resources")
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})

# Pupil page
def pupil(request):
    category = Category.objects.get(name="Pupil Resources")
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})

# Projects page
def projects(request):
    category = Category.objects.get(name="Other Projects")
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})
