from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.http import JsonResponse
from rest_framework import routers
from PruebaApp import views

# Configurar el router para usar ViewSet
router = routers.DefaultRouter()
router.register(r'jugadores', views.jugadorView, basename='jugador')
router.register(r'equipos', views.EquipoView, basename='equipo')
router.register(r'dt', views.DTView, basename='dt')


urlpatterns = [
    # Ruta para el administrador
    path('admin/', admin.site.urls),

    # Rutas del frontend
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('jugador/', TemplateView.as_view(template_name='jugador.html'), name='jugador-frontend'),
    path('equipo/', TemplateView.as_view(template_name='equipo.html'), name='equipo-frontend'),
    path('dt/', TemplateView.as_view(template_name='dt.html'), name='dt-frontend'),

    # Rutas del API generadas automáticamente por el router
    path('api/', include(router.urls)),

]
