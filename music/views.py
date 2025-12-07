from django.shortcuts import render

# Music page
def music(request):
    return render(request, "music/music.html")
