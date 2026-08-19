// ---------------------------------------------------------------------------
// Environment checks — the custom cursor and ambient effects only make sense on
// a device with a real (mouse) pointer and where the user hasn't asked for
// reduced motion. On touch screens they'd just get in the way.
// ---------------------------------------------------------------------------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const enableEffects = hasFinePointer && !prefersReducedMotion;

// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ---------------------------------------------------------------------------
// Smooth scrolling for same-page anchor links
// ---------------------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
});

// ---------------------------------------------------------------------------
// Hide navbar on scroll down, reveal on scroll up
// ---------------------------------------------------------------------------
const navbar = document.getElementById('navbar');
if (navbar) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const current = window.scrollY;
                if (current > lastScrollY && current > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                lastScrollY = current;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ---------------------------------------------------------------------------
// Custom cursor
// ---------------------------------------------------------------------------
if (enableEffects) {
    document.body.classList.add('cursor-enabled');

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    let cursorX = 0;
    let cursorY = 0;
    let rafId = null;

    const renderCursor = () => {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        rafId = null;
    };

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (rafId === null) {
            rafId = window.requestAnimationFrame(renderCursor);
        }
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hover'));

    // Grow the cursor only while over interactive elements (event delegation).
    const interactiveSelector = 'a, button, .social-link, .selfie, li.skill, .project-card, .project-links a';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            cursor.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            cursor.classList.remove('hover');
        }
    });

    // -----------------------------------------------------------------------
    // Ambient "matrix" light streaks aligned to the background grid
    // -----------------------------------------------------------------------
    function createMatrixStreak() {
        if (document.hidden) return; // don't animate an unfocused tab
        const streak = document.createElement('div');
        streak.className = 'matrix-streak';

        const isVertical = Math.random() > 0.5;
        if (isVertical) {
            streak.classList.add('vertical');
            const gridPosition = Math.floor(Math.random() * Math.ceil(window.innerWidth / 50)) * 50;
            streak.style.left = gridPosition + 'px';
            streak.style.top = '-100px';
        } else {
            const gridPosition = Math.floor(Math.random() * Math.ceil(window.innerHeight / 50)) * 50;
            streak.style.top = gridPosition + 'px';
            streak.style.left = '-100px';
        }

        const duration = 2 + Math.random() * 3;
        streak.style.animationDuration = duration + 's';
        document.body.appendChild(streak);

        streak.addEventListener('animationend', () => streak.remove());
    }

    // Spawn a streak on a relaxed cadence — light enough to stay smooth.
    setInterval(createMatrixStreak, 600 + Math.random() * 400);

    // -----------------------------------------------------------------------
    // Click ripple on empty background
    // -----------------------------------------------------------------------
    function createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    document.addEventListener('click', (e) => {
        const isUIElement = e.target.closest(
            'a, button, .social-link, .selfie, li.skill, .project-card, .exp, .education, .me, #welcome-section, #navbar'
        );
        if (!isUIElement) {
            createRipple(e);
        }
    });
}

// ---------------------------------------------------------------------------
// Reveal-on-scroll for sections and project cards
// ---------------------------------------------------------------------------
const revealTargets = document.querySelectorAll('section, .project-card');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('fade-in'));
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealTargets.forEach((el) => {
        el.classList.add('hidden');
        observer.observe(el);
    });
}
