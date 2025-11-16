from django.shortcuts import render


# Home page
def index(request):
    return render(request, "app/index.html")

# About page
def about(request):
    return render(request, "app/about.html")

# Teacher page
def teacher(request):
    return render(request, "app/teacher.html")

# Pupil page
def pupil(request):
    return render(request, "app/pupil.html")

# Projects page
def projects(request):
    return render(request, "app/projects.html")
