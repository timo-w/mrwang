import re
import random
import os
import requests
from django.shortcuts import render, get_object_or_404, redirect
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
        additional_info=extracted[:8000]  # keep prompt safe
    )

    # Store in session
    request.session['quiz_text'] = quiz_text

    # Redirect to interactive quiz page
    return redirect('generated-quiz')


# Parse and display quiz
def display_generated_quiz(request):
    quiz_text = request.session.get('quiz_text')
    if not quiz_text:
        return HttpResponse("No quiz found. Please generate a quiz first.", status=400)

    # Split by questions
    question_blocks = re.split(r'\n\d+\.\s', '\n' + quiz_text)
    quiz_questions = []

    for block in question_blocks[1:]:
        lines = block.strip().splitlines()
        if not lines:
            continue

        question_text = lines[0].strip()

        # Clean choices by removing leading "A. ", "B. ", etc.
        cleaned_choices = []
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            # Remove patterns like "A. something", "B) something", etc.
            line = re.sub(r'^[A-Z][\.\)]\s*', '', line)
            cleaned_choices.append(line)

        # Set correct answer before randomising options
        correct_answer = cleaned_choices[0]
        random.shuffle(cleaned_choices)

        quiz_questions.append({
            'question': question_text,
            'choices': cleaned_choices,
            'correct_answer': correct_answer
        })

    return render(request, "subjects/generated_quiz.html", {"quiz_questions": quiz_questions})