from django import forms
from .models import Feedback

class FeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ["category", "message", "email"]
        widgets = {
            "message": forms.Textarea(attrs={"rows": 5}),
        }
