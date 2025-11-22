from django.shortcuts import render

# Puzzle home
def puzzle_home(request):
    return render(request, "code_puzzles/puzzle_home.html")
