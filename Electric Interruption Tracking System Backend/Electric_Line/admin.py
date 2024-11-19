from django.contrib import admin
from .models import *
models_to_register = [model for model in globals().values() if isinstance(model, type) and issubclass(model, models.Model)]

for model in models_to_register:
    admin.site.register(model)