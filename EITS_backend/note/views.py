from django.shortcuts import render
from rest_framework import viewsets
from .models import Note
from .serializer import NoteSerialzer
from Accounts.permission import CustomIsAdminUser



class NoteViewset(viewsets.ModelViewSet):
    queryset=Note.objects.all()
    serializer_class =NoteSerialzer
    permission_classes = [CustomIsAdminUser]
    

