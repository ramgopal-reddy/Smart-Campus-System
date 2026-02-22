// Load makeup classes on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadMakeupClasses();
    loadFacultyOptions();
    loadCourseOptions();
});

// Load all makeup classes
async function loadMakeupClasses() {
    const tbody = document.getElementById('makeupTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/makeup_classes`);
        if (response.ok) {
            const classes = await response.json();
            displayMakeupClasses(classes);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading makeup classes:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load makeup classes. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadMakeupClasses()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display makeup classes in table
function displayMakeupClasses(classes) {
    const tbody = document.getElementById('makeupTableBody');
    tbody.innerHTML = '';
    
    if (classes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No makeup classes scheduled</p>
                </td>
            </tr>
        `;
        return;
    }
    
    classes.forEach(makeupClass => {
        const row = document.createElement('tr');
        const scheduledDate = new Date(makeupClass.scheduled_time).toLocaleString();
        
        row.innerHTML = `
            <td>${makeupClass.id}</td>
            <td>${makeupClass.faculty_name}</td>
            <td>${makeupClass.course_name}</td>
            <td>${scheduledDate}</td>
            <td><span class="badge bg-info">${makeupClass.remedial_code}</span></td>
            <td><span class="badge bg-success">${makeupClass.attendance_count} students</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewMakeupClass(${makeupClass.id})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load faculty options
async function loadFacultyOptions() {
    try {
        const response = await makeAuthenticatedRequest(`/faculty`);
        if (response.ok) {
            const faculty = await response.json();
            const select = document.getElementById('facultySelect');
            select.innerHTML = '<option value="">Select Faculty</option>';
            
            faculty.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
    }
}

// Load course options
async function loadCourseOptions() {
    try {
        const response = await makeAuthenticatedRequest(`/courses`);
        if (response.ok) {
            const courses = await response.json();
            const select = document.getElementById('courseSelect');
            select.innerHTML = '<option value="">Select Course</option>';
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.course_code} - ${course.course_name}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Schedule makeup class modal
function scheduleMakeupClass() {
    document.getElementById('makeupForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('makeupModal'));
    modal.show();
}

// Save makeup class
async function saveMakeupClass() {
    const facultyId = document.getElementById('facultySelect').value;
    const courseId = document.getElementById('courseSelect').value;
    const scheduledTime = document.getElementById('scheduledTime').value;
    const remedialCode = document.getElementById('remedialCode').value;
    
    if (!facultyId || !courseId || !scheduledTime || !remedialCode) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest('/makeup_classes', {
            method: 'POST',
            body: JSON.stringify({
                faculty_id: parseInt(facultyId),
                course_id: parseInt(courseId),
                scheduled_time: scheduledTime,
                remedial_code: remedialCode
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('makeupModal'));
            closeModalProperly(modal);
            loadMakeupClasses();
            showAlert('Makeup class scheduled successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error scheduling makeup class', 'danger');
        }
    } catch (error) {
        console.error('Error scheduling makeup class:', error);
        showAlert('Error scheduling makeup class', 'danger');
    }
}

// View makeup class details
function viewMakeupClass(classId) {
    showAlert(`Make-up Class ID: ${classId}`, 'info');
}

// Search makeup classes
function searchMakeupClasses() {
    const searchTerm = document.getElementById('makeupSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#makeupTableBody tr');
    
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
