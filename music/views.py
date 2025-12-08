from django.shortcuts import render
from .models import Composition


# Music page
def music(request):
    compositions = Composition.objects.all()  # already ordered by Meta ordering
    return render(request, "music/music.html", {"compositions": compositions})