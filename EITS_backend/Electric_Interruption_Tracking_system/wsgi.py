
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Electric_Interruption_Tracking_system.settings")

application = get_wsgi_application()
