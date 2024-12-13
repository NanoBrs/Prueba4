from rest_framework import serializers
from .models import Jugador, Equipo, DirectorTecnico

# Serializer para el Director Técnico
class DTSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorTecnico
        fields = '__all__'

# Serializer para el Jugador
class JugadorSerializer(serializers.ModelSerializer):
    equipo = serializers.PrimaryKeyRelatedField(queryset=Equipo.objects.all())  # Relación con Equipo

    class Meta:
        model = Jugador
        fields = '__all__'

# Serializer para el Equipo
class EquipoSerializer(serializers.ModelSerializer):
    director_tecnico = serializers.PrimaryKeyRelatedField(queryset=DirectorTecnico.objects.all()) 
    jugadores = JugadorSerializer(many=True, read_only=True)  # Relación inversa con Jugador

    class Meta:
        model = Equipo
        fields = '__all__'
