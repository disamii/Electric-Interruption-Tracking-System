from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import *  # Import views

# Create the main router and register viewsets
router = DefaultRouter()
router.register(r'substation', SubstationViewSet, basename='substation')
router.register(r'switching_station', SwitchingStationViewSet, basename='switching_station')
router.register(r'feeder', FeederViewSet, basename='feeder')
router.register(r'transformer', TransfromerViewSet, basename='transformer')
router.register(r'pole', PoleViewSet, basename='pole')
router.register(r'customer', CustomerViewSet, basename='customer')
router.register(r'location', LocationViewSet, basename='location')
router.register(r'interruption', InterruptionViewSet, basename='interruption')

# Nested router for interruptions
interruption_router = NestedDefaultRouter(router, r'interruption', lookup='interruption')
interruption_router.register(r'detail', InterruptionDetailViewSet, basename='interruption-detail')

# Nested router for substations
substation_router = NestedDefaultRouter(router, r'substation', lookup='substation')
substation_router.register(r'switching_station', SwitchingStationViewSet, basename='substation-switching_station')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(substation_router.urls)),
    path('', include(interruption_router.urls)),
]
