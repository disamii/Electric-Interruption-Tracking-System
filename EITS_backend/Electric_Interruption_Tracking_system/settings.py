import os
from pathlib import Path
from datetime import timedelta


GDAL_LIBRARY_PATH = os.getenv("GDAL_LIBRARY_PATH", r"C:\OSGeo4W\bin\gdal309.dll")

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-yml34z3&wjf4w^u1a!c5&q90)+o%r4-unwm77hcpsjguilj71g"

DEBUG =True

ALLOWED_HOSTS = ['*']


CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'accept',
    'x-requested-with',
    'x-csrftoken',
    'x-requested-by',
]





INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django.contrib.gis',
    'rest_framework',
    'djoser',   
    'rest_framework_simplejwt',
    'rest_framework_gis',
    'corsheaders',
    "phonenumber_field",
    'django_filters',
    
    'Electric_Line',
    'Accounts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "Electric_Interruption_Tracking_system.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Electric_Interruption_Tracking_system.wsgi.application"



DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.mysql',
        'NAME': 'electricinterruption',                   
        'USER': 'root',                   
        'PASSWORD': 'disSAMI!123',           
        'HOST': 'db',
        'PORT': '3306',                           
    }
}




# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
#     },
# ]






DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = 'Accounts.AppUser'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),


    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework.permissions.IsAuthenticated',
    # ),
}



SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

DJOSER={
    'SERIALIZERS':{
        'user_create':'Accounts.serializers.UserCreateSerializer',
        'current_user':'Accounts.serializers.CurrentUserSerializer',
        'user':'Accounts.serializers.CurrentUserSerializer'
    },
        'PERMISSIONS': {
        'user_list': ['rest_framework.permissions.IsAdminUser'],
        'user': ['rest_framework.permissions.IsAuthenticated'],
    }
}

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True



STATIC_URL = "static/"


