from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseSerializer,UserSerializer
from .models import Profile,AppUser

class UserCreateSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        fields=['id','username','first_name','last_name','email','password']
class CurrentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields=['id','username','first_name','last_name','email']
    
class ProfileSerializer(serializers.ModelSerializer):
    user=CurrentUserSerializer(read_only=True)
    user_id=serializers.IntegerField(read_only=True)
    class Meta:
        model=Profile
        fields = ['id','user','user_id','grand_father_name','dept','sub_dept']
