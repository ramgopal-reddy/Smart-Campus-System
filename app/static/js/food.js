// Load food history on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadFoodHistory();
});

// Order food
async function orderFood() {
    const name = document.getElementById("student_name").value.trim();
    const email = document.getElementById("student_email").value.trim();
    const food = document.getElementById("food_item").value;
    const time = document.getElementById("break_time").value;

    if (!name || !email || !food || !time) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    const orderBtn = document.getElementById("orderBtn");
    const originalText = orderBtn.innerHTML;
    orderBtn.innerHTML = '<span class="spinner me-2"></span>Ordering...';
    orderBtn.disabled = true;

    try {
        const response = await makeAuthenticatedRequest(`/order_food`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_name: name,
                food_item: food,
                break_time: time,
                student_email: email
            })
        });

        if (response.ok) {
            showAlert('Food order placed successfully!', 'success');
            document.getElementById('foodOrderForm').reset();
            loadFoodHistory();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error placing food order', 'danger');
        }
    } catch (error) {
        console.error('Error ordering food:', error);
        showAlert('Error placing food order', 'danger');
    } finally {
        orderBtn.innerHTML = originalText;
        orderBtn.disabled = false;
    }
}

// Load food history
async function loadFoodHistory() {
    try {
        const response = await makeAuthenticatedRequest(`/food_order_history`);
        if (response.ok) {
            const history = await response.json();
            displayFoodHistory(history);
        }
    } catch (error) {
        console.error('Error loading food history:', error);
    }
}

// Display food history
function displayFoodHistory(history) {
    const historyDiv = document.getElementById('foodHistory');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="text-muted text-center">No food orders found</p>';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Student</th>
                        <th>Food Item</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
    `;

    history.forEach(order => {
        html += `
            <tr>
                <td>${order.student}</td>
                <td>${order.food}</td>
                <td>${order.time}</td>
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
