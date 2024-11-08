from argparse import Action
from rest_framework import status,viewsets
from Accounts.models import MyUser
from .models import Message
from .serializer import MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import models
from Accounts.models import CustomUserManager



class MessageView(viewsets.ModelViewSet):
    queryset=Message.objects.all()  
    serializer_class=MessageSerializer
    permission_classes = [IsAuthenticated]
 

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'admin':
            receiver = self.request.data.get('receiver')
            if not receiver:
                raise ValidationError("Receiver username is required for admin messages.")
            try:
                receiver = MyUser.objects.get(username=receiver)
            except MyUser.DoesNotExist:
                raise ValidationError("Receiver with the given username does not exist.")
            
            serializer.save(sender=user, receiver=receiver)
        else:
            user_manager = MyUser.objects
            admin_username =user_manager.get_admin_username()
            try:
                admin = MyUser.objects.get(username=admin_username)
            except MyUser.DoesNotExist:
                raise ValidationError("Admin with the given username does not exist.")
            serializer.save(sender=user, receiver=admin)


    @action(methods=['GET'], detail=False,permission_classes=[IsAuthenticated])
    def get_chat(self, request):
        user = request.user
        
        if user.role == 'admin':
            username = request.query_params.get('username')  
        else:
            try:
                username = MyUser.objects.filter(role='admin').first().username
            except AttributeError:
                return Response({'detail': 'Admin user not found.'}, 
                                status=status.HTTP_404_NOT_FOUND)
        
        if username:
            message_query = self.queryset.filter(
                (models.Q(sender=username) & models.Q(receiver=user.username)) |
                (models.Q(sender=user.username) & models.Q(receiver=username))
            ).order_by('timestamp')
            
            serializer = MessageSerializer(message_query, many=True)
            return Response(serializer.data)
        
        return Response({'detail': 'Username parameter is missing.'}, 
                        status=status.HTTP_400_BAD_REQUEST)