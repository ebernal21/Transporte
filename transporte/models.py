from django.db import models

# Create your models here.

from django.utils.translation import ugettext_lazy as _
from jet.dashboard.dashboard import Dashboard, AppIndexDashboard
from jet.dashboard.dashboard_modules import google_analytics


class Chofer(models.Model):
	Nombre = models.CharField(max_length = 60)
	Telefono = models.CharField(max_length = 15)
	Direccion = models.CharField(max_length = 100)
	FechaAlta = models.DateTimeField(auto_now_add = True)


	def Descripcion(self):
		cadena = "{0}, {1} - {2}"
		return cadena.format(self.Nombre, self.Telefono, self.Direccion)

	def __str__(self):
		return self.Descripcion()

class Escuela(models.Model):
	Nombre = models.CharField(max_length = 50)
	Direccion = models.CharField(max_length = 80)
	TURNO = (('M','Matutino'),('V','Vespertino'))
	Turno = models.CharField(max_length = 1,blank=True, null=True, choices= TURNO)
	FechaAlta = models.DateTimeField(auto_now_add = True)

	def __str__(self):
		return "{0} - {1}".format(self.Nombre, self.Direccion)


class Camion(models.Model):
	NumeroUnidad = models.CharField(max_length = 5)
	Escuela = models.ManyToManyField(Escuela)
	Chofer = models.ForeignKey(Chofer, blank = False, null = False, on_delete = models.CASCADE)
	FechaAlta = models.DateTimeField(auto_now_add = True)	
	def __str__(self):
		return "{0} - {1}".format(self.NumeroUnidad, self.Chofer)

class Alumno(models.Model):
	Nombre = models.CharField(max_length = 60)
	ApellidoPaterno = models.CharField(max_length = 50)
	ApellidoMaterno = models.CharField(max_length = 50)	
	Direccion = models.CharField(max_length = 150)
	Telefono = models.CharField(max_length = 15)
	Correo = models.CharField(max_length = 15, null = True)
	FechaAlta = models.DateTimeField(auto_now_add = True)
	Escuela = models.ForeignKey(Escuela, blank = False, null = False)
	Camion = models.ManyToManyField(Camion, related_name='camiones', through='AlumnoCamion', through_fields=('alumno', 'camion'))

	def __str__(self):
		return "{0} - {1}".format(self.Nombre, self.ApellidoPaterno)

class AlumnoCamion(models.Model):
	alumno = models.ForeignKey(Alumno)
	camion = models.ForeignKey(Camion)
	status = models.CharField(max_length = 4)
	ingreso = models.DateTimeField(auto_now_add = True)
	cambio = models.DateTimeField(auto_now_add = False, blank = True, null = True)

class Pago(models.Model):
	NumeroPago = models.CharField(max_length = 5)
	FechaPago = models.DateTimeField(auto_now_add = True)
	Alumno = models.ForeignKey(Alumno, blank = False, null = False)

	def __str__(self):
		return "{0} - {1}".format(self.NumeroPago, self.FechaPago)


