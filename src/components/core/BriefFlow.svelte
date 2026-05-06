<script lang="ts">
    /**
     * BriefFlow — 7-krokowy flow zgłoszeniowy. Centerpiece strony.
     *
     * Założenia projektowe:
     * - Editorial split: lewa kolumna kontekst i edukacja, prawa kolumna input.
     * - Mobile: kolumny stack pionowo.
     * - Walidacja per-krok, przycisk DALEJ disabled jeśli nie spełniono kryteriów.
     * - Endpoint /api/brief jeszcze nie istnieje, fetch jest defensywny (success state również po błędzie sieciowym, ale loguje).
     * - Brak zewnętrznych bibliotek poza GSAP (już w projekcie).
     */
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';

    type Diagnosis = 'biuro' | 'strona' | 'sprzedaz' | 'wizja' | null;

    let currentStep = $state(1);
    const totalSteps = 7;

    let formData = $state({
        diagnosis: null as Diagnosis,
        industry: '',
        size: '',
        tools: '',
        problem: '',
        helperOpen: false,
        helperAnswers: {
            frequency: '',
            people: '',
            time: '',
            tools: '',
            tried: ''
        },
        attachments: [] as string[],
        hoursWeek: 5,
        peopleInvolved: '',
        growsWithScale: '',
        triedBefore: [] as string[],
        triedNotes: '',
        urgency: '',
        scope: '',
        budget: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        nip: '',
        agreedPrivacy: false,
        agreedTerms: false,
        honeypot: ''
    });

    let isSubmitting = $state(false);
    let submitState = $state<'idle' | 'success' | 'error'>('idle');
    let viewport: HTMLElement | null = $state(null);
    let placeholderIndex = $state(0);

    const placeholders = [
        'Mój zespół codziennie kopiuje dane z maila do Excela, zajmuje to 2 godziny dziennie...',
        'Klienci pytają o cennik mailowo, odpisuję ręcznie, czasem 30 maili dziennie...',
        'Mam listę 5000 firm i chciałbym żeby coś automatycznie wysyłało spersonalizowane maile...'
    ];

    onMount(() => {
        const interval = setInterval(() => {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }, 4500);
        return () => clearInterval(interval);
    });

    // Wyliczenia pomocnicze
    const annualCost = $derived(
        formData.hoursWeek > 0 && formData.peopleInvolved
            ? Math.round(formData.hoursWeek * peopleMultiplier(formData.peopleInvolved) * 100 * 52)
            : 0
    );

    function peopleMultiplier(value: string): number {
        switch (value) {
            case '1': return 1;
            case '2-3': return 2.5;
            case '4-10': return 7;
            case '10+': return 15;
            default: return 0;
        }
    }

    function formatPLN(value: number): string {
        return new Intl.NumberFormat('pl-PL').format(value);
    }

    // Walidacja per krok
    function canProceed(step: number): boolean {
        switch (step) {
            case 1: return formData.diagnosis !== null;
            case 2: return formData.industry !== '' && formData.size !== '';
            case 3: return formData.problem.trim().length >= 30;
            case 4: return formData.peopleInvolved !== '' && formData.growsWithScale !== '';
            case 5: return true;
            case 6: return formData.urgency !== '' && formData.scope !== '';
            case 7: return (
                formData.name.trim().length >= 2 &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                formData.company.trim().length >= 2 &&
                formData.agreedPrivacy &&
                formData.agreedTerms &&
                formData.honeypot === ''
            );
            default: return false;
        }
    }

    async function goToStep(step: number) {
        if (step < 1 || step > totalSteps) return;
        if (step > currentStep && !canProceed(currentStep)) {
            shake();
            return;
        }
        await transitionOut();
        currentStep = step;
        await transitionIn();
    }

    function transitionOut(): Promise<void> {
        return new Promise(resolve => {
            if (!viewport) return resolve();
            gsap.to(viewport, {
                opacity: 0,
                x: -20,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: resolve as () => void
            });
        });
    }

    function transitionIn(): Promise<void> {
        return new Promise(resolve => {
            if (!viewport) return resolve();
            gsap.fromTo(
                viewport,
                { opacity: 0, x: 20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                    onComplete: resolve as () => void
                }
            );
        });
    }

    function shake() {
        if (!viewport) return;
        gsap.fromTo(
            viewport,
            { x: 0 },
            {
                x: 6,
                duration: 0.07,
                yoyo: true,
                repeat: 5,
                ease: 'power1.inOut',
                onComplete: () => gsap.set(viewport, { x: 0 })
            }
        );
    }

    function toggleTried(value: string) {
        const idx = formData.triedBefore.indexOf(value);
        if (idx === -1) {
            formData.triedBefore = [...formData.triedBefore, value];
        } else {
            formData.triedBefore = formData.triedBefore.filter(v => v !== value);
        }
    }

    async function submit() {
        if (!canProceed(7)) {
            shake();
            return;
        }
        if (formData.honeypot !== '') {
            // Bot detected, silent accept
            submitState = 'success';
            return;
        }

        isSubmitting = true;
        try {
            const res = await fetch('/api/brief', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error(`Submit failed with status ${res.status}`);
            submitState = 'success';
        } catch (e) {
            console.error('[BriefFlow] submit error:', e);
            submitState = 'error';
        } finally {
            isSubmitting = false;
        }
    }

    function retrySubmit() {
        submitState = 'idle';
    }

    const diagnosisOptions = [
        { id: 'biuro', title: 'POWTARZALNA PRACA BIUROWA', body: 'kopiowanie danych, ręczne maile, raporty' },
        { id: 'strona', title: 'STRONA NIE SPRZEDAJE LUB JEJ NIE MAM', body: 'potrzebuję czegoś co konwertuje' },
        { id: 'sprzedaz', title: 'SPRZEDAŻ POTRZEBUJE BOOSTU', body: 'lead generation, outreach, follow-up' },
        { id: 'wizja', title: 'MAM WIZJĘ, POTRZEBUJĘ EXEKUCJI', body: 'wiem czego chcę, szukam wykonawcy' }
    ];

    const industryOptions = [
        'E-commerce',
        'Usługi B2B',
        'Produkcja i hurt',
        'Edukacja i e-learning',
        'Biuro księgowe lub prawne',
        'Marketing lub agencja',
        'SaaS lub aplikacja',
        'Inne'
    ];

    const sizeOptions = ['1', '2-10', '11-50', '50+'];
    const peopleOptions = ['1', '2-3', '4-10', '10+'];
    const growsOptions = ['Tak', 'Nie', 'Nie wiem'];
    const triedOptions = [
        'Zatrudnić nową osobę',
        'Inny software',
        'Inna agencja',
        'Sami napisaliśmy coś w Excelu',
        'Nic nie próbowaliśmy'
    ];
    const urgencyOptions = [
        { value: 'palace', label: 'Wczoraj, palące' },
        { value: 'miesiac', label: 'W tym miesiącu' },
        { value: 'kwartal', label: 'W kwartale' },
        { value: 'rozwazam', label: 'Rozważam, brak deadline' }
    ];
    const scopeOptions = [
        { value: 'mvp', label: 'TYLKO MVP', desc: 'najszybciej, działa, koszt minimalny' },
        { value: 'pelny', label: 'PEŁNY SYSTEM', desc: 'solidnie, długoterminowo' },
        { value: 'doradzcie', label: 'NIE WIEM, DORADZCIE', desc: 'pomóżcie wybrać' }
    ];
    const budgetOptions = [
        '< 5 000 zł',
        '5 000 — 15 000 zł',
        '15 000 — 50 000 zł',
        '> 50 000 zł',
        'Nie mam pojęcia, dopasujcie'
    ];

    const stepHeadings: Record<number, { label: string, heading: string, body: string }> = {
        1: { label: '01 / 07 — DIAGNOZA', heading: 'ZACZNIJMY OD BÓLU.', body: 'Wybierz najbliższe Twojej sytuacji. Możesz później doprecyzować.' },
        2: { label: '02 / 07 — KONTEKST', heading: 'POZNAJEMY TWÓJ ŚWIAT.', body: 'Dzięki temu nie pytamy o oczywiste rzeczy później.' },
        3: { label: '03 / 07 — PROBLEM', heading: 'WŁASNYM JĘZYKIEM. BEZ ŻARGONU.', body: 'Im konkretniej, tym lepsza wycena. Pisz jak do kolegi.' },
        4: { label: '04 / 07 — SKALA', heading: 'POMOŻEMY ZMIERZYĆ.', body: 'Kwantyfikujemy problem, żebyśmy wiedzieli, jaki ROI ma sens.' },
        5: { label: '05 / 07 — KONTEKST 2', heading: 'NIC NIE OCENIAMY.', body: 'Wiedza o tym, co nie zadziałało, oszczędza nam (i Tobie) tygodni pracy.' },
        6: { label: '06 / 07 — RAMY', heading: 'USTALMY OCZEKIWANIA.', body: 'Wycena zależy od zakresu i pilności. Powiedz szczerze, dopasujemy się.' },
        7: { label: '07 / 07 — FINISZ', heading: 'OSTATNI KROK.', body: 'Po wysłaniu odzywamy się w ciągu 24h roboczych. Nie sprzedajemy. Po prostu rozmawiamy o tym, czy mamy sens.' }
    };
</script>

<div class="briefflow w-full bg-surface/40 border border-white/10 backdrop-blur-md">
    {#if submitState === 'success'}
        <!-- SUCCESS STATE -->
        <div class="success-view text-center py-20 md:py-32 px-6 md:px-12">
            <div class="checkmark-wrap mx-auto mb-10 w-20 h-20 border-2 border-brass rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path d="M6 16 L13 23 L26 9" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3 class="font-heading text-silver text-3xl md:text-5xl tracking-cinematic uppercase mb-6">MAMY TO.</h3>
            <p class="font-sans text-steel text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-3">
                Twoje zgłoszenie czeka na nas. Odzywamy się w 24 godziny robocze.
            </p>
            {#if formData.email}
                <p class="font-mono text-brass text-xs tracking-widest uppercase">
                    Podsumowanie wysłaliśmy też na {formData.email}
                </p>
            {/if}
        </div>
    {:else if submitState === 'error'}
        <!-- ERROR STATE -->
        <div class="error-view text-center py-16 md:py-24 px-6 md:px-12">
            <div class="mx-auto mb-8 w-16 h-16 border-2 border-brass/60 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <line x1="6" y1="6" x2="18" y2="18" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
                    <line x1="18" y1="6" x2="6" y2="18" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <h3 class="font-heading text-silver text-2xl md:text-3xl tracking-cinematic uppercase mb-4">COŚ POSZŁO NIE TAK.</h3>
            <p class="font-sans text-steel text-base leading-relaxed max-w-lg mx-auto mb-8">
                Nie udało nam się zapisać Twojego zgłoszenia. Spróbuj ponownie albo napisz bezpośrednio na adres mailowy. Twoje dane nie zostały utracone.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    type="button"
                    onclick={retrySubmit}
                    class="brief-next interactive cursor-none inline-flex items-center gap-3 px-7 py-3 bg-brass text-void font-heading text-xs tracking-[0.2em] uppercase transition-all duration-200 ease-out"
                >
                    SPRÓBUJ PONOWNIE
                </button>
                <a
                    href="mailto:kontakt@nobelion.pl?subject=Brief%20Nobelion"
                    class="interactive cursor-none font-mono text-brass text-xs tracking-[0.25em] uppercase hover:text-brass-light transition-colors duration-200 ease-out"
                >
                    KONTAKT@NOBELION.PL →
                </a>
            </div>
        </div>
    {:else}
        <!-- PROGRESS BAR -->
        <header class="px-6 md:px-12 pt-8 md:pt-10 pb-6 border-b border-white/10">
            <div class="flex items-center justify-between mb-3">
                <span class="font-mono text-brass text-[11px] md:text-xs tracking-[0.3em] uppercase">
                    KROK {String(currentStep).padStart(2, '0')} / 0{totalSteps}
                </span>
                <span class="font-mono text-steel text-[11px] md:text-xs tracking-[0.3em] uppercase">
                    {Math.round((currentStep / totalSteps) * 100)}%
                </span>
            </div>
            <div class="relative h-px bg-white/10 overflow-hidden">
                <div
                    class="progress-bar absolute top-0 left-0 h-full bg-brass"
                    style="width: {(currentStep / totalSteps) * 100}%; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"
                ></div>
            </div>
        </header>

        <!-- HONEYPOT (anti-spam, ukryty) -->
        <input
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            bind:value={formData.honeypot}
            class="absolute left-[-9999px] opacity-0 pointer-events-none"
            aria-hidden="true"
        />

        <!-- VIEWPORT (zmienia się per krok) -->
        <div bind:this={viewport} class="briefflow-viewport grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 p-6 md:p-12 lg:p-16 min-h-[32rem]">

            <!-- LEWA kolumna: kontekst i edukacja -->
            <aside class="lg:col-span-5">
                <p class="font-mono text-brass text-[11px] tracking-[0.3em] uppercase mb-4">
                    {stepHeadings[currentStep].label}
                </p>
                <h3 class="font-heading text-silver text-2xl md:text-3xl lg:text-4xl tracking-[0.04em] uppercase leading-[1.1] mb-6 max-w-md text-balance">
                    {stepHeadings[currentStep].heading}
                </h3>
                <p class="font-sans text-steel text-base md:text-lg leading-relaxed max-w-md">
                    {stepHeadings[currentStep].body}
                </p>

                <!-- Mini-decoration: pionowa linia mosiężna w lewym dolnym rogu -->
                <div class="hidden lg:flex items-end h-32 mt-12">
                    <div class="w-px h-full bg-linear-to-b from-transparent to-brass/40"></div>
                </div>
            </aside>

            <!-- PRAWA kolumna: input -->
            <div class="lg:col-span-7 space-y-6">

                {#if currentStep === 1}
                    <!-- KROK 01: DIAGNOZA -->
                    <div class="space-y-3">
                        {#each diagnosisOptions as option}
                            <button
                                type="button"
                                class="diagnosis-card interactive cursor-none w-full text-left p-5 md:p-6 border bg-void/40 transition-colors duration-200 ease-out"
                                class:selected={formData.diagnosis === option.id}
                                onclick={() => formData.diagnosis = option.id as Diagnosis}
                            >
                                <div class="flex items-start gap-5">
                                    <span class="font-mono text-brass text-base md:text-lg tracking-wider flex-shrink-0 pt-1">
                                        0{diagnosisOptions.indexOf(option) + 1}
                                    </span>
                                    <div class="flex-1">
                                        <h4 class="font-heading text-silver text-base md:text-lg tracking-wider uppercase leading-snug mb-1">
                                            {option.title}
                                        </h4>
                                        <p class="font-sans text-steel text-sm leading-relaxed">
                                            {option.body}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>

                {:else if currentStep === 2}
                    <!-- KROK 02: KONTEKST -->
                    <div class="space-y-6">
                        <div>
                            <label for="industry" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">BRANŻA</label>
                            <select
                                id="industry"
                                bind:value={formData.industry}
                                class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                            >
                                <option value="">Wybierz branżę...</option>
                                {#each industryOptions as ind}
                                    <option value={ind}>{ind}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">WIELKOŚĆ ZESPOŁU</p>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {#each sizeOptions as size}
                                    <button
                                        type="button"
                                        class="size-pill interactive cursor-none px-4 py-3 border font-mono text-sm tracking-widest transition-colors duration-200 ease-out"
                                        class:selected={formData.size === size}
                                        onclick={() => formData.size = size}
                                    >
                                        {size}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <label for="tools" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">GŁÓWNE NARZĘDZIA</label>
                            <input
                                id="tools"
                                type="text"
                                bind:value={formData.tools}
                                placeholder="np. Gmail, Excel, Subiekt, Allegro, Salesforce..."
                                class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver placeholder:text-steel/80 font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                            />
                        </div>
                    </div>

                {:else if currentStep === 3}
                    <!-- KROK 03: PROBLEM -->
                    <div class="space-y-4">
                        <div>
                            <label for="problem" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">OPISZ PROBLEM</label>
                            <textarea
                                id="problem"
                                bind:value={formData.problem}
                                placeholder={placeholders[placeholderIndex]}
                                rows="6"
                                maxlength="2000"
                                class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver placeholder:text-steel/80 font-sans text-base leading-relaxed focus:border-brass focus:outline-none transition-colors duration-200 ease-out resize-y"
                                aria-describedby="problem-counter"
                            ></textarea>
                            <div class="flex justify-between mt-2">
                                <span id="problem-counter" class="font-mono text-steel/80 text-[11px] tracking-widest">
                                    {formData.problem.length} znaków {formData.problem.length < 30 ? '(min. 30)' : ''}
                                </span>
                                <button
                                    type="button"
                                    class="font-mono text-brass text-[11px] tracking-widest uppercase hover:text-brass-light transition-colors duration-200 ease-out interactive cursor-none"
                                    onclick={() => formData.helperOpen = !formData.helperOpen}
                                >
                                    {formData.helperOpen ? '— UKRYJ POMOC' : '+ POMÓŻ MI OPISAĆ'}
                                </button>
                            </div>
                        </div>

                        {#if formData.helperOpen}
                            <div class="space-y-3 p-4 border border-brass/20 bg-void/30">
                                <p class="font-mono text-brass text-[11px] tracking-widest uppercase mb-2">Pomocnicze pytania:</p>
                                {#each [
                                    { key: 'frequency', label: 'Jak często pojawia się ten problem?' },
                                    { key: 'people', label: 'Ile osób się tym zajmuje?' },
                                    { key: 'time', label: 'Ile czasu zajmuje za każdym razem?' },
                                    { key: 'tools', label: 'Jakich narzędzi używacie do tego dziś?' },
                                    { key: 'tried', label: 'Co już próbowaliście?' }
                                ] as q}
                                    <div>
                                        <label for={`helper-${q.key}`} class="block text-steel text-xs mb-1">{q.label}</label>
                                        <input
                                            id={`helper-${q.key}`}
                                            type="text"
                                            bind:value={formData.helperAnswers[q.key as keyof typeof formData.helperAnswers]}
                                            class="brief-input w-full bg-void/60 border border-white/10 px-3 py-2 text-silver font-sans text-sm focus:border-brass focus:outline-none"
                                        />
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <!-- Drag&drop placeholder (UI only, brak uploadu w fazie 1) -->
                        <div class="border border-dashed border-brass/30 p-6 text-center">
                            <p class="font-mono text-steel/90 text-xs tracking-widest uppercase">
                                OPCJONALNIE: PRZECIĄGNIJ TU SCREENSHOTY LUB DOKUMENTY
                            </p>
                            <p class="font-mono text-steel/90 text-[10px] tracking-widest uppercase mt-1">
                                (do 5 plików, max 10 MB każdy, dostępne wkrótce)
                            </p>
                        </div>
                    </div>

                {:else if currentStep === 4}
                    <!-- KROK 04: SKALA -->
                    <div class="space-y-8">
                        <div>
                            <label for="hours" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">
                                ILE GODZIN TYGODNIOWO TEN PROBLEM ZJADA TWOJEJ FIRMIE?
                            </label>
                            <div class="flex items-center gap-6">
                                <input
                                    id="hours"
                                    type="range"
                                    min="0"
                                    max="80"
                                    step="1"
                                    bind:value={formData.hoursWeek}
                                    class="hours-slider flex-1"
                                />
                                <span class="font-heading text-brass text-2xl md:text-3xl min-w-[5rem] text-right">
                                    {formData.hoursWeek}h
                                </span>
                            </div>
                        </div>
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">ILE OSÓB SIĘ TYM ZAJMUJE?</p>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {#each peopleOptions as p}
                                    <button
                                        type="button"
                                        class="size-pill interactive cursor-none px-4 py-3 border font-mono text-sm tracking-widest transition-colors duration-200 ease-out"
                                        class:selected={formData.peopleInvolved === p}
                                        onclick={() => formData.peopleInvolved = p}
                                    >
                                        {p}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">CZY PROBLEM ROŚNIE ZE SKALĄ FIRMY?</p>
                            <div class="grid grid-cols-3 gap-2">
                                {#each growsOptions as g}
                                    <button
                                        type="button"
                                        class="size-pill interactive cursor-none px-4 py-3 border font-mono text-sm tracking-widest transition-colors duration-200 ease-out"
                                        class:selected={formData.growsWithScale === g}
                                        onclick={() => formData.growsWithScale = g}
                                    >
                                        {g}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        <!-- WOW MOMENT: kalkulator ROI -->
                        {#if annualCost > 0}
                            <div class="annual-cost-card border border-brass/40 bg-brass/5 p-5 md:p-6 text-center">
                                <p class="font-mono text-brass text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2">
                                    PRZYBLIŻONY KOSZT ROCZNY
                                </p>
                                <p class="font-heading text-silver text-3xl md:text-5xl tracking-tight">
                                    ~ {formatPLN(annualCost)} zł
                                </p>
                                <p class="font-mono text-steel text-[10px] tracking-widest uppercase mt-3">
                                    przy szacunkowym koszcie 100 zł/h pracy
                                </p>
                            </div>
                        {/if}
                    </div>

                {:else if currentStep === 5}
                    <!-- KROK 05: CO PRÓBOWALIŚCIE -->
                    <div class="space-y-6">
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">PRÓBOWALIŚCIE:</p>
                            <div class="space-y-2">
                                {#each triedOptions as t}
                                    <label class="flex items-start gap-3 p-3 border bg-void/40 cursor-pointer transition-colors duration-200 ease-out hover:border-brass/40 interactive cursor-none"
                                           class:tried-selected={formData.triedBefore.includes(t)}>
                                        <input
                                            type="checkbox"
                                            checked={formData.triedBefore.includes(t)}
                                            onchange={() => toggleTried(t)}
                                            class="mt-1 accent-brass"
                                        />
                                        <span class="font-sans text-silver text-sm leading-relaxed">{t}</span>
                                    </label>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <label for="triedNotes" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">
                                CO NIE ZADZIAŁAŁO? (opcjonalnie)
                            </label>
                            <textarea
                                id="triedNotes"
                                bind:value={formData.triedNotes}
                                rows="4"
                                placeholder="Dlaczego dotychczasowe próby nie wyszły..."
                                class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver placeholder:text-steel/80 font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out resize-y"
                            ></textarea>
                        </div>
                    </div>

                {:else if currentStep === 6}
                    <!-- KROK 06: RAMY -->
                    <div class="space-y-8">
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">PILNOŚĆ</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {#each urgencyOptions as u}
                                    <button
                                        type="button"
                                        class="size-pill interactive cursor-none px-4 py-3 border font-mono text-xs tracking-widest text-left transition-colors duration-200 ease-out"
                                        class:selected={formData.urgency === u.value}
                                        onclick={() => formData.urgency = u.value}
                                    >
                                        {u.label}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">ZAKRES</p>
                            <div class="space-y-2">
                                {#each scopeOptions as s}
                                    <button
                                        type="button"
                                        class="scope-card interactive cursor-none w-full text-left p-4 border bg-void/40 transition-colors duration-200 ease-out"
                                        class:selected={formData.scope === s.value}
                                        onclick={() => formData.scope = s.value}
                                    >
                                        <div class="font-heading text-silver text-base tracking-wider uppercase mb-1">{s.label}</div>
                                        <div class="font-sans text-steel text-sm">{s.desc}</div>
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <p class="font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-3">BUDŻET ORIENTACYJNY (opcjonalnie)</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {#each budgetOptions as b}
                                    <button
                                        type="button"
                                        class="size-pill interactive cursor-none px-4 py-3 border font-mono text-xs tracking-widest text-left transition-colors duration-200 ease-out"
                                        class:selected={formData.budget === b}
                                        onclick={() => formData.budget = b}
                                    >
                                        {b}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    </div>

                {:else if currentStep === 7}
                    <!-- KROK 07: KONTAKT -->
                    <div class="space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="name" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">IMIĘ I NAZWISKO *</label>
                                <input
                                    id="name"
                                    type="text"
                                    bind:value={formData.name}
                                    required
                                    maxlength="80"
                                    autocomplete="name"
                                    class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                                />
                            </div>
                            <div>
                                <label for="email" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">EMAIL FIRMOWY *</label>
                                <input
                                    id="email"
                                    type="email"
                                    bind:value={formData.email}
                                    required
                                    maxlength="120"
                                    autocomplete="email"
                                    class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="phone" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">TELEFON (opcjonalnie)</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    bind:value={formData.phone}
                                    maxlength="20"
                                    autocomplete="tel"
                                    class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                                />
                                <p class="font-mono text-steel/80 text-[10px] tracking-widest mt-1">JEŚLI WOLISZ ROZMOWĘ ZAMIAST MAILA</p>
                            </div>
                            <div>
                                <label for="company" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">NAZWA FIRMY *</label>
                                <input
                                    id="company"
                                    type="text"
                                    bind:value={formData.company}
                                    required
                                    maxlength="120"
                                    autocomplete="organization"
                                    class="brief-input w-full bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                                />
                            </div>
                        </div>
                        <div>
                            <label for="nip" class="block font-mono text-brass text-[11px] tracking-[0.25em] uppercase mb-2">NIP (opcjonalnie, do faktury)</label>
                            <input
                                id="nip"
                                type="text"
                                bind:value={formData.nip}
                                maxlength="15"
                                class="brief-input w-full md:max-w-xs bg-void/40 border border-white/10 px-4 py-3 text-silver font-sans text-base focus:border-brass focus:outline-none transition-colors duration-200 ease-out"
                            />
                        </div>

                        <div class="space-y-3 pt-4 border-t border-white/10">
                            <label class="flex items-start gap-3 cursor-pointer interactive cursor-none">
                                <input type="checkbox" bind:checked={formData.agreedPrivacy} class="mt-1 accent-brass" />
                                <span class="font-sans text-silver/85 text-sm leading-relaxed">
                                    Wyrażam zgodę na przetwarzanie danych zgodnie z <button type="button" class="text-brass underline hover:text-brass-light interactive cursor-none" onclick={() => document.getElementById('open-privacy')?.click()}>Polityką Prywatności</button>
                                </span>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer interactive cursor-none">
                                <input type="checkbox" bind:checked={formData.agreedTerms} class="mt-1 accent-brass" />
                                <span class="font-sans text-silver/85 text-sm leading-relaxed">
                                    Akceptuję <button type="button" class="text-brass underline hover:text-brass-light interactive cursor-none" onclick={() => document.getElementById('open-terms')?.click()}>Regulamin</button>
                                </span>
                            </label>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <!-- NAWIGACJA -->
        <footer class="px-6 md:px-12 pb-8 md:pb-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            <button
                type="button"
                onclick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 1}
                class="brief-back interactive cursor-none font-mono text-xs tracking-[0.25em] uppercase transition-colors duration-200 ease-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
                ← WSTECZ
            </button>

            {#if currentStep < totalSteps}
                <button
                    type="button"
                    onclick={() => goToStep(currentStep + 1)}
                    disabled={!canProceed(currentStep)}
                    class="brief-next interactive cursor-none inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-brass text-void font-heading text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-200 ease-out disabled:bg-steel/30 disabled:text-void/50 disabled:cursor-not-allowed"
                >
                    DALEJ
                    <span aria-hidden="true">→</span>
                </button>
            {:else}
                <button
                    type="button"
                    onclick={submit}
                    disabled={!canProceed(7) || isSubmitting}
                    class="brief-submit interactive cursor-none inline-flex items-center gap-3 px-7 md:px-10 py-3 md:py-4 bg-brass text-void font-heading text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-200 ease-out disabled:bg-steel/30 disabled:text-void/50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'WYSYŁANIE...' : 'WYŚLIJ ZGŁOSZENIE →'}
                </button>
            {/if}
        </footer>
    {/if}
</div>

<style>
    .briefflow {
        position: relative;
    }

    /* Diagnosis cards */
    .diagnosis-card {
        border-color: rgba(255, 255, 255, 0.08);
    }
    .diagnosis-card:hover {
        border-color: rgba(197, 160, 89, 0.4);
        background-color: rgba(11, 16, 28, 0.6);
    }
    .diagnosis-card.selected {
        border-color: rgba(197, 160, 89, 0.8);
        background-color: rgba(197, 160, 89, 0.06);
        box-shadow: 0 0 1.25rem 0 rgba(197, 160, 89, 0.15);
    }

    /* Size pills i scope cards */
    .size-pill, .scope-card {
        border-color: rgba(255, 255, 255, 0.08);
        color: var(--color-silver, #E0E0E0);
    }
    .size-pill:hover, .scope-card:hover {
        border-color: rgba(197, 160, 89, 0.5);
        color: var(--color-brass, #C5A059);
    }
    .size-pill.selected, .scope-card.selected {
        border-color: rgba(197, 160, 89, 0.8);
        background-color: rgba(197, 160, 89, 0.08);
        color: var(--color-brass, #C5A059);
    }

    .tried-selected {
        border-color: rgba(197, 160, 89, 0.5);
        background-color: rgba(197, 160, 89, 0.04);
    }

    /* Inputs focus state */
    .brief-input:focus-visible {
        outline: 1px solid var(--color-brass, #C5A059);
        outline-offset: 2px;
    }

    /* Range slider mosiężny */
    .hours-slider {
        -webkit-appearance: none;
        appearance: none;
        height: 2px;
        background: rgba(197, 160, 89, 0.25);
        outline: none;
    }
    .hours-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        background: #C5A059;
        cursor: none;
        border-radius: 50%;
        border: 2px solid #050505;
        box-shadow: 0 0 0.5rem 0 rgba(197, 160, 89, 0.5);
    }
    .hours-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        background: #C5A059;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid #050505;
        box-shadow: 0 0 0.5rem 0 rgba(197, 160, 89, 0.5);
    }

    /* Nav buttons */
    .brief-back {
        color: var(--color-steel, #94A3B8);
    }
    .brief-back:hover:not(:disabled) {
        color: var(--color-brass, #C5A059);
    }
    .brief-next:hover:not(:disabled),
    .brief-submit:hover:not(:disabled) {
        background-color: var(--color-brass-light, #E6C885);
        box-shadow: 0 0.25rem 1.5rem 0 rgba(197, 160, 89, 0.35);
    }

    .brief-back:focus-visible,
    .brief-next:focus-visible,
    .brief-submit:focus-visible {
        outline: 2px solid var(--color-brass-light, #E6C885);
        outline-offset: 4px;
    }

    /* Annual cost reveal animation */
    .annual-cost-card {
        animation: revealCost 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes revealCost {
        from { opacity: 0; transform: translateY(0.5rem); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .annual-cost-card { animation: none; }
        .progress-bar { transition: none !important; }
    }
</style>
