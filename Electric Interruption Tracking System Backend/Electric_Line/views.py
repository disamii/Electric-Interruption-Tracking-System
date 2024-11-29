from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from.models import *
from .serializers import *

class SubstationViewSet(viewsets.ModelViewSet):
    queryset=Substation.objects.all()
    # permission_classes=[IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action != 'list':
            return SubstationDetailSerializer
        return SubstationSerializer


class SwitchingStationViewSet(viewsets.ModelViewSet):
    
    def get_queryset(self):
        substation_pk = self.kwargs.get('substation_pk')
        if substation_pk:
            return SwitchingStation.objects.filter(substation=substation_pk).select_related('location').prefetch_related('feeders')
        return SwitchingStation.objects.select_related('location').prefetch_related('feeders').all()
    
    def get_serializer_class(self):
        substation_pk = self.kwargs.get('substation_pk')
        if substation_pk:
            return SwitchingStationNestedSerializer
        if self.action=='list':
            return SwitchingStationSerializer
        return SwitchingStationDetailSerializer
    
    def get_serializer_context(self):
        substation_pk = self.kwargs.get('substation_pk')
        context = super().get_serializer_context()
        if substation_pk:
            context['substation_pk']=substation_pk
        return context


class LocationViewSet(viewsets.ModelViewSet):
    serializer_class=LocationSerializer
    queryset=Location.objects.all()



class FeederViewSet(viewsets.ModelViewSet):
    queryset=Feeder.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.action == 'list':
            return FeederSerializer
        return FeederDetailSerializer


class TransfromerViewSet(viewsets.ModelViewSet):
    queryset=Transformer.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.action == 'list':
            return TransformerSerializer
        return TransformerDetailSerializer

class PoleViewSet(viewsets.ModelViewSet):
    queryset=Pole.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.action == 'list':
            return PoleSerializer
        return PoleDetailSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class=CustomerSerializer
    queryset=Customer.objects.all()
    
    
class InterruptionViewSet(viewsets.ModelViewSet):
    queryset=Interruption.objects.all()
    serializer_class=InterruptionSerializer
    
    
class InterruptionDetailViewSet(viewsets.ModelViewSet):
    serializer_class=InterruptiondetailSerializer
    
    def get_queryset(self):
        interruption_pk=self.kwargs.get('interruption_pk')
        return  InterruptionDetail.objects.filter(interruption_id=interruption_pk)
    
    
    def get_serializer_context(self):
        interruption_pk=self.kwargs.get('interruption_pk')
        context=super().get_serializer_context()
        if interruption_pk:
            context['interruption_pk']=interruption_pk
        return  context

        