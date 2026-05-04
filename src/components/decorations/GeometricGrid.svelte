<script lang="ts">
    /**
     * GeometricGrid: subtelne tło sekcji z animowanymi kropkami w punktach przecięć.
     * Pulsują asymetrycznie, dodają oddech bez kradzieży uwagi z treści.
     * Pozycjonowanie: absolute inset-0 pointer-events-none -z-0 (consumer ustawia parent jako relative).
     */
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';

    interface Props {
        columns?: number;
        rows?: number;
        opacity?: number;
        density?: number; // 0-1, jaki procent skrzyżowań ma kropkę
    }

    let { columns = 12, rows = 8, opacity = 0.05, density = 0.18 }: Props = $props();

    let svgEl: SVGSVGElement | null = $state(null);
    let dotPositions: { cx: number; cy: number; key: string }[] = $derived.by(() => {
        const dots: { cx: number; cy: number; key: string }[] = [];
        // Deterministyczna asymetria (seed-based) — zawsze ten sam wzór, brak FOUC migotania.
        const seed = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

        for (let r = 1; r < rows; r++) {
            for (let c = 1; c < columns; c++) {
                const idx = r * columns + c;
                if (seed(idx) < density) {
                    dots.push({
                        cx: (c / columns) * 100,
                        cy: (r / rows) * 100,
                        key: `${r}-${c}`
                    });
                }
            }
        }
        return dots;
    });

    onMount(() => {
        if (!svgEl) return;
        // Respect prefers-reduced-motion
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const dots = svgEl.querySelectorAll('circle');
        gsap.to(dots, {
            opacity: 0.9,
            duration: 2.4,
            ease: 'sine.inOut',
            stagger: { each: 0.15, from: 'random' },
            yoyo: true,
            repeat: -1
        });
    });
</script>

<svg
    bind:this={svgEl}
    class="absolute inset-0 w-full h-full pointer-events-none -z-0"
    style="opacity: {opacity};"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
>
    <!-- Lekka siatka linii pionowych i poziomych -->
    <g stroke="rgba(255, 255, 255, 0.5)" stroke-width="0.05" fill="none">
        {#each Array(columns - 1) as _, i}
            <line x1={((i + 1) / columns) * 100} y1="0" x2={((i + 1) / columns) * 100} y2="100" />
        {/each}
        {#each Array(rows - 1) as _, i}
            <line x1="0" y1={((i + 1) / rows) * 100} x2="100" y2={((i + 1) / rows) * 100} />
        {/each}
    </g>

    <!-- Mosiężne kropki w wybranych punktach przecięć -->
    <g fill="var(--color-brass, #C5A059)">
        {#each dotPositions as dot (dot.key)}
            <circle cx={dot.cx} cy={dot.cy} r="0.35" opacity="0.4" />
        {/each}
    </g>
</svg>
