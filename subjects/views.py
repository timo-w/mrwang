from django.shortcuts import render, get_object_or_404
from .models import Subject, Module
from django.http import FileResponse, Http404
from django.conf import settings
from pathlib import Path

# All subjects
def subjects(request):
    subjects = Subject.objects.all()
    return render(request, 'subjects/subject_home.html', {'subjects': subjects})

# Subject page
def subject_detail(request, subject_slug):
    subject = get_object_or_404(Subject, slug=subject_slug)
    links = subject.links.all()
    modules = subject.modules.all()
    return render(request, 'subjects/subject_detail.html', {
        'subject': subject,
        'links': links,
        'modules': modules,
    })

# Module page
def module_detail(request, subject_slug, module_slug):
    subject = get_object_or_404(Subject, slug=subject_slug)
    module = get_object_or_404(Module, subject=subject, slug=module_slug)
    documents = module.documents.all()
    return render(request, 'subjects/module_detail.html', {
        'subject': subject,
        'module': module,
        'documents': documents,
    })

# For PDF iFrame previews
def media_preview(request, file_path):
    full_path = Path(settings.MEDIA_ROOT) / file_path
    if not full_path.exists():
        raise Http404("File not found")
    response = FileResponse(open(full_path, 'rb'))
    # Remove the security header ONLY for this route
    response.headers['X-Frame-Options'] = 'ALLOWALL'
    return response