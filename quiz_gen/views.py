import hashlib
from .models import QuizGenerationEvent
from django.shortcuts import render
from django.http import FileResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from shared_utils.utils import (
    generate_text,
    generate_quiz_title,
    create_quiz_doc,
    extract_text_from_file,
    parse_quiz,
    create_worksheet_doc,
    create_presentation_doc,
    create_blooket_csv
)


# AI Quiz Generator
def quiz_gen(request):
    if request.method == "POST":

        uploaded_file = request.FILES.get("source_file")
        subject = request.POST.get("subject", "")
        topic = request.POST.get("topic", "")
        level = request.POST.get("level", "")
        no_of_questions = request.POST.get("no_of_questions")
        no_of_choices = request.POST.get("no_of_choices")
        additional_info = request.POST.get("additional_info", "")
        quiz_type = request.POST.get("quiz_type")

        # Validate input
        if not uploaded_file and not topic:
            return render(request, "quiz_gen/quiz_gen.html", {
                "error": "Please enter a topic or upload a file."
            })

        # LOG QUIZ GENERATION EVENT
        ip = request.META.get("REMOTE_ADDR", "")
        ip_hash = hashlib.sha256(ip.encode()).hexdigest() if ip else ""

        QuizGenerationEvent.objects.create(
            subject=subject,
            topic=topic,
            level=level,
            no_of_questions=int(no_of_questions),
            no_of_choices=int(no_of_choices),
            additional_info=additional_info,
            quiz_type=quiz_type,
            file_uploaded=bool(uploaded_file),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            ip_hash=ip_hash,
        )

        # User uploads a file
        if uploaded_file:
            path = default_storage.save(
                f"uploads/{uploaded_file.name}",
                ContentFile(uploaded_file.read())
            )
            full_path = default_storage.path(path)
            source_text = extract_text_from_file(full_path)

            prompt_input = f"""
            Create a quiz based on the following material:
            {source_text}
            """

        # User enters quiz details manually
        else:
            prompt_input = f"""
            Subject: {subject}
            Topic: {topic}
            """

        # Generate quiz content
        quiz_title = generate_quiz_title(prompt_input, level)
        raw_text = generate_text(
            prompt_input,
            level,
            no_of_questions,
            no_of_choices,
            additional_info,
            quiz_type
        )

        # Produce output file
        if quiz_type == "forms":
            filepath = create_quiz_doc(raw_text, quiz_title)
            filename = "forms-quiz.docx"

        elif quiz_type == "worksheet":
            quiz = parse_quiz(raw_text)
            filepath = create_worksheet_doc(quiz, quiz_title)
            filename = "worksheet-quiz.docx"

        elif quiz_type == "presentation":
            quiz = parse_quiz(raw_text)
            filepath = create_presentation_doc(quiz, quiz_title)
            filename = "presentation-quiz.pptx"

        elif quiz_type == "blooket":
            quiz = parse_quiz(raw_text)
            filepath = create_blooket_csv(quiz, quiz_title)
            filename = "blooket-quiz.csv"

        return FileResponse(
            open(filepath, "rb"),
            as_attachment=True,
            filename=filename
        )

    return render(request, "quiz_gen/quiz_gen.html")


# Terms of Use page
def terms_of_use(request):
    return render(request, "quiz_gen/terms_of_use.html")


# Privacy Policy page
def privacy_policy(request):
    return render(request, "quiz_gen/privacy_policy.html")