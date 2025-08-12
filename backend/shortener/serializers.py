from rest_framework import serializers
from .models import ShortURL

class ShortURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortURL
        fields = ['id', 'long_url', 'short_code']
        read_only_fields = ['short_code']
