from django.shortcuts import render
from .models import Photo

# Gallery home
def gallery_home(request):
    years = Photo.objects.values_list("year", flat=True).distinct().order_by("-year")
    return render(request, "gallery/overview.html", {"years": years})

# Photos by year
def gallery_year(request, year):
    photos = Photo.objects.filter(year=year).order_by("month", "created_at")
    return render(request, "gallery/year.html", {"year": year, "photos": photos})