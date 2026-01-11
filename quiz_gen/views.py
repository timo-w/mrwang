from django.shortcuts import render
from django.http import FileResponse
from shared_utils.utils import generate_text, create_quiz_doc, extract_text_from_file
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


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

        text = generate_text(
            prompt_input,
            level,
            no_of_questions,
            no_of_choices,
            additional_info
        )

        filepath = create_quiz_doc(text)
        return FileResponse(open(filepath, "rb"), as_attachment=True, filename="generated-quiz.docx")

    return render(request, "quiz_gen/quiz_gen.html")