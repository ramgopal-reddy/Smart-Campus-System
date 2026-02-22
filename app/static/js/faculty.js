// Load faculty on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadFaculty();
});

// Load all faculty
async function loadFaculty() {
    const tbody = document.getElementById('facultyTableBody');
    tbody.innerHTML = '<tr><td colspan="3" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/faculty`);
        if (response.ok) {
            const faculty = await response.json();
            displayFaculty(faculty);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load faculty. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadFaculty()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display faculty in table
function displayFaculty(faculty) {
    const tbody = document.getElementById('facultyTableBody');
    tbody.innerHTML = '';
    
    if (faculty.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No faculty records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    faculty.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.email || 'N/A'}</td>
            <td>
                <span class="badge bg-primary">View Courses</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewFaculty(${member.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFaculty(${member.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add faculty modal
function addFaculty() {
    document.getElementById('facultyForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('facultyModal'));
    modal.show();
}

// Add course assignment to faculty
function addCourseAssignment() {
    const courseAssignments = document.getElementById('courseAssignments');
    const assignmentCount = courseAssignments.children.length;
    
    // Create assignment row
    const assignmentDiv = document.createElement('div');
    assignmentDiv.className = 'row g-2 mb-2 align-items-center';
    assignmentDiv.innerHTML = `
        <div class="col-md-5">
            <select class="form-select form-select-sm" id="course_${assignmentCount}" required>
                <option value="">Select Course</option>
            </select>
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control form-control-sm" id="hours_${assignmentCount}" 
                   placeholder="Hours" min="1" required>
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeCourseAssignment(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    // Add to assignments container
    if (courseAssignments.querySelector('.text-muted')) {
        courseAssignments.innerHTML = ''; // Remove "No courses assigned" text
    }
    courseAssignments.appendChild(assignmentDiv);
    
    // Load course options for this assignment
    loadCourseOptionsForAssignment(`course_${assignmentCount}`);
}

// Remove course assignment
function removeCourseAssignment(button) {
    const assignmentDiv = button.closest('.row');
    assignmentDiv.remove();
    
    // Check if no assignments left
    const courseAssignments = document.getElementById('courseAssignments');
    if (courseAssignments.children.length === 0) {
        courseAssignments.innerHTML = '<div class="text-muted">No courses assigned yet</div>';
    }
}

// Load course options for specific assignment
async function loadCourseOptionsForAssignment(selectId) {
    try {
        const response = await makeAuthenticatedRequest('/courses');
        if (response.ok) {
            const courses = await response.json();
            const select = document.getElementById(selectId);
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.course_code} - ${course.course_name}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading course options:', error);
    }
}

// Save faculty
async function saveFaculty() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (!name || !email) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest('/add_faculty', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('facultyModal'));
            closeModalProperly(modal);
            loadFaculty();
            showAlert('Faculty added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding faculty', 'danger');
        }
    } catch (error) {
        console.error('Error saving faculty:', error);
        showAlert('Error adding faculty', 'danger');
    }
}

// View faculty details
function viewFaculty(facultyId) {
    showAlert(`Faculty ID: ${facultyId}`, 'info');
}

// Search faculty
function searchFaculty() {
    const searchTerm = document.getElementById('facultySearch').value.toLowerCase();
    const rows = document.querySelectorAll('#facultyTableBody tr');
    
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
