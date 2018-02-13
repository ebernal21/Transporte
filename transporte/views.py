# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import absolute_import
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from transporte.models import *

# Create your views here.

def index(request):
    return render(request, 'Transporte/index.html')


@csrf_exempt
def login(request):

	if request.method == 'GET':
		try:
			usuario = request.GET["u"]
			pw = request.GET["p"]
			try:
				user = authenticate(request, username=usuario, password=pw)
				return JsonResponse({'status':0,'usuario':user.username, 'password':user.password})
			except user.DoesNotExist:
				return JsonResponse({'status':1, 'mensaje':'Usuario no existe'})
		except KeyError:
			return JsonResponse({'status':2, 'mensaje':'Parametros incorrectos'})

@csrf_exempt
def registro(request):

	if request.method == 'POST':
		try:
			nom = request.POST['nombre']
			apelliPat = request.POST['apellidoPaterno']
			apelliMat = request.POST['apellidoMaterno']
			t = request.POST['turno']
			em = request.POST['email']
			tel = request.POST['telefono']
			direc = request.POST['direccion']
			escuel = request.POST['escuela']
			camionEnt = request.POST['camionE']
			camionSal = request.POST['camionS']
			esc = Escuela.objects.get(Nombre = escuel)
			print(esc.id)
			idEscuela = esc.id		
			c1 = Camion.objects.get(NumeroUnidad = camionEnt)
			idCamion = c1.id
			print(c1)
			c2 = Camion.objects.get(NumeroUnidad = camionSal)
			idCamion2 = c2.id
			print(c2)
			obj = Alumno.objects.create(Nombre=nom,ApellidoPaterno=apelliPat,ApellidoMaterno=apelliMat,Correo=em,Telefono=tel,Direccion=direc,Escuela = esc)
			print (obj.id)
			aC = AlumnoCamion(alumno=obj,camion=c1,status=1)
			aC.save()
			aC2 = AlumnoCamion(alumno=obj,camion=c2,status=1)
			aC2.save()
			alumno = Alumno.objects.all()
			print(alumno)
			#bo = Boleto.objects.get(pk=b.pk)
			#b.Cliente_id = obj.id
			#b.save(update_fields=['Estatus','Cliente_id'])
			return JsonResponse({'status':0, 'mensaje':'Registro Completado'})
		except KeyError:
			return JsonResponse({'status':2, 'mensaje':'Parametros incorrectos'})
	else:
			return JsonResponse({'status':3, 'mensaje':'Metodo Incorrecto'})
