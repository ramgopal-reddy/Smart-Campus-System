# Smart LPU Campus Management System

A comprehensive dual-stack campus management system. It features a **FastAPI** backend for robust and fast API services, paired with a **Django** frontend for an intuitive user interface. This system manages various campus operations including student attendance, food ordering, faculty workload, and make-up classes.

---

## 🌟 System Architecture

- **Backend / API (FastAPI)**: Handles core business logic, database interactions, JWT authentication, and email notifications.
- **Frontend / Web UI (Django)**: Consumes the FastAPI endpoints to provide a complete Web UI for Students, Faculty, and Admins.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** (Login/Register).
- Role-based access control (Admin, Faculty, Student).
- Secure password hashing using `passlib` and `pbkdf2_sha256`.

### 👨‍🎓 Student Management
- Register and maintain student records.
- Track student details like name, roll number, and email.

### 📅 Regular Attendance
- Mark daily attendance for students.
- **Automated Email Notifications**: Sends an email to the student when their attendance is marked (powered by SendGrid).
- View attendance history.

### 🍔 Food Ordering Module
- Allow students to place food orders for break times.
- **Automated Email Confirmation**: Assures students that their meal is prepared.
- Track all food orders placed by students.

### 🏢 Infrastructure Management
- **Blocks & Classrooms**: Manage campus buildings (Blocks) and register classroom capacities.

### 🏫 Courses & Faculty
- Add courses with weekly credit hours.
- Manage faculty profiles.
- Assign courses to faculty members.
- **Faculty Utilization Tracking**: Calculates faculty workload percentage based on a standard 20-hour work week.

### 🕒 Make-Up Class Module
- Schedule remedial/make-up classes.
- Generates a unique, secure **Remedial Code** for every make-up class.
- Mark attendance for make-up classes securely using the generated Remedial Code to prevent proxy attendance.

---

## 🛠️ Technology Stack

- **Backend Framework**: FastAPI
- **Frontend Framework**: Django (Templates, Static Files, Middleware)
- **Database ORM**: SQLAlchemy (Backend) & Django ORM (Frontend)
- **Authentication**: OAuth2 with JWT (JSON Web Tokens)
- **Emails**: SendGrid API
- **Deployment**: Configured for deployment on Render (`render.yaml`, `build.sh`)

---

## 🚀 Setup & Installation (Local Development)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Smart-Campus-System
```

### 2. Create a Virtual Environment
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
Install all required dependencies for both FastAPI and Django:
```bash
pip install -r requirements.txt
```
*(If you are setting up the FastAPI specific requirements separately: `pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart sendgrid`)*

### 4. Configure Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```ini
# Backend Database URL (SQLite or PostgreSQL)
DATABASE_URL=sqlite:///./campus.db  # Or your postgres URL

# SendGrid Configuration for Emails
SENDGRID_API_KEY=your_sendgrid_api_key_here
DEVELOPER_EMAIL=your_verified_sendgrid_sender_email@example.com
```

### 5. Running the Backend (FastAPI)
The FastAPI backend acts as the core API service. Start it using uvicorn:
```bash
uvicorn main:app --reload
```
The FastAPI backend will be available at: **http://127.0.0.1:8000**
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 6. Running the Frontend (Django)
The Django application provides the web interface. Open a **new terminal tab**, activate the virtual environment, and run:
```bash
# Apply Django migrations
python manage.py migrate

# Collect static files (optional for local dev, required for production)
python manage.py collectstatic --no-input

# Run the Django development server
python manage.py runserver
```
The Django frontend will be available at: **http://127.0.0.1:8000** (or `http://127.0.0.1:8080` if you run it on a different port to avoid conflicts with FastAPI). 
*(Tip: Run Django on port 8080 during local development using `python manage.py runserver 8080`)*

---

## ☁️ Deployment (Render)
The repository includes configuration to be easily deployed on **Render**:
- `render.yaml`: Blueprint configuration for the web service.
- `build.sh`: Build script used by Render to install dependencies, run migrations, and collect static files.
- `requirements.txt`: Includes all deployment dependencies (`gunicorn`, `whitenoise`, `dj-database-url`).

---

## 📄 Database Schema Overview
- **Users**: Admin/Faculty/Student credentials.
- **Students**: Core student records.
- **Attendance / FoodOrders**: Track student actions.
- **Blocks / Classrooms**: Physical infrastructure.
- **Courses / Faculty / FacultyCourses**: Academic mappings.
- **MakeupClasses / MakeupAttendance**: Remedial class tracking with secure codes.
