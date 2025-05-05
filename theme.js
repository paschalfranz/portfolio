// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add theme toggle button to the header
    const header = document.querySelector('.header');
    const themeToggle = document.createElement('button');
    themeToggle.classList.add('theme-toggle');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
    themeToggle.setAttribute('title', 'Toggle light/dark mode');

    // Insert before the menu toggle if it exists, otherwise append to header
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        header.insertBefore(themeToggle, menuToggle);
    } else {
        header.appendChild(themeToggle);
    }

    // Get the stored theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default is dark

    // Apply the stored theme on initial load
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update icon based on current theme
    updateThemeIcon(currentTheme);

    // Toggle theme when the button is clicked
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Apply transition effect
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 1000);

        // Set the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update the icon
        updateThemeIcon(newTheme);
    });

    // Function to update the theme toggle icon
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    // Add header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Check initial scroll position
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // Initialize scroll animations but don't change project animations
    initScrollAnimations();
});

// Scroll animation functionality - don't modify project section animations
function initScrollAnimations() {
    // Add animation classes to specific elements but avoid project section
    addAnimationClassesToElements();

    // After a short delay to let DOM updates process
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.project-card):not(.projects-container)');

        // Create IntersectionObserver instance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // If this element has children that need to be animated
                    const animatedChildren = entry.target.querySelectorAll('.animate-children');
                    animatedChildren.forEach(child => {
                        child.classList.add('animated');
                    });

                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1, // Trigger when at least 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger by 50px from bottom
        });

        // Apply the observer to all elements with the animate-on-scroll class
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }, 100);
}

// Add animation classes to specific elements but preserve project section
function addAnimationClassesToElements() {
    // Title elements with staggered animations
    document.querySelectorAll('h1:not(.hero-name), h2.section-title:not(.projects-section .section-title), h2.about-title').forEach((el, index) => {
        if (!el.classList.contains('animate-on-scroll')) {
            el.classList.add('animate-on-scroll', 'fade-in-up');
        }
    });

    // About section elements
    if (document.querySelector('.about-me-section')) {
        const aboutMeSection = document.querySelector('.about-me-section');

        // Add to container
        aboutMeSection.classList.add('animate-on-scroll', 'fade-in');

        // Left card
        const leftCard = aboutMeSection.querySelector('.about-left-card');
        if (leftCard && !leftCard.classList.contains('animate-on-scroll')) {
            leftCard.classList.add('animate-on-scroll', 'fade-in-left');
        }

        // Right card
        const rightCard = aboutMeSection.querySelector('.about-right-card');
        if (rightCard && !rightCard.classList.contains('animate-on-scroll')) {
            rightCard.classList.add('animate-on-scroll', 'fade-in-right');
        }

        // Dreams list with staggered animations
        const dreamsList = rightCard?.querySelector('.dreams-list');
        if (dreamsList) {
            dreamsList.classList.add('animate-on-scroll', 'animate-children');
        }
    }

    // We don't touch project section to preserve original animations

    // Footer
    if (document.querySelector('.after-projects')) {
        const footer = document.querySelector('.after-projects');
        footer.classList.add('animate-on-scroll', 'fade-in-up');

        // Footer sections
        const heroText = footer.querySelector('.hero-text');
        if (heroText) {
            heroText.classList.add('animate-on-scroll', 'fade-in-up');
        }

        const contactButtons = footer.querySelector('.contact-buttons');
        if (contactButtons) {
            contactButtons.classList.add('animate-on-scroll', 'fade-in-up');
        }
    }

    // Case study sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('animate-on-scroll', 'fade-in');

        const showcase = section.querySelector('.showcase-wrapper');
        if (showcase) {
            showcase.classList.add('animate-on-scroll', 'fade-in-up');
        }
    });

    // Project hero section on case study pages
    const projectHero = document.querySelector('.project-hero');
    if (projectHero) {
        projectHero.classList.add('animate-on-scroll', 'fade-in');

        const projectInfo = projectHero.querySelector('.project-info');
        if (projectInfo) {
            projectInfo.classList.add('animate-on-scroll', 'fade-in-left');
        }

        const projectImage = projectHero.querySelector('.project-hero-image');
        if (projectImage) {
            projectImage.classList.add('animate-on-scroll', 'fade-in-right');
        }
    }
}