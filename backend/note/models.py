from django.db import models
from Accounts.models import MyUser

class Note(models.Model):
    
    priorty_choices=[
        ('low','Low'),('high',"High"),('medium',"Medium")
    ]
    title=models.CharField(max_length=100)
    content=models.TextField()
    author=models.ForeignKey(MyUser ,related_name='notes', on_delete=models.CASCADE, null=True, blank=True )
    priority=models.CharField(choices=priorty_choices, max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
    