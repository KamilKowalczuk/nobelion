<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { legalContent } from '../../data/legal';

    // Definiujemy typ kluczy, żeby TS nie krzyczał
    type DocType = 'privacy' | 'terms' | 'rodo';

    let activeDoc = $state<DocType | null>(null);

    function close() {
        activeDoc = null;
        document.body.style.overflow = ''; // Odblokuj scroll strony
    }

    function open(type: DocType) {
        activeDoc = type;
        document.body.style.overflow = 'hidden'; // Zablokuj scroll strony
    }

    // Obsługa klawisza ESC do zamykania
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && activeDoc) {
            close();
        }
    }

    onMount(() => {
        const triggers = {
            'open-privacy': 'privacy',
            'open-terms': 'terms',
            'open-rodo': 'rodo'
        };

        Object.entries(triggers).forEach(([id, type]) => {
            const el = document.getElementById(id);
            if (el) {
                // Rzutowanie typu dla bezpieczeństwa
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    open(type as DocType);
                });
            }
        });
    });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if activeDoc}
    <div 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
        transition:fade={{ duration: 300 }}
        role="dialog"
        aria-modal="true"
    >
        <div 
            class="absolute inset-0 bg-void/90 backdrop-blur-xl cursor-pointer"
            onclick={close}
            onkeydown={(e) => { if(e.key === 'Enter' || e.key === ' ') close(); }}
            role="button"
            tabindex="0"
            aria-label="Zamknij modal"
        ></div>

        <div 
            class="relative w-full max-w-4xl h-[85vh] flex flex-col bg-surface border border-white/10 shadow-2xl overflow-hidden pointer-events-auto"
            transition:fly={{ y: 50, duration: 400, opacity: 0 }}
        >
            <div class="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 bg-void/50 shrink-0">
                <div>
                    <h2 class="font-heading font-bold text-2xl text-silver tracking-widest uppercase">
                        {legalContent[activeDoc].title}
                    </h2>
                    <p class="font-mono text-[10px] text-brass tracking-widest mt-1">
                        {legalContent[activeDoc].date}
                    </p>
                </div>
                
                <button 
                    onclick={close}
                    class="group w-10 h-10 flex items-center justify-center border border-white/10 hover:border-brass hover:bg-brass/10 transition-all duration-300 interactive cursor-none"
                    aria-label="Zamknij"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="text-steel group-hover:text-white transition-colors">
                        <path d="M1 13L13 1M1 1L13 13" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
            </div>

            <div 
                class="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar overscroll-contain"
                data-lenis-prevent
            >
                <div class="space-y-12">
                    {#each legalContent[activeDoc].sections as section}
                        <div>
                            <h3 class="font-mono text-sm text-brass tracking-widest uppercase mb-6 border-l-2 border-brass/50 pl-4">
                                {section.heading}
                            </h3>
                            
                            <div class="legal-content font-sans text-sm md:text-base text-steel leading-relaxed pl-4 md:pl-0">
                                {@html section.content}
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="mt-24 pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
                    <span class="font-mono text-[10px] uppercase text-silver">NOBELION SP. Z O.O.</span>
                    <div class="w-24 h-[1px] bg-silver"></div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #C5A059;
        border-radius: 0;
    }

    /* --- STYLE DLA TREŚCI PRAWNEJ --- */
    
    /* Pogrubienia na biało */
    :global(.legal-content strong), :global(.legal-content b) {
        color: #E0E0E0; /* Silver */
        font-weight: 700;
    }

    /* Listy punktowane */
    :global(.legal-content ul), :global(.legal-content ol) {
        list-style: none;
        padding-left: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    :global(.legal-content li) {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;
    }

    /* Własny punktator (Złoty kwadrat) */
    :global(.legal-content ul li::before) {
        content: '';
        position: absolute;
        left: 0;
        top: 0.6em; 
        width: 4px;
        height: 4px;
        background-color: #C5A059; 
    }

    /* Punktator dla list numerowanych (opcjonalnie) */
    :global(.legal-content ol) {
        counter-reset: item;
    }
    :global(.legal-content ol li::before) {
        content: counter(item) ".";
        counter-increment: item;
        position: absolute;
        left: 0;
        top: 0;
        color: #C5A059;
        font-family: monospace;
        font-size: 0.8em;
    }

    /* Odstępy między akapitami <p> */
    :global(.legal-content p) {
        margin-bottom: 1rem;
    }
</style>