from django.contrib import admin
from .models import InterruptionData, DataSummary

@admin.register(InterruptionData)
class InterruptionDataAdmin(admin.ModelAdmin):
    list_display = ('feeder', 'express', 'G_express', 'reason', 'start_time', 'end_time', 'start_date', 'end_date', 'duration','uploaded_by')
    list_filter = ['feeder', 'reason', 'start_date']

@admin.register(DataSummary)
class DataSummaryAdmin(admin.ModelAdmin):
    list_display = ('feeder', 'express', 'year', 'period', 'frequency', 'duration', 'id')
