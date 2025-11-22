from django.shortcuts import render
from .models import Program, Topic


# Puzzle home
def puzzle_home(request):
    return render(request, "code_puzzles/puzzle_home.html")


# View aLl code examples
def view_examples(request):
    topic_id = request.GET.get("topic")

    topics = Topic.objects.all()

    if topic_id:
        programs = Program.objects.filter(topics=topic_id).distinct()
    else:
        programs = Program.objects.all()

    return render(request, "code_puzzles/view_examples.html", {
        "programs": programs,
        "topics": topics,
    })


# Play code puzzles
def play(request):
    return render(request, "code_puzzles/play_puzzles.html")
