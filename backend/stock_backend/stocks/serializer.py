from rest_framework import serializers

class StockSerializer(serializers.Serializer):
    _id = serializers.CharField()
    lower_date = serializers.DateTimeField()
    upper_date = serializers.DateTimeField()