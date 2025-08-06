# from .models import DataSummary
# from .models import InterruptionData
# from django.db.models import Count, Sum
# from django.db.models.functions import ExtractYear, ExtractMonth
# from django.dispatch import receiver
# from django.db.models import Case, Value, When, IntegerField
# from django.db import transaction
# from django.db.models.signals import post_save, post_delete
# import logging
# logger = logging.getLogger(__name__)

# class DataSummaryServices:
#     @staticmethod
#     def _generate_summary():

#         try:
#             queryset = InterruptionData.objects.annotate(
#                 year=ExtractYear('start_date'),
#                 month=ExtractMonth('start_date'),
#                 period=Case(
#                     When(month__lte=6, then=Value(1)),
#                     When(month__gt=6, then=Value(2)),
#                     output_field=IntegerField()
#                 )
#             ).values('express','feeder', 'year', 'period').annotate(
#                 frequency=Count('id'),
#                 duration=Sum('duration')
#             )

#             data_to_update = []
#             DataSummary.objects.all().delete()
#             for data in queryset:
#                 instance, created = DataSummary.objects.update_or_create(
                    
#                     express=data['express'],
#                     feeder=data['feeder'],
#                     year=data['year'],
#                     period=data['period'],
#                     frequency= data['frequency'],
#                     duration= data['duration']
#                 )
#                 if not created:
#                     instance.frequency = data['frequency']
#                     instance.duration = data['duration']
#                     data_to_update.append(instance)
#                 else:
#                     pass

#             with transaction.atomic():
#                 DataSummary.objects.bulk_update(data_to_update, ['frequency', 'duration'])

#         except Exception as e:
#             logger.error(f"Error in get_summary_half_year: {e}")        
#         return DataSummary.objects.all()
    
#     @staticmethod
#     @receiver(post_save, sender=InterruptionData)
#     @receiver(post_delete, sender=InterruptionData)

#     def get_summary_half_year(sender, **kwargs):
#         """
#         Signal handler for generating summary when the data_updated signal is dispatched.
#         This method calls the internal _generate_summary method.
#         """
#         return DataSummaryServices._generate_summary()


