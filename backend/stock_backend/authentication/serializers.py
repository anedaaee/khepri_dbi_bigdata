from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    _id = serializers.CharField(min_length=3,required=True)
    password = serializers.CharField(min_length=3,required=True)
    full_name = serializers.CharField(min_length=3,required=True)
    email = serializers.EmailField()
    phone = serializers.CharField(min_length=10,required=True)
    
class LoginSerializer(serializers.Serializer):
    _id = serializers.CharField(min_length=3,required=True)
    password = serializers.CharField(min_length=3,required=True)
    
class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
    