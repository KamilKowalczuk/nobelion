<script lang="ts">
    interface Props {
        label: string;
        href?: string;
    }

    let { label, href = "mailto:kontakt@nobelion.pl" }: Props = $props();
</script>

<a 
    {href}
    class="
        group relative inline-flex items-center justify-center 
        px-16 py-5 min-w-[260px] overflow-hidden
        /* Styl bazowy - Ciemne szkło, spójne z Bento */
        bg-surface/30 backdrop-blur-md
        border border-white/10
        focus:outline-none focus:ring-0 interactive cursor-none
        transition-all duration-500 ease-out
        /* Hover: Złota ramka i delikatne uniesienie */
        hover:border-brass/80 hover:bg-surface/50 hover:shadow-[0_0_40px_-10px_rgba(197,160,89,0.15)]
    "
>
    <div 
        class="
            absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700
            bg-[linear-gradient(45deg,transparent_25%,rgba(197,160,89,0.3)_50%,transparent_75%)]
            bg-size[250%_250%] animate-shine
        "
    ></div>

    <span 
        class="
            relative z-10 text-xs font-mono font-bold tracking-[0.25em] uppercase 
            text-brass/90 transition-all duration-300 
            group-hover:text-white group-hover:tracking-[0.35em]
            group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]
        "
    >
        {label}
    </span>

    <span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-brass/40 transition-all duration-300 group-hover:border-brass group-hover:w-4 group-hover:h-4"></span>
    <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brass/40 transition-all duration-300 group-hover:border-brass group-hover:w-4 group-hover:h-4"></span>
</a>

<style>
    @keyframes shine {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
    }
    .animate-shine {
        animation: shine 3s infinite linear;
    }
</style>