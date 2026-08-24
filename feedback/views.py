from django.shortcuts import render, redirect
from .forms import FeedbackForm
from .models import Feedback
import hashlib

def feedback_view(request):
    if request.method == "POST":
        form = FeedbackForm(request.POST)
        if form.is_valid():
            feedback = form.save(commit=False)

            # Add metadata
            ip = request.META.get("REMOTE_ADDR", "")
            feedback.ip_hash = hashlib.sha256(ip.encode()).hexdigest() if ip else ""
            feedback.user_agent = request.META.get("HTTP_USER_AGENT", "")

            feedback.save()
            return render(request, "feedback/thank_you.html")

    else:
        form = FeedbackForm()

    return render(request, "feedback/feedback_form.html", {"form": form})
