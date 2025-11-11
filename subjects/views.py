from django.shortcuts import render, get_object_or_404
from .models import Subject, Module

# All subjects
def subject_list(request):
    subjects = Subject.objects.all()
    return render(request, 'subjects/subject_home.html', {'subjects': subjects})

# Subject page
def subject_detail(request, slug):
    subject = get_object_or_404(Subject, slug=slug)
    links = subject.links.all()
    modules = subject.modules.all()
    return render(request, 'subjects/subject_detail.html', {
        'subject': subject,
        'links': links,
        'modules': modules,
    })

# Module page
def module_detail(request, module_id):
    module = get_object_or_404(Module, id=module_id)
    documents = module.documents.all()
    return render(request, 'subjects/module_detail.html', {
        'module': module,
        'documents': documents,
    })