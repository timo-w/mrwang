from django.shortcuts import render, get_object_or_404
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
    topic_id = request.GET.get("topic")
    index = int(request.GET.get("i", 0))

    topics = Topic.objects.all()
    programs = Program.objects.all()
    
    if topic_id:
        programs = programs.filter(topics__id=topic_id)

    programs = list(programs)

    if programs:
        index = index % len(programs)  # wrap-around
        program = programs[index]
        lines = program.lines.all()
    else:
        program = None
        lines = []

    context = {
        "topics": topics,
        "programs": programs,
        "program": program,
        "lines": lines,
        "index": index,
        "selected_topic": topic_id,
    }
    return render(request, "code_puzzles/play.html", context)