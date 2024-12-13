from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError

# Modelo para el Jugador
class Jugador(models.Model):
    POSICIONES = [
        ('Base', 'Base'),
        ('Escolta', 'Escolta'),
        ('Alero', 'Alero'),
        ('Ala-Pivot', 'Ala-Pivot'),
        ('Pivot', 'Pivot')
    ]

    nombre = models.CharField(max_length=40)
    apellido = models.CharField(max_length=40)
    ppp = models.FloatField()  # Puntos por partido
    eficacia = models.FloatField()
    posicion = models.CharField(max_length=20, choices=POSICIONES)
    edad = models.IntegerField()
    campeonatos = models.IntegerField()
    equipo = models.ForeignKey('Equipo', null=True,blank=True,on_delete=models.CASCADE)  # Relación con Equipo

    def clean(self):
        super().clean()

        if any(char.isdigit() for char in self.nombre):
            raise ValidationError({'nombre': 'El nombre no puede contener números.'})

        if any(char.isdigit() for char in self.apellido):
            raise ValidationError({'apellido': 'El apellido no puede contener números.'})

        if self.ppp < 0:
            raise ValidationError({'ppp': 'Los puntos por partido no pueden ser negativos.'})

        if self.edad < 0:
            raise ValidationError({'edad': 'La edad no puede ser negativa.'})
        if self.edad < 18:
            raise ValidationError({'edad': 'La edad no puede ser menor a 18.'})

        if self.campeonatos < 0:
            raise ValidationError({'campeonatos': 'El número de campeonatos no puede ser negativo.'})

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# Modelo para el Equipo
class Equipo(models.Model):
    nombre = models.CharField(
        max_length=30,
        validators=[
            RegexValidator(
                regex='^[a-zA-Z ]*$',
                message='Nombre inválido, solo letras.'
            )
        ]
    )
    ciudad = models.CharField(
        max_length=30,
        validators=[
            RegexValidator(
                regex='^[a-zA-Z ]*$',
                message='Ciudad inválida, solo letras.'
            )
        ]
    )
    campeonatos = models.IntegerField(
        validators=[MinValueValidator(0, message='El número de campeonatos no puede ser negativo')]
    )
    conferencia = models.CharField(
        max_length=30,
        validators=[
            RegexValidator(
                regex='^[a-zA-Z ]*$',
                message='Conferencia inválida, solo letras.'
            )
        ]
    )
    estadio = models.CharField(max_length=100)
    colores = models.CharField(
        max_length=30,
        validators=[
            RegexValidator(
                regex='^[a-zA-Z ]+$',
                message='Color inválido, solo letras',
                code='invalid_nombre'
            )
        ]
    )
    liga = models.CharField(max_length=100)
    director_tecnico = models.OneToOneField('DirectorTecnico',null=True,blank=True, on_delete=models.CASCADE)  # Relación con DirectorTecnico

    def __str__(self):
        return self.nombre

# Modelo para el Director Técnico
class DirectorTecnico(models.Model):
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    anios_exp = models.IntegerField()
    campeonatos = models.IntegerField()
    activo = models.BooleanField(default=True) 

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {'Activo' if self.activo else 'No Activo'}"
        
