<script lang="ts">
    import { slide } from 'svelte/transition';
    
    interface Props {
        question: string;
        answer: string;
        isOpen: boolean;
        onToggle: () => void;
    }

    let { question, answer, isOpen, onToggle }: Props = $props();
</script>

<div class="border-b border-white/10">
    <button 
        onclick={onToggle}
        class="w-full py-8 flex items-center justify-between text-left group focus:outline-none interactive cursor-none"
    >
        <div class="flex items-center gap-6">
            <div class={`w-1.5 h-1.5 transition-colors duration-300 ${isOpen ? 'bg-brass shadow-[0_0_8px_#C5A059]' : 'bg-steel/30 group-hover:bg-brass'}`}></div>
            
            <h3 class={`font-heading font-bold text-lg md:text-xl tracking-widest uppercase transition-colors duration-300 ${isOpen ? 'text-white' : 'text-silver/60 group-hover:text-silver'}`}>
                {question}
            </h3>
        </div>

        <div class="relative w-6 h-6 flex items-center justify-center">
            <div class={`absolute w-full h-1px bg-brass transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}></div>
            <div class={`absolute w-full h-1px bg-brass transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-90'}`}></div>
        </div>
    </button>

    {#if isOpen}
        <div transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="pb-8 pl-8 md:pl-10 pr-4 md:pr-24">
                <p class="text-steel font-sans text-sm leading-relaxed max-w-3xl border-l border-brass/20 pl-6">
                    {answer}
                </p>
            </div>
        </div>
    {/if}
</div>