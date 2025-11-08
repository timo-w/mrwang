import os
from django.shortcuts import render
from django.conf import settings


# Home page
def index(request):
    return render(request, "app/index.html")

# About page
def about(request):
    return render(request, "app/about.html")

# Teacher page
def teacher(request):
    return render(request, "app/teacher/teacher.html")

# Pupil page
def pupil(request):
    return render(request, "app/pupil/pupil.html")

# Pupil resources
def pupil_resources(request):
    base_path = os.path.join(settings.STATIC_ROOT or settings.STATICFILES_DIRS[0], 'app/pupil_resources')
    folders = {}

    for root, dirs, files in os.walk(base_path):
        files.sort(key=str.lower)  # sort files alphabetically
        rel_path = os.path.relpath(root, base_path)
        folder_name = "Root" if rel_path == "." else rel_path

        file_info = []
        for f in files:
            abs_path = os.path.join(root, f)
            size_bytes = os.path.getsize(abs_path)
            if size_bytes >= 1024 * 1024:
                size = f"{round(size_bytes / (1024 * 1024), 2)} MB"
            else:
                size = f"{round(size_bytes / 1024, 1)} KB"

            file_info.append({
                "path": os.path.join('app/pupil_resources', rel_path, f).replace('\\', '/'),
                "name": f,
                "size": size,
            })

        if file_info:
            folders[folder_name] = file_info

    # Sort the folders alphabetically
    folders = dict(sorted(folders.items(), key=lambda x: x[0].lower()))

    return render(request, "app/pupil/resources.html", {"folders": folders})