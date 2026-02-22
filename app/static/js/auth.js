// API Configuration
var API_BASE_URL = "https://smart-campus-management-system-lcgz.onrender.com";

// Authentication Management
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('access_token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Save authentication data
    saveAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Clear authentication data
    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get authorization header
    getAuthHeader() {
        return this.token ? `Bearer ${this.token}` : null;
    }

    // Get user role
    getUserRole() {
        return this.user ? this.user.role : null;
    }

    // Get user name
    getUserName() {
        return this.user ? this.user.name : null;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.getUserRole() === role;
    }
}

// Create global auth instance
const auth = new AuthManager();

// API request helper with authentication
async function makeAuthenticatedRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (auth.isAuthenticated()) {
        headers['Authorization'] = auth.getAuthHeader();
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
        auth.clearAuthData();
        window.location.href = '/login/';
        return;
    }

    return response;
}

// Login functionality
async function login(email, password) {
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        
        // Get user info from protected endpoint using the token directly
        const userResponse = await fetch(`${API_BASE_URL}/protected`, {
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to get user info');
        }
        
        const userData = await userResponse.json();
        auth.saveAuthData(data.access_token, userData);
        
        return { success: true, user: userData };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Register functionality
async function register(name, email, password, role) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout functionality
function logout() {
    auth.clearAuthData();
    window.location.href = '/login/';
}

// Check authentication status and redirect if needed
function checkAuth() {
    if (!auth.isAuthenticated()) {
        window.location.href = '/login/';
        return false;
    }
    return true;
}

// Role-based access control
function requireRole(requiredRole) {
    if (!auth.isAuthenticated()) {
        window.location.href = '/login/';
        return false;
    }
    
    if (!auth.hasRole(requiredRole)) {
        showAlert('Access denied. You do not have the required permissions.', 'danger');
        return false;
    }
    
    return true;
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
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// DOM Content Loaded handlers
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Logging in...';
            submitBtn.disabled = true;
            
            const result = await login(email, password);
            
            if (result.success) {
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                showAlert(result.error, 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Handle register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            
            // Validation
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'danger');
                return;
            }
            
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Registering...';
            submitBtn.disabled = true;
            
            const result = await register(name, email, password, role);
            
            if (result.success) {
                showAlert('Registration successful! Please login.', 'success');
                setTimeout(() => {
                    window.location.href = '/login/';
                }, 1500);
            } else {
                showAlert(result.error, 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Export for use in other files
window.auth = auth;
window.makeAuthenticatedRequest = makeAuthenticatedRequest;
window.checkAuth = checkAuth;
window.requireRole = requireRole;
window.logout = logout;
