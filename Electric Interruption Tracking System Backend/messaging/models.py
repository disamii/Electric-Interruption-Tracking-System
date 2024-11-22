# messaging/models.py
from django.db import models
from Accounts.models import MyUser

class Message(models.Model):
    sender = models.ForeignKey(MyUser, related_name='sender', on_delete=models.CASCADE, null=True, blank=True)
    receiver = models.ForeignKey(MyUser, related_name='receiver', on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    seen = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True ,null=True)


    def __str__(self):
        return f"Message from {self.sender} to {self.receiver}:"
    
