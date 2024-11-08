from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status,viewsets,permissions
from rest_framework.decorators import action

from .permission import CustomIsAdminUser
from .models import MyUser
from .serializers import UserSerializer,ChangePasswordSerializer,UserUpdateSerializer



class UserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.annotate(totalUpload=Count('user_upload')).all()


    def get_permissions(self):
        if self.request.method in ['DELETE']:
            return [CustomIsAdminUser()]  
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if (self.request.method=='PUT'):
            return UserUpdateSerializer
        return UserSerializer
    
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

# while user creating
    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        password = request.data.get('password')
        extra_fields = {key: value for key, value in request.data.items() if key not in ['username', 'email', 'first_name', 'password']}
        
        user_manager = get_user_model().objects
        # or  MyUser.objects  //both are possible the above on always find the active model while this  one have static model

        try:
            # Create user
            user = user_manager.create_user(
                username=username,
                email=email,
                first_name=first_name,
                password=password,
                **extra_fields
            )
        except IntegrityError:
            return Response({'error': 'A user with this email or username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# returns user detail of currently logged  or auth
    @action(detail=False, methods=['get'] ,permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

    @action(detail=True, methods=['patch'],permission_classes = [CustomIsAdminUser])
    def suspend(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
            user.is_active = not user.is_active
            user.save()

            return Response({"detail": "User status updated successfully."}, status=status.HTTP_200_OK)
        except MyUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_userList(self, request):
        request_user = request.user
        get_list_user = self.queryset.exclude(username=request_user.username)

        user_data = [
            {
                "name": f"{user.first_name} {user.last_name}",
                "username": user.username
            }
            for user in get_list_user
        ]

        return Response(user_data)
        


        

class ChangePasswordView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.data['new_password'])
            request.user.is_password_changed=True
            request.user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=True, methods=['patch'],permission_classes = [CustomIsAdminUser])
    def reset_password(self, request, pk=None):
        user = get_object_or_404(MyUser, pk=pk)
        password = f'{user.username}abcd'
        user.set_password(password)
        user.is_password_changed=False
        user.save()
        return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)
    

