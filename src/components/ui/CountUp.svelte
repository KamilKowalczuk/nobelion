<script lang="ts">
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';

    interface Props {
        value: number;
        label: string;
        prefix?: string;
        suffix?: string;
    }

    let { value, label, prefix = "", suffix = "" }: Props = $props();

    // Fizyka licznika - sztywność i tłumienie dla efektu "ciężkiej maszyny" 
    const count = spring(0, {
        stiffness: 0.05, // Im mniej, tym wolniej startuje/hamuje
        damping: 0.9     // Tłumienie drgań
    });

    let element: HTMLElement;
    let isVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isVisible) {
                isVisible = true;
                // Opóźnienie dla dramaturgii
                setTimeout(() => {
                    count.set(value);
                }, 200);
            }
        }, { threshold: 0.5 }); // Uruchom gdy 50% elementu jest widoczne

        if (element) observer.observe(element);

        return () => observer.disconnect();
    });
</script>

<div bind:this={element} class="flex flex-col items-center justify-center py-8 min-w-0 w-full">
    <div class="flex items-baseline justify-center font-mono font-bold text-brass tracking-tighter whitespace-nowrap max-w-full">
        {#if prefix}
            <span class="text-xl md:text-3xl mr-2 opacity-80">{prefix}</span>
        {/if}

        <span class="text-5xl md:text-6xl lg:text-7xl tabular-nums">
            {Math.floor($count)}
        </span>

        {#if suffix}
            <span class="text-2xl md:text-3xl lg:text-4xl ml-1 text-brass/80">{suffix}</span>
        {/if}
    </div>

    <div class="mt-4 h-px w-12 bg-brass/40"></div>

    <p class="mt-4 text-xs md:text-sm font-sans text-steel tracking-[0.2em] uppercase text-center max-w-[20ch]">
        {label}
    </p>
</div>