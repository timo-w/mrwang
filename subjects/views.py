import re
import os
from random import shuffle
from django.shortcuts import render, get_object_or_404, redirect
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Subject, Module
from shared_utils.utils import generate_text, extract_text_from_file, client


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
    
    # Get path from subjects.js
    rel_path = request.POST.get("file_path")
    if not rel_path:
        return HttpResponse("Missing file path", status=400)

    # Turn `/media/...` into an actual filesystem path
    local_path = os.path.join(settings.MEDIA_ROOT, rel_path.replace("/media/", ""))

    if not os.path.exists(local_path):
        return HttpResponse(f"File not found: {local_path}", status=404)

    # Extract text and generate
    extracted = extract_text_from_file(local_path)
    quiz_text = generate_text(
        subject="Auto-generated from document",
        topic="Document contents",
        level="N/A",
        no_of_questions="10",
        no_of_choices="4",
        additional_info=extracted[:8000]
    )

    request.session['quiz_text'] = quiz_text
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
            line = re.sub(r'^[A-Z][\.\)]\s*', '', line)
            cleaned_choices.append(line)

        # Set correct answer before randomising options
        correct_answer = cleaned_choices[0]
        shuffle(cleaned_choices)

        quiz_questions.append({
            'question': question_text,
            'choices': cleaned_choices,
            'correct_answer': correct_answer
        })

    return render(request, "subjects/generated_quiz.html", {"quiz_questions": quiz_questions})


# Explain incorrect quiz answers
@csrf_exempt
def explain_answer(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    # Get question data from quiz
    question = request.POST.get("question")
    correct = request.POST.get("correct")
    user_answer = request.POST.get("user_answer")

    if not question or not correct:
        return JsonResponse({"error": "Missing data"}, status=400)
    
    # Normalise empty answers: treat "", null, " " as no answer
    user_answer = (user_answer or "").strip()

    # Build answer line only if an answer exists
    answer_line = (
        f"Pupil's incorrect answer: {user_answer}\nExplain why this is wrong.\n"
        if user_answer
        else ""
    )

    # Create language prompt
    prompt = (
        f"Question: {question}\n"
        f"Correct answer: {correct}\n"
        f"{answer_line}\n"
        f"Explain clearly why the correct answer is correct."
        f"Be brief, not exceeding a few sentences."
        f"Use simple language appropriate for a secondary school pupil."
        f"No need to summarise your answer or give advice at the end."
        f"Do not use formatting symbols."
        f"Do not respond with a follow-up question."
        f"Repond in second person and use British English."
    )

    response = client.chat.completions.create(
        model=os.getenv("AZURE_DEPLOYMENT_NAME"),
        messages=[
            {"role": "system", "content": "You explain incorrect answers clearly and concisely."},
            {"role": "user", "content": prompt}
        ]
    )

    explanation = response.choices[0].message.content
    return JsonResponse({"explanation": explanation})