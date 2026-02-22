// Load students on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadStudents();
});

// Load all students
async function loadStudents() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/students`);
        if (response.ok) {
            const students = await response.json();
            displayStudents(students);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load students. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadStudents()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display students in table
function displayStudents(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No student records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudent('${student.roll}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.roll}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add student modal
function addStudent() {
    document.getElementById('studentForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('studentModal'));
    modal.show();
}

// Save student
async function saveStudent() {
    const roll = document.getElementById('roll').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (!roll || !name || !email) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest('/add_student', {
            method: 'POST',
            body: JSON.stringify({
                roll: roll,
                name: name,
                email: email
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
            closeModalProperly(modal);
            loadStudents();
            showAlert('Student added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding student', 'danger');
        }
    } catch (error) {
        console.error('Error saving student:', error);
        showAlert('Error adding student', 'danger');
    }
}

// View student details
async function viewStudent(rollNumber) {
    try {
        const response = await makeAuthenticatedRequest(`/student/${rollNumber}`);
        if (response.ok) {
            const student = await response.json();
            showAlert(`Student: ${student.name}, Roll: ${student.roll}, Email: ${student.email}`, 'info');
        }
    } catch (error) {
        console.error('Error viewing student:', error);
    }
}

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#studentTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
