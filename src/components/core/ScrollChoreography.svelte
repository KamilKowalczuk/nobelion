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
        if (reduced) {
            // If reduced motion is preferred, add .in to all reveals immediately
            document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // === 1. All [data-reveal] elements: trigger .in class on scroll ===
        const reveals = document.querySelectorAll('[data-reveal]');
        reveals.forEach((el) => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    el.classList.add('in');
                }
            });
        });

        // === 2. Parallax na dekoracjach z data-parallax ===
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
