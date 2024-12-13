from django.contrib import admin
from PruebaApp.models import Jugador
class JugadorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'ppp', 'eficacia', 'posicion')

admin.site.register(Jugador, JugadorAdmin)

