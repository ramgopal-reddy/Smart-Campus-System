// Load attendance history on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadAttendanceHistory();
});

// Mark attendance
async function markAttendance() {
    const roll = document.getElementById("roll").value.trim();
    const status = document.getElementById("status").value;
    const email = document.getElementById("student_email").value.trim();

    if (!roll || !email) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    const submitBtn = document.querySelector('button[onclick="markAttendance()"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner me-2"></span>Marking...';
    submitBtn.disabled = true;

    try {
        const response = await makeAuthenticatedRequest(`/mark_attendance`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roll_number: roll,
                status: status,
                student_email: email
            })
        });

        if (response.ok) {
            showAlert('Attendance marked successfully!', 'success');
            document.getElementById('attendanceForm').reset();
            loadAttendanceHistory();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error marking attendance', 'danger');
        }
    } catch (error) {
        console.error('Error marking attendance:', error);
        showAlert('Error marking attendance', 'danger');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load attendance history
async function loadAttendanceHistory() {
    try {
        const response = await makeAuthenticatedRequest(`/attendance_history`);
        if (response.ok) {
            const history = await response.json();
            displayAttendanceHistory(history);
        }
    } catch (error) {
        console.error('Error loading attendance history:', error);
    }
}

// Display attendance history
function displayAttendanceHistory(history) {
    const historyDiv = document.getElementById('history');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="text-muted text-center">No attendance records found</p>';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Roll Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

    history.forEach(record => {
        const statusClass = record.status.toLowerCase() === 'present' ? 'success' : 
                           record.status.toLowerCase() === 'absent' ? 'danger' : 'warning';
        html += `
            <tr>
                <td>${record.roll}</td>
                <td><span class="badge bg-${statusClass}">${record.status}</span></td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    historyDiv.innerHTML = html;
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
