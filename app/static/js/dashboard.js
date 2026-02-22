// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadDashboardStats();
});

// Load dashboard statistics
async function loadDashboardStats() {
    // Update user welcome message
    const userName = auth.getUserName();
    const userRole = auth.getUserRole();
    if (userName) {
        document.getElementById('userWelcome').textContent = `${userName} (${userRole})`;
    }
    
    await Promise.all([
        loadStudentStats(),
        loadFacultyStats(),
        loadClassroomStats(),
        loadCourseStats()
    ]);
}

// Load student statistics
async function loadStudentStats() {
    try {
        const response = await makeAuthenticatedRequest(`/students`);
        if (response.ok) {
            const students = await response.json();
            const totalStudents = students.length;
            
            document.getElementById('totalStudents').textContent = totalStudents;
        }
    } catch (error) {
        console.error('Error loading student stats:', error);
    }
}

// Load faculty statistics
async function loadFacultyStats() {
    try {
        const response = await makeAuthenticatedRequest(`/faculty`);
        if (response.ok) {
            const faculty = await response.json();
            const totalFaculty = faculty.length;
            
            document.getElementById('totalFaculty').textContent = totalFaculty;
        }
    } catch (error) {
        console.error('Error loading faculty stats:', error);
    }
}

// Load classroom statistics
async function loadClassroomStats() {
    try {
        const response = await makeAuthenticatedRequest(`/classrooms`);
        if (response.ok) {
            const classrooms = await response.json();
            const totalClassrooms = classrooms.length;
            
            document.getElementById('totalClassrooms').textContent = totalClassrooms;
        }
    } catch (error) {
        console.error('Error loading classroom stats:', error);
    }
}

// Load course statistics
async function loadCourseStats() {
    try {
        const response = await makeAuthenticatedRequest(`/courses`);
        if (response.ok) {
            const courses = await response.json();
            const totalCourses = courses.length;
            
            document.getElementById('totalCourses').textContent = totalCourses;
        }
    } catch (error) {
        console.error('Error loading course stats:', error);
    }
}
