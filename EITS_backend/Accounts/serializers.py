from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer as UserSerializer
from .models import Profile

User = get_user_model()
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = ['phone_number','grand_father_name','dept','sub_dept']

class UserCreateSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role', 'user_profile']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def validate(self, attrs):
        if not attrs.get('password'):
            username = attrs.get('username')
            if username:
                attrs['password'] = f"{username}abcd"
            else:
                raise serializers.ValidationError({"username": "Username is required to generate a password."})
        return attrs

    def create(self, validated_data):
        user_profile_data = validated_data.pop('user_profile', None)
        
        # Create the user instance
        user = User.objects.create(**validated_data)
        
        # Set the password (hash it)
        password = validated_data.get("password")
        if password:
            user.set_password(password)
            user.save()

        # Create the user profile if data is provided
        if user_profile_data:
            Profile.objects.create(user=user, **user_profile_data)
        
        return user

    def update(self, instance, validated_data):
        
        return super().update(instance, validated_data)

class CurrentUserSerializer(UserSerializer):
    user_profile=ProfileSerializer()
    class Meta(UserSerializer.Meta):
        fields=['id','username','first_name','last_name','email','role','created_at','updated_at','user_profile']
