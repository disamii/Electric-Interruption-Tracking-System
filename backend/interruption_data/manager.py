from django.db import models
from django.db.models.functions import ExtractYear, ExtractMonth
from django.db.models import Count, Sum, Case, When, Value, IntegerField,F
from django.db.models.functions import ExtractYear, ExtractMonth
from datetime import timedelta


class InterruptionDataManager(models.Manager):
        
    # used format time in human readeble format
    @staticmethod
    def format_duration(duration):
        
        if isinstance(duration, timedelta):
            days = duration.days
            hours, remainder = divmod(duration.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{days} days, {hours:02}:{minutes:02}:{seconds:02}"
        
        if isinstance(duration, str):
            parts = duration.split(' ')
            if len(parts) == 2:  
                days = int(parts[0])
                time_str = parts[1]
            elif len(parts) == 1:  
                days = 0
                time_str = parts[0]
            else:
                return "0:00:00"  # Handle unexpected formats
            
            time_parts = time_str.split(':')
            hours = int(time_parts[0])
            minutes = int(time_parts[1])
            seconds = int(time_parts[2])
            return f"{days} days, {hours:02}:{minutes:02}:{seconds:02}"        
        return "0:00:00"  


    def get_summary_monthly(self,year):
        queryset = self.get_queryset().filter(start_date__year=year).annotate(
            period=Case(
                When(start_date__month__lte=6, then=Value(1)),  
                When(start_date__month__gt=6, then=Value(2)),   
                output_field=IntegerField()
            )
        ).values('express','period').annotate(
            year=ExtractYear('start_date'),
            month=ExtractMonth('start_date'),
            frequency=Count('id'),
            duration=Sum('duration')
        ).order_by( 'month')

        results = []
        for item in queryset:
            duration = item['duration']
            item['duration'] = InterruptionDataManager.format_duration(duration)
            results.append(item)

        return results


    



class DataSummaryManager(models.Manager):
        
    def get_grouped_summary(self, groupby, **kwargs):
        year = kwargs.get('year', None)
        period = kwargs.get('period', None)

        queryset = self.get_queryset()
        
        # Apply filters dynamically based on provided parameters
        if year:
            if not period:
                queryset = queryset.filter(year=year)
            else:
                queryset = queryset.filter(year=year,period=period)
            
        queryset = queryset.values(*groupby) \
            .annotate(frequency=Count('frequency'),
                    duration=Sum('duration'))
    
        results = []
        for item in queryset :
            duration = item['duration']
            item['duration_string'] = InterruptionDataManager.format_duration(duration)
            results.append(item)
        return results

