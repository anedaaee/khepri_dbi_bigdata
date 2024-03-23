from rest_framework import serializers

class PurchaseSelializer(serializers.Serializer):
    stock = serializers.CharField(min_length=3,required=True)
    number = serializers.IntegerField()

    