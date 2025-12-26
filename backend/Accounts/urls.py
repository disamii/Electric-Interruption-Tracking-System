from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ChangePasswordView

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'change_password', ChangePasswordView, basename='change_password')
urlpatterns = [
    path('', include(router.urls)),  
]
