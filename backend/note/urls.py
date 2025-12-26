from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewset

router = DefaultRouter()
router.register(r'short_notes',NoteViewset)

urlpatterns = [
    path('', include(router.urls)),  
]