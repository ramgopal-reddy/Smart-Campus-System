// Navbar Authentication Management
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth to be available, then update navbar
    setTimeout(() => {
        if (typeof window.auth !== 'undefined') {
            updateNavbarAuth();
        }
    }, 100); // Small delay to ensure auth.js is loaded
});

// Update navbar based on authentication state
function updateNavbarAuth() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;

    if (window.auth.isAuthenticated()) {
        // User is logged in
        const userName = window.auth.getUserName();
        const userRole = window.auth.getUserRole();
        
        authSection.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>
                    ${userName}
                    <span class="badge bg-secondary ms-1">${userRole}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><h6 class="dropdown-header">${userName}</h6></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </a></li>
                </ul>
            </li>
        `;
    } else {
        // User is not logged in
        authSection.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/login/">
                    <i class="bi bi-box-arrow-in-right me-1"></i>Login
                </a>
            </li>
            <li class="nav-item">
                <a class="btn btn-primary ms-2 px-3" href="/register/">
                    <i class="bi bi-person-plus me-1"></i>Register
                </a>
            </li>
        `;
    }
}

// Listen for authentication changes
window.addEventListener('storage', function(e) {
    if (e.key === 'access_token' || e.key === 'user') {
        updateNavbarAuth();
    }
});

// Export for use in other files
window.updateNavbarAuth = updateNavbarAuth;
