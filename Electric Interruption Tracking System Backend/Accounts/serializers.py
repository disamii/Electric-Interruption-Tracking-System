from rest_framework import serializers
from Interruption.serializers import InterruptDataSerializer
from .models import MyUser
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    # user_upload=InterruptDataSerializer(many=True,read_only=True)
    password=serializers.CharField(write_only=True)
    totalUpload=serializers.CharField(read_only=True)
    class Meta:
        model=MyUser
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'grand_father_name',
            'dept',
            'sub_dept',
            'role',
            'phone_number',
            'is_password_changed',
            'is_staff',
            'is_superuser',
            'is_active',
            'created_at',
            'updated_at',
            'password',
            'totalUpload',
        ]
        read_only_fields = ['created_at', 'updated_at']
 

class UserUpdateSerializer(serializers.ModelSerializer):
           
    class Meta:
        model=MyUser
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'grand_father_name',
            'dept',
            'sub_dept',
            # 'role',
            'phone_number',
        ]



        
class ChangePasswordSerializer(serializers.Serializer):
    old_password=serializers.CharField(required=True)
    new_password=serializers.CharField(required=True)


    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


    def validate_new_password(self, value):
            validate_password(value, self.context['request'].user)
            return value
