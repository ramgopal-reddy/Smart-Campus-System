// Home page authentication check
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth to be available, then check
    setTimeout(() => {
        if (typeof window.auth !== 'undefined' && window.auth.isAuthenticated()) {
            // Redirect to dashboard if authenticated
            window.location.href = '/dashboard/';
        } else {
            // Show login/register options
            updateHomePageForUnauthenticated();
        }
    }, 100); // Small delay to ensure auth.js is loaded
});

// Update home page for unauthenticated users
function updateHomePageForUnauthenticated() {
    // You can add specific home page content for non-authenticated users here
    console.log('Showing home page for unauthenticated users');
}
