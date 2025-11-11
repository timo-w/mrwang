import os
from django.shortcuts import render
from django.conf import settings


def subjects(request):
    return render(request, "subjects/subjects.html")