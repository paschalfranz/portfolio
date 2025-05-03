document.addEventListener('DOMContentLoaded', () => {
    initCursorEffects();
    createParticleSystem();
    addScrollEffects();
    setupMenuToggle();
    playOpeningAnimation();
});

// ✨ Opening Animation
function playOpeningAnimation() {
    const overlayTop = document.querySelector('.overlay-top');
    const overlayBottom = document.querySelector('.overlay-bottom');

    setTimeout(() => {
        overlayTop.style.transform = 'scaleY(0)';
        overlayBottom.style.transform = 'scaleY(0)';
    }, 800);

    // Optional: remove overlay div after animation is finished
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
        if (nav.classList.contains('active')) {
            menuToggle.innerHTML = '✖';
        } else {
            menuToggle.innerHTML = '+';
        }
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

    document.querySelectorAll('a, button, .nav-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursorTrail.style.width = '120px';
            cursorTrail.style.height = '120px';
        });
        element.addEventListener('mouseleave', () => {
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
