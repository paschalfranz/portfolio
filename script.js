document.addEventListener('DOMContentLoaded', () => {
    initCursorEffects();
    createParticleSystem();
    addScrollEffects();
    setupMenuToggle();
    playOpeningAnimation();
    initSmoothScroll(); // Added smooth scrolling initialization

    // Simple fix for project buttons
    fixProjectButtons();

    // Add the project card scroll functionality
    initLockedProjectScroll();
});

// New function for smooth scrolling
function initSmoothScroll() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-item');

    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if the href is a full URL or path to another page
            if (targetId.indexOf('http') === 0 || targetId.indexOf('/') === 0 || targetId.indexOf('.html') > -1) {
                // Let the default behavior handle external links or other pages
                return;
            }

            e.preventDefault(); // Prevent default anchor behavior only for same-page links

            // Handle home link
            if (targetId === "#") {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            // Check if we're on the home page
            const isHomePage = window.location.pathname === '/' ||
                window.location.pathname.indexOf('index.html') > -1 ||
                window.location.pathname.endsWith('/');

            // If not on home page and trying to navigate to a section on home page
            if (!isHomePage && targetId.startsWith('#')) {
                // Navigate to home page with the hash
                window.location.href = 'index.html' + targetId;
                return;
            }

            // Find the target element on current page
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Get the target's position, accounting for any offsets
                const targetPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = targetPosition + window.pageYOffset - 80; // Adjust the offset as needed

                // Scroll smoothly to the target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // If you have a mobile menu that needs to be closed after clicking
                const nav = document.querySelector('.nav');
                if (nav.classList.contains('active')) {
                    document.getElementById('menu-toggle').click();
                }
            }
        });
    });
}

// Simple fix for project buttons
function fixProjectButtons() {
    document.querySelectorAll('.project-button').forEach(button => {
        // Add a direct onclick handler to each button
        button.onclick = function(e) {
            e.stopPropagation();
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
                return false;
            }
        };
    });
}

// ✨ Opening Animation
function playOpeningAnimation() {
    const overlayTop = document.querySelector('.overlay-top');
    const overlayBottom = document.querySelector('.overlay-bottom');

    if (overlayTop && overlayBottom) {
        setTimeout(() => {
            overlayTop.style.transform = 'scaleY(0)';
            overlayBottom.style.transform = 'scaleY(0)';
        }, 800);

        setTimeout(() => {
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.style.display = 'none';
        }, 2000);
    }
}

// ✨ Hamburger Menu Toggle
function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '✖' : '+';
        });
    }
}

// ✨ Custom Cursor
function initCursorEffects() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    if (!cursor || !cursorTrail) return;

    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';

    setTimeout(() => {
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '1';
    }, 1000);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            cursorTrail.style.left = e.clientX + 'px';
            cursorTrail.style.top = e.clientY + 'px';
        }, 80);
    });

    document.querySelectorAll('a, button, .nav-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursorTrail.style.width = '120px';
            cursorTrail.style.height = '120px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursorTrail.style.width = '100px';
            cursorTrail.style.height = '100px';
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '1';
    });
}

// ✨ Particle System with theme-aware colors
function createParticleSystem() {
    let lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        mouseSpeed = Math.sqrt(dx * dx + dy * dy);

        const particleCount = Math.floor(mouseSpeed / 5);
        for (let i = 0; i < particleCount; i++) {
            if (Math.random() > 0.6) {
                createParticle(e.clientX, e.clientY, mouseSpeed);
            }
        }
    });
}

function createParticle(x, y, speed) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * (speed / 10) + 3;

    // Check current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let hue, saturation, lightness, alpha;

    if (currentTheme === 'light') {
        // Pure black particles for light mode
        // Inside the if (currentTheme === 'light') block:
        hue = 0;
        saturation = 0; // 0% saturation = gray/black
        lightness = 0; // 0% lightness = black
        alpha = Math.random() * 0.15 + 0.05; // More subtle
    } else {
        // Red particles for dark theme (original)
        hue = 0;
        saturation = Math.floor(Math.random() * 30) + 70;
        lightness = Math.floor(Math.random() * 30) + 60;
        alpha = Math.random() * 0.3 + 0.1;
    }

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
    particle.style.position = 'fixed';
    particle.style.borderRadius = '50%';
    particle.style.mixBlendMode = 'screen';
    particle.style.zIndex = '997';

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * speed / 10 + 1;
    let moveX = Math.cos(angle) * velocity;
    let moveY = Math.sin(angle) * velocity - 0.5;
    let elapsed = 0;
    const lifespan = Math.random() * 1000 + 500;

    function animate() {
        if (elapsed >= lifespan) {
            particle.remove();
            return;
        }
        elapsed += 16;
        x += moveX;
        y += moveY;
        moveY -= 0.02;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (size * (1 - elapsed / lifespan)) + 'px';
        particle.style.height = (size * (1 - elapsed / lifespan)) + 'px';
        particle.style.opacity = 1 - (elapsed / lifespan);

        requestAnimationFrame(animate);
    }

    animate();
}

// ✨ Parallax Effect
function addScrollEffects() {
    const heroImage = document.querySelector('.hero-image');
    const heroName = document.querySelector('.hero-name');
    const introText = document.querySelector('.intro-text');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class to header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
        }

        if (heroName && introText) {
            if (scrollY > 50) {
                heroName.style.opacity = 1 - (scrollY - 50) / 300;
                introText.style.opacity = 1 - (scrollY - 50) / 300;
            } else {
                heroName.style.opacity = 1;
                introText.style.opacity = 1;
            }
        }
    });

    // Check initial scroll position
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
}

// ✨ Locked Project Scroll (Only exits after trying to scroll past the edge)
// Replace your existing initLockedProjectScroll function with this one
function initLockedProjectScroll() {
    const projectCards = document.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.indicator');
    const projectsSection = document.querySelector('.projects-section');
    const projectButtons = document.querySelectorAll('.project-button');

    if (!projectCards.length || !projectsSection) return;

    // Add a scroll controller element
    const scrollController = document.createElement('div');
    scrollController.className = 'scroll-controller';
    scrollController.style.pointerEvents = 'none';
    document.body.appendChild(scrollController);

    let currentIndex = 0;
    let isProjectsActive = false;
    let isLocked = false;
    let scrollAttempts = 0;
    let lastDirection = null;
    let isProcessingScroll = false;

    // Capture original button click behavior
    projectButtons.forEach(button => {
        // Store the original href
        const href = button.getAttribute('href');

        // Replace with a direct click handler
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (href) {
                window.location.href = href;
            }
            return false;
        });

        // Set important styles directly on the button element
        button.style.zIndex = "1000";
        button.style.position = "relative";
        button.style.pointerEvents = "auto";
        button.style.opacity = "1";
        button.style.cursor = "pointer";
    });

    // Set initial active card
    updateActiveCard(0);

    // Set up scroll event handler
    window.addEventListener('scroll', handleScroll);

    // Set up wheel event handler for projects section
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Indicator click events
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const index = parseInt(indicator.getAttribute('data-index')) - 1;
            updateActiveCard(index);
            // Reset edge scroll attempts
            scrollAttempts = 0;
            lastDirection = null;
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isProjectsActive) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();

                if (currentIndex < projectCards.length - 1) {
                    // Not at last card yet
                    updateActiveCard(currentIndex + 1);
                    scrollAttempts = 0;
                    lastDirection = null;
                } else {
                    // At last card
                    if (lastDirection === 'down') {
                        scrollAttempts++;

                        if (scrollAttempts >= 2) {
                            // After multiple attempts, exit section
                            unlockScroll();
                            // Allow default scroll behavior
                            setTimeout(() => {
                                window.scrollTo({
                                    top: projectsSection.offsetTop + projectsSection.offsetHeight,
                                    behavior: 'smooth'
                                });
                            }, 50);
                        }
                    } else {
                        lastDirection = 'down';
                        scrollAttempts = 1;
                    }
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();

                if (currentIndex > 0) {
                    // Not at first card yet
                    updateActiveCard(currentIndex - 1);
                    scrollAttempts = 0;
                    lastDirection = null;
                } else {
                    // At first card
                    if (lastDirection === 'up') {
                        scrollAttempts++;

                        if (scrollAttempts >= 2) {
                            // After multiple attempts, exit section
                            unlockScroll();
                            // Allow default scroll behavior
                            setTimeout(() => {
                                window.scrollTo({
                                    top: projectsSection.offsetTop - window.innerHeight,
                                    behavior: 'smooth'
                                });
                            }, 50);
                        }
                    } else {
                        lastDirection = 'up';
                        scrollAttempts = 1;
                    }
                }
            }
        }
    });

    // Handle touch gestures
    let touchStartY = 0;

    projectsSection.addEventListener('touchstart', (e) => {
        // Skip if the touch is on a button
        if (e.target.closest('.project-button')) {
            return;
        }

        if (isProjectsActive) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    projectsSection.addEventListener('touchmove', (e) => {
        // Skip if the touch is on a button
        if (e.target.closest('.project-button')) {
            return;
        }

        if (!isProjectsActive || isProcessingScroll) return;

        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        const direction = diff > 0 ? 'down' : 'up';

        // Determine if we should prevent default scrolling
        const preventScroll = (direction === 'down' && currentIndex < projectCards.length - 1) ||
            (direction === 'up' && currentIndex > 0) ||
            (scrollAttempts < 2);

        if (preventScroll) {
            e.preventDefault();
        }
    }, { passive: false });

    projectsSection.addEventListener('touchend', (e) => {
        // Skip if the touch is on a button
        if (e.target.closest('.project-button')) {
            return;
        }

        if (!isProjectsActive || isProcessingScroll) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        // Only process significant movements
        if (Math.abs(diff) > 50) {
            const direction = diff > 0 ? 'down' : 'up';

            if (direction === 'down') {
                if (currentIndex < projectCards.length - 1) {
                    // Not at last card yet
                    updateActiveCard(currentIndex + 1);
                    scrollAttempts = 0;
                    lastDirection = null;
                } else {
                    // At last card
                    if (lastDirection === 'down') {
                        scrollAttempts++;

                        if (scrollAttempts >= 2) {
                            // After multiple attempts, exit section
                            unlockScroll();
                        }
                    } else {
                        lastDirection = 'down';
                        scrollAttempts = 1;
                    }
                }
            } else {
                if (currentIndex > 0) {
                    // Not at first card yet
                    updateActiveCard(currentIndex - 1);
                    scrollAttempts = 0;
                    lastDirection = null;
                } else {
                    // At first card
                    if (lastDirection === 'up') {
                        scrollAttempts++;

                        if (scrollAttempts >= 2) {
                            // After multiple attempts, exit section
                            unlockScroll();
                        }
                    } else {
                        lastDirection = 'up';
                        scrollAttempts = 1;
                    }
                }
            }
        }
    }, { passive: true });

    // Handle wheel events when in projects section
    function handleWheel(e) {
        // Skip if the wheel event is on a button
        if (e.target.closest('.project-button')) {
            return;
        }

        if (!isProjectsActive || isProcessingScroll) return;

        const scrollingDown = e.deltaY > 0;

        if (scrollingDown) {
            // Scrolling down
            if (currentIndex < projectCards.length - 1) {
                // Not at last card yet
                e.preventDefault();
                updateActiveCard(currentIndex + 1);
                scrollAttempts = 0;
                lastDirection = null;
            } else {
                // At last card
                if (lastDirection === 'down') {
                    scrollAttempts++;

                    if (scrollAttempts < 2) {
                        // First attempt, prevent scroll
                        e.preventDefault();
                    } else {
                        // Second attempt, unlock and allow scroll
                        unlockScroll();
                    }
                } else {
                    lastDirection = 'down';
                    scrollAttempts = 1;
                    e.preventDefault();
                }
            }
        } else {
            // Scrolling up
            if (currentIndex > 0) {
                // Not at first card yet
                e.preventDefault();
                updateActiveCard(currentIndex - 1);
                scrollAttempts = 0;
                lastDirection = null;
            } else {
                // At first card
                if (lastDirection === 'up') {
                    scrollAttempts++;

                    if (scrollAttempts < 2) {
                        // First attempt, prevent scroll
                        e.preventDefault();
                    } else {
                        // Second attempt, unlock and allow scroll
                        unlockScroll();
                    }
                } else {
                    lastDirection = 'up';
                    scrollAttempts = 1;
                    e.preventDefault();
                }
            }
        }
    }

    // Handle scroll events to determine when to lock/unlock the viewport
    function handleScroll() {
        const projectsRect = projectsSection.getBoundingClientRect();
        const viewportMiddle = window.innerHeight / 2;

        // Check if projects section is in the middle of the viewport
        if (projectsRect.top <= viewportMiddle && projectsRect.bottom >= viewportMiddle) {
            // Entered projects section
            if (!isProjectsActive) {
                enterProjectsSection();
            }
        } else {
            // Exited projects section
            if (isProjectsActive) {
                exitProjectsSection();
            }
        }
    }

    // Enter projects section
    function enterProjectsSection() {
        isProjectsActive = true;
        lockScroll();

        // Reset state tracking
        scrollAttempts = 0;
        lastDirection = null;

        // Make all buttons clickable again
        makeButtonsClickable();
    }

    // Exit projects section
    function exitProjectsSection() {
        isProjectsActive = false;
        unlockScroll();
    }

    // Helper function to ensure buttons remain clickable
    function makeButtonsClickable() {
        projectButtons.forEach(button => {
            button.style.zIndex = "1000";
            button.style.position = "relative";
            button.style.pointerEvents = "auto";
            button.style.opacity = "1";
            button.style.cursor = "pointer";
        });
    }

    // Lock scroll to projects section
    function lockScroll() {
        if (isLocked) return;

        isLocked = true;
        document.body.style.overflow = 'hidden';
        scrollController.style.pointerEvents = 'none';

        // Make buttons clickable
        makeButtonsClickable();

        window.scrollTo({
            top: projectsSection.offsetTop,
            behavior: 'auto'
        });
    }

    // Unlock scroll
    function unlockScroll() {
        if (!isLocked) return;

        isLocked = false;
        document.body.style.overflow = '';
        scrollController.style.pointerEvents = 'none';
    }

    // Update active card
    function updateActiveCard(index) {
        if (isProcessingScroll) return;
        isProcessingScroll = true;

        // Clamp index to valid range
        index = Math.max(0, Math.min(index, projectCards.length - 1));

        // Update current index
        currentIndex = index;

        // Update card classes
        projectCards.forEach((card, i) => {
            // Remove all current position classes
            card.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2');

            // Add appropriate class based on position relative to active card
            if (i === index) {
                card.classList.add('active');
            } else if (i === index - 1) {
                card.classList.add('prev-1');
            } else if (i === index - 2) {
                card.classList.add('prev-2');
            } else if (i === index + 1) {
                card.classList.add('next-1');
            } else if (i === index + 2) {
                card.classList.add('next-2');
            }
        });

        // Update indicator classes
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Make buttons clickable after animation
        setTimeout(() => {
            makeButtonsClickable();
            isProcessingScroll = false;
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // CV button in homepage
    const cvButton = document.querySelector('.cv-button');
    if (cvButton) {
        cvButton.setAttribute('target', '_blank');
        cvButton.setAttribute('rel', 'noopener noreferrer');
    }

    // Live Site Preview buttons in project pages
    const previewButtons = document.querySelectorAll('.preview-button');
    previewButtons.forEach(button => {
        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');
    });

    // Social media links in footer
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.setAttribute('target', '_blank');
        icon.setAttribute('rel', 'noopener noreferrer');
    });
});