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
        if not uploaded_file and not request.POST.get("topic"):
            return render(request, "quiz_gen/quiz_gen.html", {
                "error": "Please enter a topic or upload a file."
            })

        level = request.POST.get("level")
        no_of_questions = request.POST.get("no_of_questions")
        no_of_choices = request.POST.get("no_of_choices")
        additional_info = request.POST.get("additional_info")

        # User uploads a file to create the quiz from
        if uploaded_file:
            uploaded_file = request.FILES.get("source_file")

            if not uploaded_file:
                return render(request, "quiz_gen/quiz_gen.html", {
                    "error": "Please upload a file."
                })

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
            subject = request.POST.get("subject")
            topic = request.POST.get("topic")
            
            prompt_input = f"""
            Subject: {subject}
            Topic: {topic}
            """

        # Determine quiz type and generate document
        quiz_type = request.POST.get("quiz_type")

        quiz_title = generate_quiz_title(prompt_input, level) # generate meaningful title
        raw_text = generate_text(
            prompt_input,
            level,
            no_of_questions,
            no_of_choices,
            additional_info,
            quiz_type
        )
        
        # Forms quiz
        if quiz_type == "forms":
            filepath = create_quiz_doc(raw_text, quiz_title)
            filename = "generated-quiz.docx"
        # Word quiz
        elif quiz_type == "worksheet":
            quiz = parse_quiz(raw_text)
            filepath = create_worksheet_doc(quiz, quiz_title)
            filename = "worksheet-quiz.docx"
        # PowerPoint quiz
        elif quiz_type == "presentation":
            quiz = parse_quiz(raw_text)
            filepath = create_presentation_doc(quiz, quiz_title)
            filename = "presentation-quiz.pptx"
        # Blooket quiz
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