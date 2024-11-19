from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterrputionDataViewSet,DataSummaryViewSet


router = DefaultRouter()
router.register(r'interruptions', InterrputionDataViewSet ,basename='interruption_data')
router.register(r'interruption_summary', DataSummaryViewSet, basename='interruption_summary')


urlpatterns = [
    path('', include(router.urls)),
]
