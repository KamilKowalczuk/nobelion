<script>
    import { onMount } from 'svelte';
    import Lenis from '@studio-freight/lenis';

    onMount(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Wejście z kotwicą (np. z podstrony przez /#oferta) — przewiń do sekcji.
        // Lenis bywa szybszy niż natywny skok przeglądarki, więc robimy to ręcznie.
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                // offset = wysokość fixed headera (scroll-margin-top: 5rem)
                setTimeout(() => {
                    lenis.scrollTo(target, { offset: -80, duration: reduce ? 0 : 1.2 });
                }, 120);
            }
        }
    });
</script>