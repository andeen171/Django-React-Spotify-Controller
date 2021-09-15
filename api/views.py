from .serializers import RoomSerializer
from django.shortcuts import render
from rest_framework import generics
from .models import Room


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
