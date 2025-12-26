from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin,BaseUserManager
from django.db import models
import random
import string
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError


class CustomUserManager(BaseUserManager):
    
    def generate_username(self, first_name):
        first_part = first_name[:3].lower()
        while True:
            random_digits = ''.join(random.choices(string.digits, k=3))
            username = f'{first_part}{random_digits}'
            if not self.model.objects.filter(username=username).exists():
                return username

    def create_user(self, username=None, email=None, first_name=None, password=None, **extra_fields):
        if not username:
            username = self.generate_username(first_name)
        if not password:
            password = f'{username}abcd'
        
        email = self.normalize_email(email)
        
        user = self.model(
            username=username,
            email=email,
            first_name=first_name,
            **{key: value for key, value in extra_fields.items() if key not in ['username', 'email', 'first_name']}
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    

    
    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username=username, email=email, password=password, **extra_fields)
    
    def get_admin_username(self):
        """
        Retrieve the username of the admin.
        Assumes there's only one admin or returns the first admin found.
        """
        try:
            admin_user = self.get_queryset().get(role='admin')
            return admin_user.username
        except ObjectDoesNotExist:
            raise ValidationError("No admin user found.")



class MyUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True, primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    grand_father_name=models.CharField(max_length=30)
    dept = models.CharField(max_length=30)
    sub_dept=models.CharField(max_length=30)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=30 ,default="user", choices=ROLE_CHOICES)
    phone_number=PhoneNumberField()
    is_password_changed=models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']


    def __str__(self):
        return self.username
