/* ═══════════════════════════════════════════════════
   WANDERER'S CHRONICLE — CINEMATIC ANIMATIONS
   GSAP + ScrollTrigger Powered
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ═══════════════════════════════════════════
    // DUST PARTICLES
    // ═══════════════════════════════════════════
    const dustContainer = document.getElementById('dustContainer');
    for (let i = 0; i < 40; i++) {
        const dust = document.createElement('div');
        dust.classList.add('dust');
        dust.style.left = Math.random() * 100 + '%';
        dust.style.top = Math.random() * 100 + '%';
        dust.style.width = (Math.random() * 3 + 1) + 'px';
        dust.style.height = dust.style.width;
        dust.style.animationDelay = (Math.random() * 6) + 's';
        dust.style.animationDuration = (Math.random() * 4 + 4) + 's';
        dustContainer.appendChild(dust);
    }

    // ═══════════════════════════════════════════
    // BOOK ANIMATION TIMELINE
    // ═══════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    const mainWebsite = document.getElementById('mainWebsite');
    const book = document.getElementById('book');
    const bookCover = document.getElementById('bookCover');
    const clickPrompt = document.getElementById('clickPrompt');
    const skipBtn = document.getElementById('skipIntro');

    let bookOpened = false;

    const bookTL = gsap.timeline({ paused: true });

    // Build the book animation timeline
    bookTL
        // Fade out click prompt
        .to(clickPrompt, { opacity: 0, duration: 0.3 })
        // Scale up book slightly
        .to(book, { scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        // Open the cover (3D flip)
        .to(bookCover, { rotateY: -180, duration: 1.4, ease: 'power2.inOut' }, 0.4)
        // Flip page 1
        .to('#page1', { rotateY: -180, duration: 0.9, ease: 'power2.inOut' }, 1.6)
        // Flip page 2
        .to('#page2', { rotateY: -180, duration: 0.9, ease: 'power2.inOut' }, 2.3)
        // Flip page 3
        .to('#page3', { rotateY: -180, duration: 0.9, ease: 'power2.inOut' }, 3.0)
        // Flip page 4
        .to('#page4', { rotateY: -180, duration: 0.9, ease: 'power2.inOut' }, 3.7)
        // Flip page 5 (end page)
        .to('#page5', { rotateY: -180, duration: 1.0, ease: 'power2.inOut' }, 4.4)
        // Book zooms in and fades — transition to website
        .to(book, {
            scale: 4, opacity: 0, duration: 1.2,
            ease: 'power3.in',
            delay: 0.2
        }, 5.2)
        // Fade preloader
        .to(preloader, {
            opacity: 0, duration: 0.6,
            onComplete: () => {
                preloader.style.display = 'none';
                revealWebsite();
            }
        }, 6.0);

    // Click book to start animation
    book.addEventListener('click', () => {
        if (bookOpened) return;
        bookOpened = true;
        bookTL.play();
    });

    // Skip intro
    skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bookOpened) return;
        bookOpened = true;
        gsap.to(preloader, {
            opacity: 0, duration: 0.5,
            onComplete: () => {
                preloader.style.display = 'none';
                revealWebsite();
            }
        });
    });

    // ═══════════════════════════════════════════
    // REVEAL MAIN WEBSITE
    // ═══════════════════════════════════════════
    function revealWebsite() {
        mainWebsite.classList.add('visible');

        // Hero entrance animations
        const heroTL = gsap.timeline();

        heroTL
            .from('.hero-bg-img', { scale: 1.3, duration: 2, ease: 'power2.out' }, 0)
            // Letter-by-letter animation for "Adventure Awaits"
            .to('.hero-title .letter', {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: 'back.out(1.4)'
            }, 0.8)
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.8)
            .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 2.2)
            .to('#scrollHint', { opacity: 1, duration: 0.8 }, 2.6);

        // Initialize scroll animations after reveal
        setTimeout(initScrollAnimations, 200);
    }

    // ═══════════════════════════════════════════
    // SCROLL ANIMATIONS
    // ═══════════════════════════════════════════
    function initScrollAnimations() {

        // ── Nav scroll effect ──
        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                document.getElementById('mainNav').classList.toggle('scrolled', self.progress > 0);
            }
        });

        // ── Hero parallax ──
        gsap.to('.hero-bg-img', {
            y: -80, scale: 1.15,
            scrollTrigger: {
                trigger: '.hero', start: 'top top', end: 'bottom top',
                scrub: 1.5
            }
        });
        gsap.to('.hero-content', {
            y: -60, opacity: 0.3,
            scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.sun-glow', {
            y: -50, scale: 1.5, opacity: 0,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });

        // ── Section headers ──
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header.children, {
                y: 60, opacity: 0, stagger: 0.15, duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' }
            });
        });

        // ── Postcards entrance ──
        gsap.utils.toArray('.postcard').forEach((card, i) => {
            gsap.from(card, {
                y: 80, opacity: 0, rotateX: 15, duration: 0.9,
                delay: i * 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
            });
        });

        // ── About section ──
        gsap.from('.journal-page', {
            x: -80, opacity: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
        gsap.from('.img1', {
            x: 80, opacity: 0, rotation: 8, duration: 1, delay: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
        gsap.from('.img2', {
            x: 60, y: 40, opacity: 0, rotation: -8, duration: 1, delay: 0.4, ease: 'power3.out',
            scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: 'play none none reverse' }
        });

        // ── Map flight paths ──
        ScrollTrigger.create({
            trigger: '.explore',
            start: 'top 60%',
            onEnter: () => {
                document.querySelectorAll('.flight-path').forEach((path, i) => {
                    const length = path.getTotalLength();
                    path.style.strokeDasharray = length;
                    path.style.strokeDashoffset = length;
                    gsap.to(path, { strokeDashoffset: 0, duration: 2, delay: i * 0.4, ease: 'power2.out' });
                });
            },
            once: true
        });

        // ── Map pins bounce in ──
        gsap.utils.toArray('.map-pin').forEach((pin, i) => {
            gsap.from(pin, {
                scale: 0, opacity: 0, duration: 0.6, delay: i * 0.2,
                ease: 'back.out(1.7)',
                scrollTrigger: { trigger: '.map-container', start: 'top 70%', toggleActions: 'play none none reverse' }
            });
        });

        // ── Testimonial notes ──
        gsap.utils.toArray('.note').forEach((note, i) => {
            gsap.from(note, {
                y: 60, opacity: 0, rotation: (i % 2 === 0 ? -5 : 5), duration: 0.9,
                delay: i * 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: note, start: 'top 85%', toggleActions: 'play none none reverse' }
            });
        });

        // ── Package cards ──
        gsap.utils.toArray('.pkg-card').forEach((card, i) => {
            gsap.from(card, {
                y: 70, opacity: 0, duration: 0.8, delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
            });
        });

        // ── Gallery masonry items ──
        gsap.utils.toArray('.masonry-item').forEach((item, i) => {
            gsap.from(item, {
                y: 50, opacity: 0, scale: 0.95, duration: 0.7,
                delay: i * 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none reverse' }
            });
        });

        // ── Footer reveal ──
        gsap.from('.footer-inner', {
            y: 40, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.site-footer', start: 'top 85%', toggleActions: 'play none none reverse' }
        });

        // ── Airplane flight on scroll ──
        const airplane = document.getElementById('airplane');
        gsap.set(airplane, { opacity: 0.5 });
        gsap.to(airplane, {
            x: window.innerWidth + 100,
            y: window.innerHeight * 0.4,
            rotation: 35,
            scrollTrigger: {
                trigger: '.destinations',
                start: 'top center',
                end: 'bottom center',
                scrub: 2,
                onEnter: () => gsap.set(airplane, { opacity: 0.5 }),
                onLeave: () => gsap.set(airplane, { opacity: 0 })
            }
        });
    }

    // ═══════════════════════════════════════════
    // POSTCARD 3D TILT EFFECT
    // ═══════════════════════════════════════════
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => card.style.transition = '', 500);
        });
    });

    // ═══════════════════════════════════════════
    // GALLERY LIGHTBOX
    // ═══════════════════════════════════════════
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            gsap.from(lightboxImg, { scale: 0.8, opacity: 0, duration: 0.4, ease: 'power3.out' });
        });
    });

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    lightbox.addEventListener('click', closeLightbox);

    function closeLightbox() {
        gsap.to(lightboxImg, {
            scale: 0.8, opacity: 0, duration: 0.3,
            onComplete: () => lightbox.classList.remove('active')
        });
    }

    // Close lightbox on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ═══════════════════════════════════════════
    // SMOOTH SCROLL FOR NAV LINKS
    // ═══════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ═══════════════════════════════════════════
    // MOUSE PARALLAX ON HERO (Subtle depth)
    // ═══════════════════════════════════════════
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2;
            const y = (clientY / window.innerHeight - 0.5) * 2;
            gsap.to('.sun-glow', { x: x * -10, y: y * -5, duration: 1.5, ease: 'power2.out' });
        });
    }

    // ═══════════════════════════════════════════
    // SECTION ZOOM EFFECT ON SCROLL
    // ═══════════════════════════════════════════
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            scale: 0.97, opacity: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                end: 'top 50%',
                scrub: 1
            }
        });
    });

    // ═══════════════════════════════════════════
    // SPARKLE CURSOR TRAIL
    // ═══════════════════════════════════════════
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;overflow:hidden;';
    document.body.appendChild(sparkleContainer);

    let sparkleThrottle = 0;
    const sparkleShapes = ['✦', '✧', '✵', '⋆', '✶', '°'];
    const sparkleColors = ['#c9a55a', '#e8d5a3', '#fff8e7', '#f0d078', '#d4a843'];

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - sparkleThrottle < 50) return; // limit rate
        sparkleThrottle = now;

        const sparkle = document.createElement('span');
        const size = Math.random() * 14 + 8;
        const shape = sparkleShapes[Math.floor(Math.random() * sparkleShapes.length)];
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        const drift = (Math.random() - 0.5) * 60;

        sparkle.textContent = shape;
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: ${size}px;
            color: ${color};
            pointer-events: none;
            z-index: 9997;
            text-shadow: 0 0 6px ${color};
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            transition: none;
        `;
        sparkleContainer.appendChild(sparkle);

        gsap.to(sparkle, {
            y: -(Math.random() * 60 + 30),
            x: drift,
            opacity: 0,
            scale: 0,
            rotation: Math.random() * 180 - 90,
            duration: Math.random() * 0.6 + 0.5,
            ease: 'power2.out',
            onComplete: () => sparkle.remove()
        });
    });
});
