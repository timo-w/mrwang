import os
import datetime
import re
from random import shuffle
from openai import AzureOpenAI
from docx import Document
from pptx import Presentation
from PyPDF2 import PdfReader


# Azure Open AI Details
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)


# Call Azure OpenAI
def generate_text(
    source_material: str,
    level: str,
    no_of_questions: str,
    no_of_choices: str,
    additional_info: str
) -> str:
    system_prompt = """
        You are a helpful assistant that creates multiple-choice quiz documents.
        Do not include any formatting symbols in your response.
        Do not respond with any follow-up questions.
        Use British English spellings, grammar, and conventions throughout.

        Your response will follow a specific format:
        - For each question, begin with the question number followed by a dot and the question text in one line.
        - Do not use bullet points, only new lines.
        - Under each question text, insert a new line and then the possible answer beginning with the letter from A.
        - Make option A the correct answer for each question.

        You will be making quizzes which secondary teachers in Scotland will be using. This means that:
        - Quizzes for S1-3s should contain questions which are answerable by 12-14 year olds.
        - National 4/5, Higher, and Advanced Higher quizzes should contain content which is applicable for those courses.

        The user prompt will contain the details for the quiz.

    """
    user_prompt = f"""
        Source material:
        {source_material}

        Level: {level}
        Number of questions: {no_of_questions}
        Choices per question: {no_of_choices}
        Additional information: {additional_info}
    """
    response = client.chat.completions.create(
        model=os.getenv("AZURE_DEPLOYMENT_NAME"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return response.choices[0].message.content


# Generate Word Document
def create_quiz_doc(content: str, filename: str = "generated-quiz.docx") -> str:
    doc = Document()
    doc.add_heading(datetime.datetime.now().strftime("Generated Quiz - Created %H:%M on %B %d, %Y"), level=1)
    doc.add_paragraph(content)
    filepath = f"media/{filename}"
    os.makedirs("media", exist_ok=True)
    doc.save(filepath)
    return filepath


# For generating quiz from file
def extract_text_from_file(file_path: str) -> str:
    lower = file_path.lower()

    if lower.endswith(".pdf"):
        reader = PdfReader(file_path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if lower.endswith(".docx"):
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)

    if lower.endswith(".pptx"):
        prs = Presentation(file_path)
        collected = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    collected.append(shape.text)
        return "\n".join(collected)

    return ""


# For generating printable quiz worksheets
def parse_quiz(text: str):
    questions = []
    blocks = re.split(r"\n(?=\d+\.)", text.strip())

    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        question_line = lines[0]

        options = [l for l in lines[1:] if re.match(r"[A-Z]\.", l)]

        correct_option = options[0]  # A is correct by contract

        questions.append({
            "question": question_line,
            "options": options,
            "correct": correct_option
        })

    return questions


def create_worksheet_doc(quiz, filename="worksheet-quiz.docx"):
    doc = Document()
    doc.add_heading(datetime.datetime.now().strftime("Generated Quiz Worksheet - Created %H:%M on %B %d, %Y"), level=1)

    answer_key = []

    for idx, q in enumerate(quiz, start=1):
        doc.add_paragraph(q["question"])

        options = q["options"].copy()
        shuffle(options)

        new_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        correct_letter = None

        for i, opt in enumerate(options):
            text = opt.split(".", 1)[1].strip()
            letter = new_letters[i]

            doc.add_paragraph(f"{letter}. {text}")

            if opt == q["correct"]:
                correct_letter = letter

        answer_key.append((idx, correct_letter))
        doc.add_paragraph("") # Blank line between questions

    doc.add_page_break()
    doc.add_heading("Answers", level=1)

    for idx, letter in answer_key:
        doc.add_paragraph(f"{idx}. {letter}")

    filepath = f"media/{filename}"
    os.makedirs("media", exist_ok=True)
    doc.save(filepath)

    return filepath
