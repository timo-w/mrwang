import os
import requests
from django.shortcuts import render, get_object_or_404
from .models import Subject, Module
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from shared_utils.utils import generate_text, extract_text_from_file


# All subjects
def subjects(request):
    subjects = Subject.objects.all()
    return render(request, 'subjects/subject_home.html', {'subjects': subjects})


# Subject page
def subject_detail(request, subject_slug):
    subject = get_object_or_404(Subject, slug=subject_slug)
    links = subject.links.all()
    modules = subject.modules.all()
    return render(request, 'subjects/subject_detail.html', {
        'subject': subject,
        'links': links,
        'modules': modules,
    })


# Module page
def module_detail(request, subject_slug, module_slug):
    subject = get_object_or_404(Subject, slug=subject_slug)
    module = get_object_or_404(Module, subject=subject, slug=module_slug)
    documents = module.documents.all()
    return render(request, 'subjects/module_detail.html', {
        'subject': subject,
        'module': module,
        'documents': documents,
    })


# Generate quiz from document
@csrf_exempt
def generate_quiz_from_file(request):
    if request.method != "POST":
        return HttpResponse("Invalid method", status=405)
    
    file_url = request.POST.get("file_url")
    if not file_url:
        return HttpResponse("Missing file URL", status=400)

    # Download file
    response = requests.get(file_url)
    if response.status_code != 200:
        return HttpResponse("Could not download file", status=400)

    os.makedirs("temp_extractions", exist_ok=True)
    local_path = f"temp_extractions/tempfile{os.path.splitext(file_url)[1]}"
    with open(local_path, "wb") as f:
        f.write(response.content)

    # Extract text
    extracted = extract_text_from_file(local_path)

    # Generate quiz text
    quiz_text = generate_text(
        subject="Auto-generated from document",
        topic="Document contents",
        level="N/A",
        no_of_questions="10",
        no_of_choices="4",
        additional_info=extracted[:8000]
    )

    # Render a new template showing the quiz
    return render(request, "subjects/generated_quiz.html", {"quiz_text": quiz_text})