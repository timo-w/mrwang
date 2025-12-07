from django.shortcuts import render, get_object_or_404
from .models import Category


# Home page
def index(request):
    return render(request, "app/index.html")


# About page
def about(request):
    return render(request, "app/about.html")


# Pupil page
def pupil(request):
    category = Category.objects.get(name="Pupil Resources")
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})


# Teacher page
def teacher(request):
    category = Category.objects.get(name="Teacher Resources")
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})


# Category page
def category(request, category_name):
    category = get_object_or_404(Category, name=category_name)
    projects = category.projects.all()
    return render(request, "app/category.html", {"category": category, "projects": projects})
