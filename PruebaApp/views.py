from django.shortcuts import render
from django.http import JsonResponse
from PruebaApp.models import Jugador
from .serializers import JugadorSerializer
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.decorators import api_view

from rest_framework import viewsets
from .models import Jugador,Equipo,DirectorTecnico
from .serializers import JugadorSerializer,EquipoSerializer,DTSerializer

# ViewSet que maneja todas las acciones (GET, POST, PUT, DELETE)
class jugadorView(viewsets.ModelViewSet):
    queryset = Jugador.objects.all()  # Obtiene todos los jugadores
    serializer_class = JugadorSerializer  # Usamos el serializador definido


    # ViewSet que maneja todas las acciones (GET, POST, PUT, DELETE)
class EquipoView(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()  # Obtiene todos los jugadores
    serializer_class = EquipoSerializer  # Usamos el serializador definido


class DTView(viewsets.ModelViewSet):
    queryset = DirectorTecnico.objects.all()  # Obtiene todos los jugadores
    serializer_class = DTSerializer  # Usamos el serializador definido