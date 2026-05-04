<script lang="ts">
    interface Props {
        title: string;
        description: string;
        colSpan: string;
        icon: string;
    }

    let { title, description, colSpan, icon }: Props = $props();
    
    let mouseX = $state(0);
    let mouseY = $state(0);

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }
</script>

<div 
    class="
        relative group overflow-hidden rounded-none /* Ostry róg = bardziej techniczny */
        border border-white/5 bg-surface/20 backdrop-blur-sm
        transition-colors duration-500
        ${colSpan}
    "
    onmousemove={handleMouseMove}
    role="article"
>
    <div 
        class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style="
            background: radial-gradient(
                600px circle at {mouseX}px {mouseY}px,
                rgba(197, 160, 89, 0.08),
                transparent 40%
            );
        "
    ></div>

    <div 
        class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style="
            background: radial-gradient(
                400px circle at {mouseX}px {mouseY}px,
                rgba(197, 160, 89, 0.4),
                transparent 40%
            );
            mask-image: linear-gradient(black, black), linear-gradient(black, black);
            mask-clip: content-box, border-box;
            mask-composite: exclude;
            padding: 1px; /* Grubość ramki */
        "
    ></div>

    <div class="relative z-20 flex flex-col justify-between h-full p-8 md:p-10">
        <div class="mb-6 text-brass/80 group-hover:text-brass transition-colors duration-500">
            {#if icon === 'diamond'}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>
            {:else if icon === 'lightning'}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            {:else if icon === 'shield'}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {:else if icon === 'crown'} <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            {:else if icon === 'globe'} <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {:else if icon === 'user'} <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {:else}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/></svg>
            {/if}
        </div>

        <div class="space-y-4">
            <h3 class="text-lg font-heading font-bold text-silver tracking-widest uppercase">
                {title}
            </h3>
            <div class="w-8 h-1px bg-white/10 group-hover:w-full group-hover:bg-brass/50 transition-all duration-700"></div>
            <p class="text-sm text-steel/80 font-sans leading-relaxed">
                {description}
            </p>
        </div>
    </div>
</div>