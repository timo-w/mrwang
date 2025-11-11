"""
URL configuration for mrwang project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler404, handler500
from django.shortcuts import render

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),
    path('quiz_gen', include('quiz_gen.urls')),
    path('subjects', include('subjects.urls')),
]

# For custom error pages
def custom_404(request, exception):
    return render(request, 'error/404.html', status=404)
def custom_500(request):
    return render(request, 'error/500.html', status=500)

handler404 = custom_404
handler500 = custom_500