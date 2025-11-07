import os
from django.shortcuts import render
from django.http import FileResponse
from django.conf import settings
from .utils import generate_text, create_quiz_doc

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

# Quiz generator page
def quiz_gen(request):
    if request.method == "POST":
        # Get inputs from form
        subject = request.POST.get("subject")
        topic = request.POST.get("topic")
        level = request.POST.get("level")
        no_of_questions = request.POST.get("no_of_questions")
        no_of_choices = request.POST.get("no_of_choices")
        additional_info = request.POST.get("additional_info")

        # Create prompt
        text = generate_text(
            subject,
            topic,
            level,
            no_of_questions,
            no_of_choices,
            additional_info
        )
        filepath = create_quiz_doc(text)
        return FileResponse(open(filepath, "rb"), as_attachment=True, filename="generated-quiz.docx")
    
    return render(request, "app/teacher/quiz_gen.html")

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

    # ✅ Sort the folders alphabetically (place it here)
    folders = dict(sorted(folders.items(), key=lambda x: x[0].lower()))

    return render(request, "app/pupil/resources.html", {"folders": folders})