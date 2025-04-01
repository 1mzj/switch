"""Switch_Pre URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main_app import views

urlpatterns = [
    # path("admin/", admin.site.urls),
    path("", views.login),
    path("login/", views.login),
    path("logout/", views.logout_view),
    
    path("create_code/", views.create_code),
    path("index/", views.index),
    path('submit_json_data/',views.submit_json_data),

    path('dataWeb/',views.dataWeb),
    path('submit_new_data/', views.submit_new_data),
    path('operate_mes/', views.operate_mes),
    path('save_edit/', views.save_edit),
    
    path('month/', views.month),
    path('year/', views.year),
    path('excel_export/', views.excel_export),

    path('register/',views.register),
    path('manager/',views.manager),
    path('manager_log/',views.manager_log),
    path('operate_user/', views.operate_user),
    path('save_edit_user/', views.save_edit_user),
    path('reset_password/', views.reset_password),


    path('get_screen_height/', views.get_screen_height),
    path('get_char_data/', views.get_char_data),
    
    
]
