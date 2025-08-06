from django.contrib import admin
from .models import Substation, SwitchingStation, Feeder, Transformer, Pole, Location, Interruption, InterruptionDetail

# Register all the models
admin.site.register(Substation)
admin.site.register(SwitchingStation)
admin.site.register(Feeder)
admin.site.register(Transformer)
admin.site.register(Pole)
admin.site.register(Location)
admin.site.register(Interruption)
admin.site.register(InterruptionDetail)
