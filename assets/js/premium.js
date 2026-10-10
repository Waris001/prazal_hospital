(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const topButton = document.querySelector('.floating-top');

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    body.appendChild(progress);

    function updateChrome() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
        if (navbar) navbar.classList.toggle('is-scrolled', y > 24);
        if (topButton) topButton.classList.toggle('is-visible', y > 500);
    }

    updateChrome();
    window.addEventListener('scroll', updateChrome, { passive: true });
    window.addEventListener('resize', updateChrome, { passive: true });

    const hero = document.querySelector('.prazal-hero-text, .contact-hero .container, .care-hero-content');
    if (hero && !reduceMotion) {
        const first = hero.querySelector('h1, .prazal-hero-label, .eyebrow, .care-label');
        if (first) first.classList.add('hero-entrance');
        Array.from(hero.children).filter((el) => el !== first).forEach((el) => el.classList.add('hero-entrance-delay'));
    }

    const revealSelectors = [
        'main section:not(:first-child) .section-heading',
        'main section:not(:first-child) .prazal-home-heading',
        'main section:not(:first-child) .row > [class*="col-"]',
        '.doctor-grid > *',
        '.prazal-treatment-card',
        '.prazal-care-card',
        '.care-card',
        '.service-list-card',
        '.special-clinic',
        '.contact-panel',
        'footer .row > [class*="col-"]'
    ];
    const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(',')));
    const uniqueItems = revealItems.filter((item, index) => revealItems.indexOf(item) === index && !item.closest('.carousel-item'));

    uniqueItems.forEach((item, index) => {
        item.classList.add('reveal-item');
        item.style.setProperty('--reveal-delay', ((index % 4) * 70) + 'ms');
    });

    body.classList.add('motion-ready');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
        uniqueItems.forEach((item) => observer.observe(item));
    } else {
        uniqueItems.forEach((item) => item.classList.add('is-visible'));
    }

    if (!reduceMotion) {
        const parallaxMedia = document.querySelector('.prazal-hero-section .carousel-inner, .gallery-hero-video');
        if (parallaxMedia) {
            window.addEventListener('scroll', () => {
                if (window.scrollY < window.innerHeight) {
                    parallaxMedia.style.transform = 'translate3d(0,' + (window.scrollY * 0.08) + 'px,0) scale(1.04)';
                }
            }, { passive: true });
        }
    }

    document.querySelectorAll('.navbar-collapse .nav-link:not(.dropdown-toggle), .navbar-collapse .dropdown-item').forEach((link) => {
        link.addEventListener('click', () => {
            const menu = document.querySelector('.navbar-collapse.show');
            if (menu && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
    });

    const galleryImages = document.querySelectorAll('#gallery-content figure img');
    if (galleryImages.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Gallery image preview');
        lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image preview"><i class="bi bi-x-lg"></i></button><img alt="">';
        body.appendChild(lightbox);
        const preview = lightbox.querySelector('img');
        const close = lightbox.querySelector('button');
        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            body.style.overflow = '';
        };
        galleryImages.forEach((image) => {
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', 'Open ' + image.alt + ' image');
            const open = () => {
                preview.src = image.currentSrc || image.src;
                preview.alt = image.alt;
                lightbox.classList.add('is-open');
                body.style.overflow = 'hidden';
                close.focus();
            };
            image.addEventListener('click', open);
            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
            });
        });
        close.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
    }
})();
