from rest_framework.mixins import CreateModelMixin,UpdateModelMixin,RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from djoser.views import UserViewSet
from .models import Profile
from .serializers import ProfileSerializer




class ProfileViewSet(CreateModelMixin,RetrieveModelMixin,UpdateModelMixin,GenericViewSet):
    queryset=Profile.objects.all()
    serializer_class=ProfileSerializer
    # permission_classes = [IsAuthenticated]
    
    @action(detail=False ,methods=['PUT','GET'] )
    def me(self,request):

        (user,created)=Profile.objects.get_or_create(user_id=request.user.id)
        if request.method=='GET':
            serializer=ProfileSerializer(user)
            return Response(serializer.data)
        elif request.method=='PUT':
            serializer=ProfileSerializer(user,data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
