from django import forms
from .models import Feedback

class FeedbackForm(forms.ModelForm):
    email = forms.EmailField(
        required=False,
        label="Email (optional)"
    )
    class Meta:
        model = Feedback
        fields = ["category", "message", "email"]
        widgets = {
            "message": forms.Textarea(attrs={"rows": 8}),
        }
