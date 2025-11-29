<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';

    interface Props {
        text: string;
        class?: string;
    }

    let { text, class: className = "" }: Props = $props();
    
    // Rozbijamy tekst na tablicę liter (uwzględniając spacje)
    const chars = text.split("");
    let container: HTMLElement;

    onMount(() => {
        const letters = container.querySelectorAll('.char');
        
        // Animacja startuje z lekkim opóźnieniem (po rozpoczęciu rysowania logo)
        gsap.fromTo(letters, 
            {
                opacity: 0,
                y: 20,              // Przesunięcie w dół
                filter: "blur(12px)", // Silne rozmycie na start
                scale: 1.1          // Lekkie powiększenie
            },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)", // Wyostrzenie
                scale: 1,
                duration: 2.0,       // Wolno i dostojnie
                stagger: 0.08,       // Każda litera wchodzi ciut później
                ease: "power3.out",  // Hamowanie przy końcu
                delay: 0.8           // Czekamy aż logo zacznie się rysować
            }
        );
    });
</script>

<span bind:this={container} class={`inline-block whitespace-nowrap ${className}`}>
    {#each chars as char, i}
        <span class="char inline-block will-change-transform will-change-opacity">
            {char === " " ? "\u00A0" : char}
        </span>
    {/each}
</span>