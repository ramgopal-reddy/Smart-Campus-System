// Classroom Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadClassrooms();
    loadBlockOptions();
});

// Load all classrooms
async function loadClassrooms() {
    const tbody = document.getElementById('classroomTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/classrooms`);
        if (response.ok) {
            const classrooms = await response.json();
            displayClassrooms(classrooms);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading classrooms:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load classrooms. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadClassrooms()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display classrooms in table
async function displayClassrooms(classrooms) {
    const tbody = document.getElementById('classroomTableBody');
    tbody.innerHTML = '';
    
    if (classrooms.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No classroom records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Get blocks for mapping block IDs to names
    let blocks = [];
    try {
        const blocksResponse = await makeAuthenticatedRequest(`/blocks`);
        if (blocksResponse.ok) {
            blocks = await blocksResponse.json();
        }
    } catch (error) {
        console.error('Error loading blocks for display:', error);
    }
    
    // Create block name mapping
    const blockMap = {};
    blocks.forEach(block => {
        blockMap[block.id] = block.name;
    });
    
    classrooms.forEach(classroom => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${classroom.room_number}</td>
            <td>${classroom.capacity}</td>
            <td>${blockMap[classroom.block_id] || `Block ${classroom.block_id}`}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewClassroom(${classroom.id})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add classroom modal
function addClassroom() {
    document.getElementById('classroomForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('classroomModal'));
    modal.show();
}

// Save classroom
async function saveClassroom() {
    const roomNumber = document.getElementById('roomNumber').value;
    const capacity = document.getElementById('capacity').value;
    const blockId = document.getElementById('block_id').value;
    
    if (!roomNumber || !capacity || !blockId) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`/add_classroom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_number: roomNumber,
                capacity: parseInt(capacity),
                block_id: parseInt(blockId)
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('classroomModal'));
            closeModalProperly(modal);
            loadClassrooms();
            showAlert('Classroom added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding classroom', 'danger');
        }
    } catch (error) {
        console.error('Error saving classroom:', error);
        showAlert('Error adding classroom', 'danger');
    }
}

// View classroom details
function viewClassroom(classroomId) {
    showAlert(`Classroom ID: ${classroomId}`, 'info');
}

// Search classrooms
function searchClassrooms() {
    const searchTerm = document.getElementById('classroomSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#classroomTableBody tr');
    
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

// Load block options
async function loadBlockOptions() {
    try {
        const response = await makeAuthenticatedRequest(`/blocks`);
        if (response.ok) {
            const blocks = await response.json();
            const blockSelect = document.getElementById('block_id');
            blockSelect.innerHTML = '<option value="">Select a block</option>';
            
            blocks.forEach(block => {
                const option = document.createElement('option');
                option.value = block.id;
                option.textContent = block.name;
                blockSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading blocks:', error);
    }
}
