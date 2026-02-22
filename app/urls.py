from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_page, name='login_page'),
    path('register/', views.register_page, name='register_page'),
    path('analytics/', views.analytics_page, name='analytics_page'),
    path('dashboard/', views.dashboard_page, name='dashboard_page'),
    path('attendance/', views.attendance_page, name='attendance_page'),
    path('food/', views.food_page, name='food_page'),
    path('students/', views.students_page, name='students_page'),
    path('faculty/', views.faculty_page, name='faculty_page'),
    path('blocks/', views.blocks_page, name='blocks_page'),
    path('classrooms/', views.classrooms_page, name='classrooms_page'),
    path('courses/', views.courses_page, name='courses_page'),
    path('makeup/', views.makeup_page, name='makeup_page'),
    path('makeup-attendance/', views.makeup_attendance_page, name='makeup_attendance_page'),
]