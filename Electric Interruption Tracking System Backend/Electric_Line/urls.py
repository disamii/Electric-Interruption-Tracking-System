from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import *  # Import views

router = DefaultRouter()
router.register(r'substations', SubstationViewSet, basename='substation')
router.register(r'switching_station', SwitchingStationViewSet, basename='switching_station')
router.register(r'feeder', FeederViewSet, basename='feeder')
router.register(r'transformer', TransfromerViewSet, basename='transformer')
router.register(r'pole', PoleViewSet, basename='pole')
router.register(r'customer', CustomerViewSet, basename='customer')
router.register(r'location',LocationViewSet ,basename='location')

substation_router = NestedDefaultRouter(router, r'substations', lookup='substation')
substation_router.register(r'switching_station', SwitchingStationViewSet, basename='substation-switching_station')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(substation_router.urls)),
]
