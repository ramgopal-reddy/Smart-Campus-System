from django.shortcuts import render
import requests
import json

# API Configuration - Your Render URL
API_BASE_URL = "https://smart-campus-management-system-lcgz.onrender.com"

# Create your views here.
def index(request):
    return render(request, "index.html")

def login_page(request):
    return render(request, "login.html")

def register_page(request):
    return render(request, "register.html")

def analytics_page(request):
    return render(request, "analytics.html")

def dashboard_page(request):
    return render(request, "dashboard.html")

def home(request):
    return render(request, "index.html")

def attendance_page(request):
    return render(request, "attendance.html")

def food_page(request):
    return render(request, "food.html")

def students_page(request):
    return render(request, "students.html")

def faculty_page(request):
    return render(request, "faculty.html")

def blocks_page(request):
    return render(request, "blocks.html")

def classrooms_page(request):
    return render(request, "classrooms.html")

def courses_page(request):
    return render(request, "courses.html")

def makeup_page(request):
    return render(request, "makeup.html")

def makeup_attendance_page(request):
    return render(request, "makeup-attendance.html")

# API Helper Functions
async def get_attendance_history():
    try:
        response = requests.get(f"{API_BASE_URL}/attendance_history")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

async def get_food_order_history():
    try:
        response = requests.get(f"{API_BASE_URL}/food_order_history")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

async def get_student_by_roll(roll_number):
    try:
        response = requests.get(f"{API_BASE_URL}/student/{roll_number}")
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None

async def get_students():
    try:
        response = requests.get(f"{API_BASE_URL}/students")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

async def get_faculty():
    try:
        response = requests.get(f"{API_BASE_URL}/faculty")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

async def get_classrooms():
    try:
        response = requests.get(f"{API_BASE_URL}/classrooms")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []