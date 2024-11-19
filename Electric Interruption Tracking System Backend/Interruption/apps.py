from django.apps import AppConfig
from django.db.models.signals import post_save, post_delete

class InterruptionDataConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Interruption"
    
    def ready(self):
        from Interruption.services import DataSummaryServices
        from .models import InterruptionData
        post_save.connect(DataSummaryServices.get_summary_half_year, sender=InterruptionData)
        post_delete.connect(DataSummaryServices.get_summary_half_year, sender=InterruptionData)

 
