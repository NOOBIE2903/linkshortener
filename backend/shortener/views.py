from django.shortcuts import get_object_or_404, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ShortURL
from .serializers import ShortURLSerializer
from .utils import generate_short_code

class ShortenURLView(APIView):
    def post(self, request):
        long_url = request.data.get("long_url")
        if not long_url:
            return Response({"error": "long_url is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if URL already exists
        existing_entry = ShortURL.objects.filter(long_url=long_url).first()
        if existing_entry:
            serializer = ShortURLSerializer(existing_entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Generate a unique short code
        short_code = generate_short_code()
        while ShortURL.objects.filter(short_code=short_code).exists():
            short_code = generate_short_code()

        # Save new entry
        serializer = ShortURLSerializer(data={"long_url": long_url})
        if serializer.is_valid():
            serializer.save(short_code=short_code)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def redirect_view(request, short_code):
    short_url = get_object_or_404(ShortURL, short_code=short_code)
    return redirect(short_url.long_url)
