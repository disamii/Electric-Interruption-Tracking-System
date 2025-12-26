from rest_framework import serializers
from .models import Message
class MessageListSerializer(serializers.ListSerializer):
    def update(self, instance_list, validated_data):
        instance_mapping = {instance.id: instance for instance in instance_list}
        updated_messages = []
        
        for item in validated_data:
            message_id = item.get('id')
            if message_id:
                message = instance_mapping.get(message_id)
                if message:
                    # Update attributes excluding 'id'
                    for attr, value in item.items():
                        if attr != 'id':
                            setattr(message, attr, value)
                    message.save()
                    updated_messages.append(message)
        
        return updated_messages

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'message', 'seen', 'timestamp']
        read_only_fields = ['id']
        list_serializer_class = MessageListSerializer

