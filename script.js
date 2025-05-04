document.addEventListener('DOMContentLoaded', () => {
    initCursorEffects();
    createParticleSystem();
    addScrollEffects();
    setupMenuToggle();
    playOpeningAnimation();

    // Simple fix for project buttons
    fixProjectButtons();

    // Add the project card scroll functionality
    initLockedProjectScroll();
});

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

    setTimeout(() => {
        overlayTop.style.transform = 'scaleY(0)';
        overlayBottom.style.transform = 'scaleY(0)';
    }, 800);

    setTimeout(() => {
        document.querySelector('.overlay').style.display = 'none';
    }, 2000);
}

// ✨ Hamburger Menu Toggle
function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') ? '✖' : '+';
    });
}

// ✨ Custom Cursor
function initCursorEffects() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

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

// ✨ Particle System
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
    const hue = 0;
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 30) + 60;
    const alpha = Math.random() * 0.3 + 0.1;

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

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
        }
        if (scrollY > 50) {
            heroName.style.opacity = 1 - (scrollY - 50) / 300;
            introText.style.opacity = 1 - (scrollY - 50) / 300;
        } else {
            heroName.style.opacity = 1;
            introText.style.opacity = 1;
        }
    });
}

// ✨ Locked Project Scroll (Only exits after trying to scroll past the edge)
function initLockedProjectScroll() {
    const projectCards = document.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.indicator');
    const projectsSection = document.querySelector('.projects-section');

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
        // Don't handle touch events on buttons
        if (e.target.closest('.project-button')) {
            return;
        }

        if (isProjectsActive) {
            touchStartY = e.touches[0].clientY;
        }
    });

    projectsSection.addEventListener('touchmove', (e) => {
        if (!isProjectsActive || isProcessingScroll) return;

        // Don't prevent default if touching a button
        if (e.target.closest('.project-button')) {
            return;
        }

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
        if (!isProjectsActive || isProcessingScroll) return;

        // Don't process touch events on buttons
        if (e.target.closest('.project-button')) {
            return;
        }

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
    });

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

    // Handle wheel events when in projects section
    function handleWheel(e) {
        if (!isProjectsActive || isProcessingScroll) return;

        // Don't prevent scrolling if hovering over a button
        if (e.target.closest('.project-button')) {
            return;
        }

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

    // Enter projects section
    function enterProjectsSection() {
        isProjectsActive = true;
        lockScroll();

        // Reset state tracking
        scrollAttempts = 0;
        lastDirection = null;
    }

    // Exit projects section
    function exitProjectsSection() {
        isProjectsActive = false;
        unlockScroll();
    }

    // Lock scroll to projects section
    function lockScroll() {
        if (isLocked) return;

        isLocked = true;
        document.body.style.overflow = 'hidden';
        scrollController.style.pointerEvents = 'auto';

        // Make sure project buttons are clickable
        const projectButtons = document.querySelectorAll('.project-button');
        projectButtons.forEach(button => {
            button.style.zIndex = '1000';
            button.style.position = 'relative';
            button.style.pointerEvents = 'auto';
        });

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

        // Re-enable scroll processing after animation completes
        setTimeout(() => {
            isProcessingScroll = false;
        }, 400);
    }
}