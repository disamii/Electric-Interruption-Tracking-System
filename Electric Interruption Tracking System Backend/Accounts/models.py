from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from django.db import models

class AppUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
        ('user', 'User'),
    )
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30 ,default="user", choices=ROLE_CHOICES)
    is_password_changed=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'username'
    def __str__(self):
        return self.username
    
class Profile(models.Model):
    user=models.OneToOneField(AppUser,on_delete=models.CASCADE ,related_name="user_profile")
    phone_number=PhoneNumberField()
    grand_father_name=models.CharField(max_length=30)
    dept = models.CharField(max_length=30)
    sub_dept=models.CharField(max_length=30)


