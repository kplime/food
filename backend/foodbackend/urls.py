"""
URL configuration for foodbackend project.

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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('community.urls')),
    path('api/auth/', include('accounts.urls')),
]

# Served by Django regardless of DEBUG — fine at this project's scale, and
# Render's free tier has no separate static-file host to hand this off to.
# Note: Render's free web service disk is ephemeral, so uploaded media does
# NOT survive a redeploy or restart there (local dev doesn't have this issue).
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
