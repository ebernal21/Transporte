from __future__ import unicode_literals
from __future__ import absolute_import
from django.conf.urls import url, include
from transporte.views import *

urlpatterns = [
	url(r'^index$', index, name='index'),
	url(r'^login$', login, name='login'),
	url(r'^registro$', registro, name='registro'),
]