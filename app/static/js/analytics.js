// Campus Analytics JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadAnalytics();
});

// Load all analytics data
async function loadAnalytics() {
    await Promise.all([
        loadBasicStats(),
        loadStudentAnalytics(),
        loadFacultyAnalytics(),
        loadClassroomAnalytics(),
        loadPerformanceMetrics()
    ]);
}

// Load basic statistics
async function loadBasicStats() {
    try {
        const [studentsResponse, coursesResponse, classroomsResponse, facultyResponse] = await Promise.all([
            makeAuthenticatedRequest(`/students`),
            makeAuthenticatedRequest(`/courses`),
            makeAuthenticatedRequest(`/classrooms`),
            makeAuthenticatedRequest(`/faculty`)
        ]);

        if (studentsResponse.ok) {
            const students = await studentsResponse.json();
            document.getElementById('totalStudents').textContent = students.length;
        }

        if (coursesResponse.ok) {
            const courses = await coursesResponse.json();
            document.getElementById('totalCourses').textContent = courses.length;
        }

        if (classroomsResponse.ok) {
            const classrooms = await classroomsResponse.json();
            document.getElementById('totalClassrooms').textContent = classrooms.length;
        }

        if (facultyResponse.ok) {
            const faculty = await facultyResponse.json();
            document.getElementById('totalFaculty').textContent = faculty.length;
            document.getElementById('facultyCount').textContent = faculty.length;
        }

    } catch (error) {
        console.error('Error loading basic stats:', error);
    }
}

// Load student analytics
async function loadStudentAnalytics() {
    try {
        const [studentsResponse, attendanceResponse] = await Promise.all([
            makeAuthenticatedRequest(`/students`),
            makeAuthenticatedRequest(`/attendance_history`)
        ]);

        if (studentsResponse.ok && attendanceResponse.ok) {
            const students = await studentsResponse.json();
            const attendance = await attendanceResponse.json();
            
            const totalStudents = students.length;
            const activeStudents = totalStudents; // Assuming all are active
            const attendanceRate = attendance.length > 0 ? 
                Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 0;
            
            document.getElementById('activeStudents').textContent = activeStudents;
            document.getElementById('attendanceRate').textContent = attendanceRate + '%';
            document.getElementById('studentProgress').style.width = attendanceRate + '%';
        }

    } catch (error) {
        console.error('Error loading student analytics:', error);
    }
}

// Load faculty analytics
async function loadFacultyAnalytics() {
    try {
        const [facultyResponse, coursesResponse] = await Promise.all([
            makeAuthenticatedRequest(`/faculty`),
            makeAuthenticatedRequest(`/courses`)
        ]);

        if (facultyResponse.ok && coursesResponse.ok) {
            const faculty = await facultyResponse.json();
            const courses = await coursesResponse.json();
            
            // Calculate average workload (mock calculation)
            const totalCourses = courses.length;
            const avgWorkload = faculty.length > 0 ? Math.round((totalCourses / faculty.length) * 10) : 0;
            
            document.getElementById('avgWorkload').textContent = avgWorkload + '%';
            document.getElementById('facultyProgress').style.width = Math.min(avgWorkload, 100) + '%';
        }

    } catch (error) {
        console.error('Error loading faculty analytics:', error);
    }
}

// Load classroom analytics
async function loadClassroomAnalytics() {
    try {
        const response = await makeAuthenticatedRequest(`/classrooms`);
        
        if (response.ok) {
            const classrooms = await response.json();
            const totalClassrooms = classrooms.length;
            const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);
            
            // Calculate utilization rate (mock calculation)
            const utilizationRate = totalCapacity > 0 ? Math.round((totalClassrooms * 30 / totalCapacity) * 100) : 0;
            
            document.getElementById('totalCapacity').textContent = totalCapacity;
            document.getElementById('utilizationRate').textContent = utilizationRate + '%';
            document.getElementById('classroomProgress').style.width = Math.min(utilizationRate, 100) + '%';
        }

    } catch (error) {
        console.error('Error loading classroom analytics:', error);
    }
}

// Load performance metrics
async function loadPerformanceMetrics() {
    try {
        // Mock data for performance metrics (in real implementation, these would come from analytics APIs)
        const avgClassDuration = '75 min';
        const scheduleEfficiency = '92%';
        const resourceOptimization = '78%';
        
        document.getElementById('avgClassDuration').textContent = avgClassDuration;
        document.getElementById('scheduleEfficiency').textContent = scheduleEfficiency;
        document.getElementById('resourceOptimization').textContent = resourceOptimization;
        
    } catch (error) {
        console.error('Error loading performance metrics:', error);
    }
}
