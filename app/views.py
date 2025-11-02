from django.shortcuts import render
from django.http import FileResponse
from .utils import generate_text, create_quiz_doc

# Home page
def index(request):
    return render(request, "app/index.html")

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

        # Create prompt and quiz document
        prompt = (
            f"Subject: {subject}"
            f"Topic: {topic}"
            f"Level: {level}"
            f"Number of questions: {no_of_questions}"
            f"Number of possible choices per question: {no_of_choices}"
            f"Additional information (if any): {additional_info}"
        )
        text = generate_text(prompt)
        filepath = create_quiz_doc(text)
        return FileResponse(open(filepath, "rb"), as_attachment=True, filename="generated-quiz.docx")
    
    return render(request, "app/quiz_gen.html")
