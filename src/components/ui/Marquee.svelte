<script>
    const words = ["LOGISTYKA", "KAPITAŁ", "TECHNOLOGIA", "BEZPIECZEŃSTWO", "SKALOWANIE", "EFEKTYWNOŚĆ"];
    const content = [...words, ...words, ...words, ...words];
</script>

<div class="relative w-full overflow-hidden py-6 md:py-12 border-y border-white/10 bg-surface/80 backdrop-blur-md z-20">
    
    <div class="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-void to-transparent z-10"></div>
    <div class="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-void to-transparent z-10"></div>

    <div class="flex whitespace-nowrap animate-marquee items-center">
        <div class="flex items-center gap-12 md:gap-24 pr-12 md:pr-24">
            {#each content as word}
                <div class="flex items-center gap-12 md:gap-24">
                    <span class="text-2xl md:text-6xl font-heading font-bold text-silver/30 tracking-widest">
                        {word}
                    </span>
                    
                    <div class="w-1.5 h-1.5 md:w-2 md:h-2 bg-brass rotate-45 shadow-[0_0_10px_#C5A059]"></div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    
    .animate-marquee {
        animation: marquee 60s linear infinite;
    }
</style>