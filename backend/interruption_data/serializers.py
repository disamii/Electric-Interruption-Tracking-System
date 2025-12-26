from rest_framework import serializers
from .models import InterruptionData,DataSummary


class InterruptDataSerializer (serializers.ModelSerializer):
        class Meta:
            model=InterruptionData
            fields='__all__'
    

class DataSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSummary
        fields = "__all__"  


