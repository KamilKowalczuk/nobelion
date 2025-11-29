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

<div bind:this={element} class="flex flex-col items-center justify-center py-8">
    <div class="flex items-baseline font-mono font-bold text-brass tracking-tighter">
        {#if prefix}
            <span class="text-2xl md:text-4xl mr-2 opacity-60">{prefix}</span>
        {/if}
        
        <span class="text-6xl md:text-8xl tabular-nums">
            {Math.floor($count)}
        </span>
        
        {#if suffix}
            <span class="text-3xl md:text-5xl ml-1 text-brass/80">{suffix}</span>
        {/if}
    </div>
    
    <div class="mt-4 h-[px] w-12 bg-steel/30"></div>
    
    <p class="mt-4 text-sm md:text-base font-sans text-steel tracking-[0.2em] uppercase">
        {label}
    </p>
</div>