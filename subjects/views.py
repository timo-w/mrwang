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
    local_path = os.path.join(
        settings.MEDIA_ROOT,
        rel_path.replace("/media/", "")
    )

    if not os.path.exists(local_path):
        return HttpResponse(f"File not found: {local_path}", status=404)

    # Extract text
    extracted = extract_text_from_file(local_path)

    quiz_text = generate_text(
        source_material=extracted[:8000],  # main content
        level="N/A",
        no_of_questions="10",
        no_of_choices="4",
        additional_info=""  # optional
    )

    request.session["quiz_text"] = quiz_text
    return redirect("generated-quiz")


# Parse and display quiz
def display_generated_quiz(request):
    quiz_text = request.session.get('quiz_text')
    if not quiz_text:
        return HttpResponse("No quiz found. Please generate a quiz first.", status=400)

    blocks = re.split(r"\n\s*(?=\d+\.)", quiz_text.strip())
    quiz_questions = []

    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue

        
        # Remove question number from AI output
        question_text = re.sub(r'^\d+\.\s*', '', lines[0].strip())

        options = []
        correct_letter = None

        for line in lines[1:]:
            if re.match(r"[A-Z]\.", line):
                options.append(line)
            elif line.startswith("Answer:"):
                correct_letter = line.split(":", 1)[1].strip()

        if not options or not correct_letter:
            continue  # skip malformed questions safely

        # Extract option text only
        option_texts = [opt.split(".", 1)[1].strip() for opt in options]

        # Determine correct answer text BEFORE shuffling
        correct_answer = next(
            opt.split(".", 1)[1].strip()
            for opt in options
            if opt.startswith(correct_letter + ".")
        )

        shuffle(option_texts)

        quiz_questions.append({
            "question": question_text,
            "choices": option_texts,
            "correct_answer": correct_answer,
        })

    return render(
        request,
        "subjects/generated_quiz.html",
        {"quiz_questions": quiz_questions}
    )


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
        f"Repond in second person (use you/your/yours), not 'the pupil'."
        f"Use British English."
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