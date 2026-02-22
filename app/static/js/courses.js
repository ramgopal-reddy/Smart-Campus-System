// Load courses on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadCourses();
});

// Load all courses
async function loadCourses() {
    const tbody = document.getElementById('courseTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/courses`);
        if (response.ok) {
            const courses = await response.json();
            displayCourses(courses);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load courses. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadCourses()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display courses in table
function displayCourses(courses) {
    const tbody = document.getElementById('courseTableBody');
    tbody.innerHTML = '';
    
    if (courses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No course records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.course_code}</td>
            <td>${course.course_name}</td>
            <td>${course.weekly_hours}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewCourse(${course.id})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add course modal
function addCourse() {
    document.getElementById('courseForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

// Save course
async function saveCourse() {
    const courseCode = document.getElementById('courseCode').value;
    const courseName = document.getElementById('courseName').value;
    const weeklyHours = document.getElementById('weekly_hours').value;
    
    if (!courseCode || !courseName || !weeklyHours) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest('/add_course', {
            method: 'POST',
            body: JSON.stringify({
                course_code: courseCode,
                course_name: courseName,
                weekly_hours: parseInt(weeklyHours)
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
            closeModalProperly(modal);
            loadCourses();
            showAlert('Course added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding course', 'danger');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        showAlert('Error adding course', 'danger');
    }
}

// View course details
function viewCourse(courseId) {
    showAlert(`Course ID: ${courseId}`, 'info');
}

// Search courses
function searchCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#courseTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
