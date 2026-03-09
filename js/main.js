/* ====================================================
   VENTSISLAVA.COM — Space Engine
   Star field, scroll animations, parallax nebula
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // STAR FIELD — Animated canvas background
    // ================================================
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.3,
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function maybeSpawnShootingStar() {
        if (Math.random() < 0.003 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 6 + 4,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.alpha * (0.6 + 0.4 * twinkle);
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 225, 255, ${alpha})`;
            ctx.fill();
        });

        // Draw shooting stars
        shootingStars.forEach((ss, i) => {
            const endX = ss.x + Math.cos(ss.angle) * ss.length;
            const endY = ss.y + Math.sin(ss.angle) * ss.length;
            const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
            gradient.addColorStop(0, `rgba(255, 123, 66, ${ss.alpha})`);
            gradient.addColorStop(1, `rgba(255, 123, 66, 0)`);

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.alpha -= ss.decay;

            if (ss.alpha <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
                shootingStars.splice(i, 1);
            }
        });

        maybeSpawnShootingStar();
    }

    function animate(time) {
        drawStars(time);
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    createStars(200);
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars(200);
    });

    // ================================================
    // SCROLL ANIMATIONS — Fade-up on intersection
    // ================================================
    const fadeElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));

    // ================================================
    // NAV SCROLL EFFECT
    // ================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================================================
    // SMOOTH SCROLL for nav links
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const pos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // ================================================
    // MOBILE NAVIGATION
    // ================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // ================================================
    // NEBULA PARALLAX — subtle mouse following
    // ================================================
    // ================================================
    // NEBULA PARALLAX — subtle mouse following
    // ================================================
    document.addEventListener('mousemove', (e) => {
        const clouds = document.querySelectorAll('.nebula-cloud');
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        clouds.forEach((cloud, i) => {
            const factor = (i + 1) * 12;
            cloud.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    // ================================================
    // 3D TILT EFFECT FOR CARDS
    // ================================================
    function initTiltEffect() {
        const cards = document.querySelectorAll('.mission-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', handleTilt);
            card.addEventListener('mouseleave', resetTilt);
        });
    }

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    initTiltEffect();
});
