from django.shortcuts import render, get_object_or_404
from .models import Program, Topic
from random import choice, shuffle


# Puzzle home
def puzzle_home(request):
    return render(request, "code_puzzles/puzzle_home.html")


# View aLl code examples
def examples(request):
    topic_id = request.GET.get("topic")
    topics = Topic.objects.all()
    selected_topic = None

    if topic_id:
        programs = Program.objects.filter(topics=topic_id).distinct()
        try:
            selected_topic = Topic.objects.get(id=topic_id)
        except Topic.DoesNotExist:
            selected_topic = None
    else:
        programs = Program.objects.all()

    return render(request, "code_puzzles/examples.html", {
        "programs": programs,
        "topics": topics,
        "selected_topic": selected_topic,
    })


# Play code puzzles
def play(request):
    topic_id = request.GET.get("topic")
    index = int(request.GET.get("i", 0))

    # Get all topics and programs
    topics = Topic.objects.all()
    programs = Program.objects.all()
    
    if topic_id:
        programs = programs.filter(topics__id=topic_id)

    # Convert queryset to list and shuffle
    programs = list(programs)
    shuffle(programs)

    if programs:
        index = index % len(programs)
        program = programs[index]
        lines = program.lines.all()
    else:
        program = None
        lines = []

    # Choose puzzle type on every load
    puzzle_type = choice(["reorder", "fill_blank"])

    context = {
        "topics": topics,
        "programs": programs,
        "program": program,
        "lines": lines,
        "index": index,
        "selected_topic": topic_id,
        "puzzle_type": puzzle_type,
    }
    return render(request, "code_puzzles/play.html", context)