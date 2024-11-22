from django.db import models
from django.contrib.gis.db import models as gis_models 
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import datetime



class Substation(models.Model):
    tag_name=models.CharField(max_length=55,unique=True)
    created_at=models.DateField()
    location=models.ForeignKey('Location',on_delete=models.CASCADE)
    def __str__(self):
        return f"substation {self.tag_name}"

class  SwitchingStation (models.Model):
    tag_name=models.CharField(max_length=55,unique=True)
    substation=models.ForeignKey(Substation,on_delete=models.CASCADE,related_name="switching_station")
    created_at=models.DateField()
    type_of_CB=models.CharField(max_length=255)
    location=models.ForeignKey('Location',on_delete=models.CASCADE)
    
    def __str__(self):
        return f"switching station(express) {self.tag_name}"


class Feeder(models.Model):
    switching_station=models.ForeignKey(SwitchingStation,on_delete=models.PROTECT,related_name='feeders')
    tag_name=models.CharField(max_length=255)
    voltage_level=models.CharField(max_length=255)
    length=models.PositiveIntegerField(help_text="SI unit KM")
    path = gis_models.LineStringField()
    coverage_area = gis_models.PolygonField()
    start_point = gis_models.ForeignKey("Location", related_name='start_lines', on_delete=models.CASCADE)
    end_point = gis_models.ForeignKey("Location", related_name='end_lines', on_delete=models.CASCADE)
    created_at=models.DateField()

    def __str__(self):
        return f"feeder {self.tag_name}"


class Transformer(models.Model):
    PROPERTY_OPTION=[
        ('EEU','Ethiopian,Electric Utility'),
        ("Customer's","customer's property")
        ]
    
    tag_name=models.CharField(max_length=255)
    rating=models.CharField(max_length=255,help_text='SI unit KVA')
    cooling=models.CharField(max_length=255)
    feeder=models.ForeignKey(Feeder,on_delete=models.CASCADE,related_name="transformer") 
    created_at=models.DateTimeField()
    manufacturing_date=models.DateField()
    property_of=models.CharField( choices=PROPERTY_OPTION, max_length=55, default='EEU')
    location=models.ForeignKey('Location',on_delete=models.CASCADE)

    def __str__(self):
        return f"transformer {self.tag_name}"



class Pole(models.Model):
    
    VOLTAGE_LEVEL=[
                    ('LV','low level 100v-1kv'),
                    ('MV','medium level  1kV to 36kV'),
                    ('HV','high level 36kV to 230kV. '),
                    ('EHV','Extra high level  230kV to 765kV'),
                    ('UHV','Ultra high level > 765kV')
                    ]
    
    tag_name=models.CharField(max_length=255)
    transformer=models.ForeignKey(Transformer,on_delete=models.CASCADE)
    created_at=models.DateField()
    voltage_level=models.CharField(max_length=10,choices=VOLTAGE_LEVEL)
    height=models.FloatField(help_text="SI unit Metre")
    location=models.ForeignKey('Location',on_delete=models.CASCADE)

    def __str__(self):
        return f"pole {self.tag_name}"


class Location(gis_models.Model):
    city = models.CharField(max_length=100)
    kebele = models.CharField(max_length=100)
    point = gis_models.PointField()  

    
    def __str__(self):
        return f"kebele {self.kebele}"



class Customer(models.Model):
    contract_account=models.CharField(max_length=255)
    phone_number=PhoneNumberField()
    business_partner=models.CharField(max_length=255)
    pole=models.ForeignKey(Pole,on_delete=models.PROTECT ,related_name='customer')


class Interruption(models.Model):
    related_type = models.OneToOneField(ContentType, verbose_name="Interruption Type", on_delete=models.CASCADE)
    related_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('related_type', 'related_id')

class InterruptionDetail(models.Model):
    interruption = models.ForeignKey(Interruption, on_delete=models.CASCADE)
    reason = models.CharField(max_length=50, null=True, blank=True)
    handled_by = models.CharField(max_length=50, null=True, blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    duration = models.DurationField(blank=True, null=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_interruptions', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"InterruptionOccured - {self.reason or 'No Reason'} ({self.start_datetime})"
