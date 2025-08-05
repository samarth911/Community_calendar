// JavaScript for Mobile Menu, Event Modals, and Theme Toggle

// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const aboutModal = document.getElementById('aboutModal');
const modalClose = document.getElementById('modalClose');
const eventModal = document.getElementById('eventModal');
const themeToggle = document.getElementById('themeToggle');

// Event data is now stored in separate HTML files in the events/ folder

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'system';

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateThemeIcon(systemTheme);
        updateLogo(systemTheme);
    } else {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        updateLogo(theme);
    }
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function updateLogo(theme) {
    const logoDark = document.getElementById('logoDark');
    const logoLight = document.getElementById('logoLight');
    
    console.log('Updating logo for theme:', theme);
    console.log('Logo elements:', { logoDark, logoLight });
    
    if (logoDark && logoLight) {
        if (theme === 'light') {
            logoDark.style.opacity = '1';  // Black logo visible in light theme
            logoLight.style.opacity = '0'; // White logo hidden in light theme
            console.log('Light theme: Black logo visible, White logo hidden');
        } else {
            logoDark.style.opacity = '0';  // Black logo hidden in dark theme
            logoLight.style.opacity = '1'; // White logo visible in dark theme
            console.log('Dark theme: White logo visible, Black logo hidden');
        }
    } else {
        console.log('Logo elements not found!');
    }
}

function cycleTheme() {
    const themes = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
}

// Initialize theme
setTheme(currentTheme);

// Force logo update on page load
setTimeout(() => {
    const currentThemeState = document.documentElement.getAttribute('data-theme') || 'dark';
    console.log('Initial theme state:', currentThemeState);
    updateLogo(currentThemeState);
}, 100);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme === 'system') {
        setTheme('system');
    }
});

// Theme toggle event listener
themeToggle.addEventListener('click', cycleTheme);

// Mobile menu functionality
mobileMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// About Modal functionality
document.querySelector('a[href="#about"]').addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close about modal
modalClose.addEventListener('click', () => {
    aboutModal.classList.remove('active');
    document.body.style.overflow = '';
});

aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Event Modal functionality
async function openEventModal(eventIndex) {
    try {
        // Load the specific event HTML file
        const response = await fetch(`events/event${eventIndex + 1}.html`);
        if (!response.ok) {
            throw new Error('Failed to load event details');
        }
        
        const eventContent = await response.text();
        
        // Update modal content
        const modalContent = eventModal.querySelector('.event-modal');
        modalContent.innerHTML = eventContent;
        

        
        // Re-attach button listeners
        const primaryBtn = modalContent.querySelector('.btn-primary');
        const secondaryBtn = modalContent.querySelector('.btn-secondary');
        
        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                alert('Calendar integration coming soon!');
            });
        }
        
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'College Event',
                        text: 'Check out this exciting event!',
                        url: window.location.href
                    });
                } else {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url).then(() => {
                        alert('Event URL copied to clipboard!');
                    });
                }
            });
        }
        
        // Show modal
        eventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Push state for back button support
        history.pushState({ modal: 'event' }, '', '#event');
        
    } catch (error) {
        console.error('Error loading event details:', error);
        alert('Failed to load event details. Please try again.');
    }
}

// Listen for popstate to close modal on back
window.addEventListener('popstate', (e) => {
    if (eventModal.classList.contains('active')) {
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close event modal by clicking outside
eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add click event listeners to all event cards
document.querySelectorAll('.event-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        openEventModal(index);
    });
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (aboutModal.classList.contains('active')) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (eventModal.classList.contains('active')) {
            eventModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Button event listeners are now handled dynamically in the openEventModal function

