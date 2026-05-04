<script lang="ts">
    /**
     * ScrollChoreography: singleton komponent który po onMount przegląda DOM
     * i dodaje GSAP ScrollTrigger reveals do oznaczonych elementów.
     *
     * Konwencja: każda sekcja ma `<header>` z section label + heading + subheading.
     * Te elementy automatycznie otrzymują stagger reveal przy wjeździe w viewport.
     * Dodatkowo karty/itemy z atrybutem `data-reveal` są ukryte i ujawniane sekwencyjnie.
     *
     * Subtelność: opacity + translateY 1rem, ease-out exp, ~600ms. Bez bounce.
     * Respect prefers-reduced-motion: jeśli włączone, wszystkie elementy są od razu widoczne.
     */
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    onMount(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        gsap.registerPlugin(ScrollTrigger);

        // === 1. Section headers stagger reveal ===
        const sectionHeaders = document.querySelectorAll(
            'section header, footer #vault > div'
        );

        sectionHeaders.forEach((header) => {
            const labels = header.querySelectorAll('span.text-brass.font-mono');
            const headings = header.querySelectorAll('h2, h3');
            const paragraphs = header.querySelectorAll('p');
            const elements = [...labels, ...headings, ...paragraphs];
            if (elements.length === 0) return;

            gsap.set(elements, { opacity: 0, y: 16 });

            ScrollTrigger.create({
                trigger: header,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(elements, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'power3.out',
                        stagger: 0.08
                    });
                }
            });
        });

        // === 2. Karty/itemy z data-reveal stagger ===
        const revealGroups = document.querySelectorAll('[data-reveal-group]');
        revealGroups.forEach((group) => {
            const items = group.querySelectorAll('[data-reveal-item]');
            if (items.length === 0) return;

            gsap.set(items, { opacity: 0, y: 24 });

            ScrollTrigger.create({
                trigger: group,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(items, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                        stagger: 0.06
                    });
                }
            });
        });

        // === 3. Generic single-element reveal (data-reveal) ===
        const singles = document.querySelectorAll('[data-reveal]:not([data-reveal-item])');
        singles.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 20 });
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
                }
            });
        });

        // === 4. Parallax na dekoracjach z data-parallax ===
        const parallaxEls = document.querySelectorAll('[data-parallax]');
        parallaxEls.forEach((el) => {
            const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.3');
            gsap.to(el, {
                yPercent: -10 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<!-- Komponent nie renderuje nic widocznego, tylko montuje GSAP ScrollTrigger. -->
