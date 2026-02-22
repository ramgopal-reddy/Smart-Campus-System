// Utility functions for Smart Campus Management System

// Utility function to properly close modals and handle focus (accessibility fix)
function closeModalProperly(modal) {
    if (!modal) return;
    
    // Remove focus from any focused element within the modal
    const activeElement = document.activeElement;
    if (activeElement && modal._element.contains(activeElement)) {
        activeElement.blur();
    }
    
    // Hide the modal
    modal.hide();
    
    // Return focus to body after modal is hidden
    setTimeout(() => {
        document.body.focus();
    }, 100);
}

// Show alert messages
function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-container .alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert container if it doesn't exist
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(alertContainer);
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}
