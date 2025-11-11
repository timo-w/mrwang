from django.shortcuts import render, get_object_or_404
from .models import Subject, Module

# All subjects
def subject_list(request):
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