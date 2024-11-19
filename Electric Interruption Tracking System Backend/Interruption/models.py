from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from Accounts.models import MyUser
from datetime import datetime

# from .manager import DataSummaryManager,InterruptionDataManager

class Interruption(models.Model):
    content_type=models.models.OneToOneField(ContentType, verbose_name=("interruption"), on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

class InterruptionOccured(models.Model):
    interruption=models.ForeignKey(Interruption ,on_delete=models.CASCADE)
    reason = models.CharField(max_length=50)
    operator = models.CharField(max_length=50)
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    duration = models.DurationField(blank=True, null=True)
    uploaded_by = models.ForeignKey(MyUser, on_delete=models.CASCADE,related_name='user_upload',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        start_datetime = datetime.combine(self.start_date, self.start_time)
        end_datetime = datetime.combine(self.end_date, self.end_time)
        self.duration = end_datetime - start_datetime
        
        super().save(*args, **kwargs)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
# class InterruptionData(models.Model):
#     EXPRESS_CHOICES = [
#         ('R1', 'R1'),
#         ('R2', 'R2'),
#         ('R3', 'R3'),
#         ('R4', 'R4'),
#         ('R5', 'R5'),
#         ('R6', 'R6'),
#     ]

#     FEEDER_CHOICES = [
#         ('01', '01'),
#         ('02', '02'),
#         ('03', '03'),
#         ('04', '04'),
#         ('05', '05'),
#         ('06', '06'),
#         ('IN', 'IN'),
#     ]

#     G_EXPRESS_CHOICES = [
#         ('G1', 'G1'),
#         ('G2', 'G2'),
#         ('G3', 'G3'),
#         ('G4', 'G4'),
#         ('G5', 'G5'),
#         ('G6', 'G6'),
#         ('IN', 'IN'),
#         ('Locally', 'Locally'),
#         ('Manually', 'Manually'),
#         ('G2/G1', 'G2/G1'),
#         ('G3/G1', 'G3/G1'),
#         ('G4/G1', 'G4/G1'),
#         ('Substation', 'Substation'),
#     ]

#     REASON_CHOICES = [
#         ('Fault', 'Fault'),
#         ('Operation', 'Operation'),
#         ('Load', 'Load'),
#         ('Over-Load', 'Over-Load'),
#         ('Substation', 'Substation'),
#         ('other', 'other'),
#     ]

#     express = models.CharField(max_length=50, choices=EXPRESS_CHOICES)
#     feeder = models.CharField(max_length=50, choices=FEEDER_CHOICES)
#     G_express = models.CharField(max_length=50, choices=G_EXPRESS_CHOICES)
#     reason = models.CharField(max_length=50, choices=REASON_CHOICES)
#     operator = models.CharField(max_length=50)
#     start_time = models.TimeField()
#     end_time = models.TimeField()
#     start_date = models.DateField()
#     end_date = models.DateField()
#     duration = models.DurationField(blank=True, null=True)
#     uploaded_by = models.ForeignKey(MyUser, on_delete=models.CASCADE,related_name='user_upload',null=True,blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     objects = InterruptionDataManager()
    

#     def __str__(self) -> str:
#         return self.express

#     def save(self, *args, **kwargs):
#         start_datetime = datetime.combine(self.start_date, self.start_time)
#         end_datetime = datetime.combine(self.end_date, self.end_time)
#         self.duration = end_datetime - start_datetime
        
#         super().save(*args, **kwargs)

# class DataSummary(models.Model):
#     express = models.CharField(max_length=50)
#     feeder = models.CharField(max_length=50)
#     frequency = models.IntegerField()
#     duration = models.DurationField()
#     year = models.IntegerField(blank=True, null=True)
#     period = models.IntegerField(blank=True ,null=True)


#     objects= DataSummaryManager()
#     def __str__(self):
#         return f"{self.express} - {self.feeder}"


    