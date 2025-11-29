<script lang="ts">
    import { onMount } from 'svelte';

    let progress = $state(0);
    let activeSection = $state("01");
    // ZMIANA: Domyślnie ukryty, pokaże się dopiero po obliczeniach, jeśli nie jesteśmy w Hero
    let isVisible = $state(false); 

    const size = 60;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const trackedIds = ['hero', 'foundation', 'proof', 'divisions', 'vault'];

    onMount(() => {
        const updateTracker = () => {
            const scrollTop = window.scrollY;
            
            // 1. Postęp Globalny
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            progress = Math.min(Math.max(scrollPercent, 0), 1);

            // 2. Wykrywanie Sekcji
            const triggerPoint = scrollTop + (window.innerHeight / 3); 
            let currentId = trackedIds[0];

            for (const id of trackedIds) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const elementTopAbsolute = rect.top + scrollTop;

                    if (triggerPoint >= elementTopAbsolute) {
                        currentId = id;
                    }
                }
            }

            // 3. LOGIKA WIDOCZNOŚCI (STEALTH MODE)
            // Jeśli jesteśmy w 'hero' -> false (ukryj)
            // Jeśli jesteśmy gdziekolwiek indziej -> true (pokaż)
            if (currentId === 'hero') {
                isVisible = false;
            } else {
                isVisible = true;
            }

            // Aktualizacja numerka
            const index = trackedIds.indexOf(currentId);
            activeSection = (index + 1).toString().padStart(2, '0');
        };

        window.addEventListener('scroll', updateTracker);
        updateTracker(); // Init

        return () => window.removeEventListener('scroll', updateTracker);
    });
</script>

<div class={`fixed bottom-6 right-6 z-50 md:hidden transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <div class="relative flex items-center justify-center bg-surface/80 backdrop-blur-md rounded-full shadow-2xl border border-white/10"
         style="width: {size}px; height: {size}px;">
        
        <svg width={size} height={size} class="absolute inset-0 -rotate-90 transform">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                stroke-width={strokeWidth}
                fill="none"
                class="text-white/5"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#C5A059"
                stroke-width={strokeWidth}
                fill="none"
                stroke-dasharray={circumference}
                stroke-dashoffset={circumference - progress * circumference}
                stroke-linecap="round"
                class="transition-all duration-100 ease-linear"
            />
        </svg>

        <div class="flex flex-col items-center justify-center">
            <span class="font-mono text-sm font-bold text-white tracking-widest leading-none mb-2px">
                {activeSection}
            </span>
            <span class="text-[5px] font-mono text-brass uppercase tracking-widest">
                SEKCJA
            </span>
        </div>
    </div>
</div>