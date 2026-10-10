(function () {
    'use strict';

    const body = document.body;
    const hero = document.getElementById('prazal-home-hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    body.classList.add('home-cinematic');

    function createLoader() {
        const loader = document.querySelector('.home-intro-loader');
        if (!loader) {
            document.documentElement.classList.remove('home-loader-pending');
            body.classList.remove('home-loading');
            return;
        }
        if (reduceMotion) {
            loader.remove();
            document.documentElement.classList.remove('home-loader-pending');
            body.classList.remove('home-loading');
            return;
        }
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            loader.classList.add('is-complete');
            document.documentElement.classList.remove('home-loader-pending');
            body.classList.remove('home-loading');
            window.setTimeout(() => loader.remove(), 750);
        };
        window.addEventListener('load', () => window.setTimeout(finish, 1000), { once: true });
        window.setTimeout(finish, 2600);
    }

    function buildHeroAtmosphere() {
        const layer = document.createElement('div');
        layer.className = 'home-ambient-layer';
        layer.setAttribute('aria-hidden', 'true');
        layer.innerHTML = '<div class="home-orbit"></div>';
        for (let index = 0; index < 9; index += 1) {
            const particle = document.createElement('span');
            particle.className = 'home-particle';
            particle.style.left = (8 + ((index * 13) % 84)) + '%';
            particle.style.top = (12 + ((index * 19) % 70)) + '%';
            particle.style.setProperty('--particle-size', (13 + (index % 4) * 5) + 'px');
            particle.style.setProperty('--particle-duration', (4.5 + (index % 3) * 1.4) + 's');
            particle.style.setProperty('--particle-delay', (-index * .7) + 's');
            layer.appendChild(particle);
        }
        hero.appendChild(layer);

        const vitals = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        vitals.setAttribute('class', 'home-vitals');
        vitals.setAttribute('viewBox', '0 0 520 70');
        vitals.setAttribute('aria-hidden', 'true');
        vitals.innerHTML = '<path d="M0 39h120l18-12 18 26 24-48 26 61 24-27h290"/>';
        hero.appendChild(vitals);
    }

    function splitHeroHeadings() {
        hero.querySelectorAll('.prazal-hero-text h1').forEach((heading) => {
            const words = heading.textContent.trim().split(/\s+/);
            heading.textContent = '';
            words.forEach((word, index) => {
                const shell = document.createElement('span');
                shell.className = 'cinematic-word';
                const inner = document.createElement('span');
                inner.textContent = word;
                inner.style.setProperty('--word-index', index);
                shell.appendChild(inner);
                heading.appendChild(shell);
                heading.appendChild(document.createTextNode(' '));
            });
        });
    }

    function addServiceMarquee() {
        const services = [
            ['bi-lightning-charge-fill', '24/7 Emergency'],
            ['bi-heart-pulse-fill', 'Heart & Cardiac Care'],
            ['bi-hospital-fill', 'ICU & Critical Care'],
            ['bi-bandaid-fill', 'Surgical Care'],
            ['bi-gender-female', 'Maternity Care'],
            ['bi-activity', 'Diagnostics'],
            ['bi-capsule', 'Medical Store']
        ];
        const marquee = document.createElement('div');
        marquee.className = 'home-service-marquee';
        marquee.setAttribute('aria-label', 'Hospital services');
        const track = document.createElement('div');
        track.className = 'home-service-track';
        services.concat(services).forEach(([icon, label]) => {
            const item = document.createElement('span');
            item.className = 'home-service-item';
            item.innerHTML = '<i class="bi ' + icon + '"></i>' + label;
            track.appendChild(item);
        });
        marquee.appendChild(track);
        hero.insertAdjacentElement('afterend', marquee);
    }

    function setupScenes() {
        const definitions = [
            ['prazal-home-intro', 'About'],
            ['prazal-home-care', 'Our care'],
            ['prazal-home-treatment', 'Treatment'],
            ['prazal-home-why', 'Why Prazal'],
            ['prazal-home-specialist', 'Specialists'],
            ['prazal-home-reviews', 'Reviews'],
            ['prazal-home-cta', 'Visit']
        ];
        const scenes = definitions.map(([id]) => document.getElementById(id)).filter(Boolean);
        scenes.forEach((scene) => {
            scene.classList.add('home-scene');
            const candidates = scene.querySelectorAll('.prazal-home-heading, .prazal-intro-image-wrap, .prazal-intro-title, .prazal-intro-text, .prazal-care-card, .prazal-treatment-card, .prazal-why-card, .prazal-specialist-box, .prazal-google-rating, .prazal-review-card, .prazal-cta-content');
            candidates.forEach((item, index) => {
                item.classList.add('scene-reveal');
                item.style.setProperty('--scene-delay', ((index % 5) * 80) + 'ms');
            });
        });

        if (reduceMotion || !('IntersectionObserver' in window)) {
            scenes.forEach((scene) => scene.classList.add('scene-active'));
        } else {
            const sceneObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('scene-active');
                });
            }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });
            scenes.forEach((scene) => sceneObserver.observe(scene));
        }

        if (window.innerWidth > 991) {
            const rail = document.createElement('nav');
            rail.className = 'home-scene-rail';
            rail.setAttribute('aria-label', 'Homepage sections');
            definitions.forEach(([id, label]) => {
                if (!document.getElementById(id)) return;
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'home-scene-dot';
                button.setAttribute('aria-label', label);
                button.dataset.target = id;
                button.addEventListener('click', () => document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }));
                rail.appendChild(button);
            });
            body.appendChild(rail);

            const updateRail = () => {
                rail.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * .65);
                let current = scenes[0];
                scenes.forEach((scene) => { if (scene.getBoundingClientRect().top < window.innerHeight * .48) current = scene; });
                rail.querySelectorAll('.home-scene-dot').forEach((dot) => dot.classList.toggle('is-current', dot.dataset.target === current.id));
            };
            updateRail();
            window.addEventListener('scroll', updateRail, { passive: true });
        }
    }

    function setupTilt() {
        if (!finePointer || reduceMotion) return;
        const cards = document.querySelectorAll('#prazal-home-care .prazal-care-card, #prazal-home-treatment .prazal-treatment-card, #prazal-home-reviews .prazal-review-card');
        cards.forEach((card) => {
            card.classList.add('home-tilt');
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.classList.remove('is-resting');
                card.style.setProperty('--tilt-x', (x * 100) + '%');
                card.style.setProperty('--tilt-y', (y * 100) + '%');
                card.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 7) + 'deg) rotateY(' + ((x - .5) * 8) + 'deg) translateY(-7px)';
            });
            card.addEventListener('pointerleave', () => {
                card.classList.add('is-resting');
                card.style.transform = '';
            });
        });

        document.querySelectorAll('#prazal-home-hero .btn, #prazal-home-cta .btn').forEach((button) => {
            button.classList.add('home-magnetic');
            button.addEventListener('pointermove', (event) => {
                const rect = button.getBoundingClientRect();
                button.style.transform = 'translate(' + ((event.clientX - rect.left - rect.width / 2) * .12) + 'px,' + ((event.clientY - rect.top - rect.height / 2) * .18) + 'px)';
            });
            button.addEventListener('pointerleave', () => { button.style.transform = ''; });
        });
    }

    function setupPointerDepth() {
        if (!finePointer || reduceMotion) return;
        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            body.style.setProperty('--home-pointer-x', x + '%');
            body.style.setProperty('--home-pointer-y', y + '%');
            const activeText = hero.querySelector('.carousel-item.active .prazal-hero-text');
            if (activeText) activeText.style.transform = 'translate3d(' + ((x - 50) * -.035) + 'px,' + ((y - 50) * -.025) + 'px,0)';
        });
        hero.addEventListener('pointerleave', () => {
            const activeText = hero.querySelector('.carousel-item.active .prazal-hero-text');
            if (activeText) activeText.style.transform = '';
        });
    }

    function setupCountUp() {
        const number = document.querySelector('.prazal-rating-number');
        if (!number || reduceMotion || !('IntersectionObserver' in window)) return;
        const target = parseFloat(number.textContent);
        const observer = new IntersectionObserver((entries, currentObserver) => {
            if (!entries[0].isIntersecting) return;
            const started = performance.now();
            const animate = (now) => {
                const progress = Math.min(1, (now - started) / 1000);
                number.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(1);
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            currentObserver.disconnect();
        }, { threshold: .7 });
        observer.observe(number);
    }

    createLoader();
    buildHeroAtmosphere();
    splitHeroHeadings();
    addServiceMarquee();
    setupScenes();
    setupTilt();
    setupPointerDepth();
    setupCountUp();
})();
