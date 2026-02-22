// Load attendance history on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadAttendanceHistory();
});

// Load makeup attendance history
async function loadAttendanceHistory() {
    const tbody = document.getElementById('attendanceHistoryBody');
    tbody.innerHTML = '<tr><td colspan="3" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/makeup_attendance_history`);
        if (response.ok) {
            const history = await response.json();
            displayAttendanceHistory(history);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading attendance history:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load attendance history. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadAttendanceHistory()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display attendance history
function displayAttendanceHistory(history) {
    const tbody = document.getElementById('attendanceHistoryBody');
    tbody.innerHTML = '';
    
    if (history.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No makeup attendance records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    history.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.makeup_class_id}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><span class="badge bg-success">${record.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Mark makeup attendance
async function markMakeupAttendance() {
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const remedialCode = document.getElementById('remedialCode').value.trim();
    
    if (!rollNumber || !remedialCode) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    if (remedialCode.length !== 8) {
        showAlert('Remedial code must be exactly 8 characters', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`/mark_makeup_attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roll_number: rollNumber,
                remedial_code: remedialCode.toUpperCase()
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('Make-up attendance marked successfully!', 'success');
            document.getElementById('makeupAttendanceForm').reset();
            loadAttendanceHistory();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error marking makeup attendance', 'danger');
        }
    } catch (error) {
        console.error('Error marking makeup attendance:', error);
        showAlert('Error marking makeup attendance', 'danger');
    }
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
