// Main JavaScript file for Yeşil Dünya website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Setup navigation active state
    setupNavigation();
    
    // Setup login button
    setupLoginButton();
    
    // Add animation classes to elements when they come into view
    setupScrollAnimations();
}

// Setup navigation active state based on current page
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Add active class to current page link
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Setup login button functionality
function setupLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            // If we're not already on the login page, navigate to it
            if (window.location.pathname.indexOf('giris.html') === -1) {
                window.location.href = 'giris.html';
            }
        });
    }
}

// Add animation classes to elements when they come into view
function setupScrollAnimations() {
    // Get all elements that should be animated
    const elements = document.querySelectorAll('.feature-box, .module-card, .summary-card, .education-content');
    
    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Stop observing after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    // Observe each element
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Check if user is logged in (for demo purposes)
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Set logged in status (for demo purposes)
function setLoggedIn(status) {
    localStorage.setItem('isLoggedIn', status);
}

// Logout function (for demo purposes)
function logout() {
    setLoggedIn(false);
    window.location.href = 'index.html';
}
