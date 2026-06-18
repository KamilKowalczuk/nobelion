<script lang="ts">
  import ConsentGate, { type LegalDoc } from './ConsentGate.svelte';
  import DocModal from './DocModal.svelte';
  import { BUSINESS_CONFIG, PAYMENT_MODELS, PAYMENT_STATUSES, API_ENDPOINTS } from '../../lib/constants';

  let {
    apiUrl,
    token,
    fullPrice,
    quoteData,
    legalDocs
  } = $props<{
    apiUrl: string;
    token: string;
    fullPrice: number;
    quoteData: any;
    legalDocs: Record<string, LegalDoc>;
  }>();

  const discountedPrice = Math.round(fullPrice * BUSINESS_CONFIG.DISCOUNT_RATE);
  const savings = fullPrice - discountedPrice;
  const remainingPrice = fullPrice - Math.round(fullPrice / BUSINESS_CONFIG.INSTALLMENT_DIVISOR);
  const paymentStatus = quoteData?.paymentStatus || PAYMENT_STATUSES.UNPAID;

  let termsAccepted = $state(false);
  let agreementAccepted = $state(false);
  let isGateOk = $derived(termsAccepted && agreementAccepted);

  let flashConsent = $state(false);
  let isBusy = $state(false);
  let processingModel = $state<string | null>(null);
  let clientSelectedMaintenance = $state(quoteData.clientSelectedMaintenance || false);

  // Doc Modal state
  let activeDoc = $state<LegalDoc | null>(null);
  let docModalOpen = $state(false);

  function openDoc(doc: LegalDoc) {
    activeDoc = doc;
    docModalOpen = true;
  }

  function triggerFlash() {
    flashConsent = false;
    setTimeout(() => { flashConsent = true; }, 10);
  }

  async function handleCheckout(model: string) {
    if (!isGateOk) {
      triggerFlash();
      return;
    }
    
    isBusy = true;
    processingModel = model;
    
    try {
      const res = await fetch(`${apiUrl}${API_ENDPOINTS.checkout(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentModel: model,
          acceptTerms: termsAccepted,
          acceptAgreement: agreementAccepted
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert('Błąd: ' + (data.error || 'Spróbuj ponownie.'));
    } catch {
      alert('Błąd połączenia z serwerem.');
    }
    
    isBusy = false;
    processingModel = null;
  }

  async function toggleMaintenance(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    clientSelectedMaintenance = checked;
    try {
      await fetch(`${apiUrl}${API_ENDPOINTS.maintenance(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wantsMaintenance: checked })
      });
    } catch {}
  }

  const fmt = (n: number) => new Intl.NumberFormat('pl-PL').format(n);
</script>

<aside class="min-w-0" id="payment-options">
  <div class="sticky top-[96px] flex flex-col gap-[18px] max-[980px]:static">
    <div class="mb-[6px]">
      <span class="eyebrow">Całkowita wartość</span>
      <div class="font-heading font-bold text-[clamp(32px,3.4vw,42px)] text-ink leading-none m-[12px_0_8px]">{fmt(fullPrice)} PLN</div>
      <span class="caption">Cena podstawowa (netto)</span>
    </div>

    {#if paymentStatus === PAYMENT_STATUSES.PAID_FULL}
      <div class="flex flex-col items-start gap-[10px] border border-[rgba(184,137,62,0.45)] bg-[rgba(184,137,62,0.06)] rounded-card p-[26px_24px]">
        <span class="w-[44px] h-[44px] border-[1.5px] border-brass rounded-full flex items-center justify-center text-brass-dark mb-[4px]" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M5 12.5 L10 17.5 L19 6.5" />
          </svg>
        </span>
        <h3 class="h4 m-0 text-ink">Opłacone w całości</h3>
        <p class="m-0 text-[14px] leading-[1.6] text-ink-2">Dziękujemy — realizacja jest w toku. Potwierdzenie płatności i faktura trafiły na Twój e-mail.</p>
      </div>
    {:else if paymentStatus === PAYMENT_STATUSES.PAID_HALF}
      <div class="flex flex-col items-start gap-[10px] border border-[rgba(184,137,62,0.45)] bg-[rgba(184,137,62,0.06)] rounded-card p-[26px_24px]">
        <span class="w-[44px] h-[44px] border-[1.5px] border-brass rounded-full flex items-center justify-center text-brass-dark mb-[4px]" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M5 12.5 L10 17.5 L19 6.5" />
          </svg>
        </span>
        <h3 class="h4 m-0 text-ink">I rata opłacona</h3>
        <p class="m-0 text-[14px] leading-[1.6] text-ink-2">Pracujemy nad Twoim projektem. Pozostałą część ({fmt(remainingPrice)} PLN) opłacisz linkiem, który wyślemy mailem na koniec prac.</p>
      </div>
    {:else}
      <!-- Consent Gate -->
      <ConsentGate 
        docRegulamin={legalDocs['regulamin']}
        docPolityka={legalDocs['polityka-prywatnosci']}
        docUmowa={legalDocs['umowa-wspolpracy']}
        bind:termsAccepted 
        bind:agreementAccepted 
        isFlash={flashConsent}
        {openDoc}
      />

      <span class="caption block text-ink-3 -mb-[4px]">Wybierz formę płatności</span>

      <!-- Primary Option: 100% -->
      <button 
        type="button" 
        class="relative flex flex-col text-left w-full cursor-pointer p-[clamp(22px,2.4vw,30px)] max-[640px]:p-[22px] bg-paper-2 border border-brass rounded-card transition-all duration-300 hover:border-brass-dark hover:shadow-lift hover:-translate-y-[2px] motion-reduce:hover:translate-y-0"
        class:opacity-50={!isGateOk}
        class:opacity-60={isBusy}
        class:pointer-events-none={isBusy}
        style="background: linear-gradient(160deg, color-mix(in srgb, var(--color-brass) 7%, var(--color-paper-2)), var(--color-paper-2));"
        onclick={() => handleCheckout(PAYMENT_MODELS.FULL)}
      >
        <span class="absolute top-0 right-0 bg-brass text-void font-mono text-[10px] font-semibold tracking-[0.14em] uppercase py-[6px] px-[12px] rounded-bl-inset">Rabat 10%</span>
        <h3 class="h4 m-[0_0_10px] text-ink">Płatność jednorazowa</h3>
        <p class="text-[14px] leading-[1.6] text-ink-3 m-[0_0_20px] grow">Domykasz sprawę od ręki i schodzisz z ceny o 10%. Jedna płatność, pełny rabat — ruszamy z projektem bez zwłoki.</p>
        <div class="font-heading font-bold text-[clamp(24px,2.6vw,30px)] leading-none mb-[4px] text-brass-dark">{fmt(discountedPrice)} PLN</div>
        {#if savings > 0}
          <span class="block m-[3px_0_18px] font-mono text-[11.5px] font-semibold tracking-[0.06em] text-brass-dark">Oszczędzasz {fmt(savings)} PLN</span>
        {/if}
        <span class="inline-flex items-center justify-center w-full font-mono font-semibold text-[12.5px] tracking-[0.14em] uppercase p-[14px_20px] mt-auto rounded-control transition-colors duration-300 bg-brass-bright text-void hover:bg-brass-light">
          {processingModel === PAYMENT_MODELS.FULL ? 'Przetwarzanie...' : 'Opłać całość z rabatem'}
        </span>
      </button>

      <!-- Secondary Option: 50% -->
      <button 
        type="button" 
        class="relative flex flex-col text-left w-full cursor-pointer p-[clamp(22px,2.4vw,30px)] max-[640px]:p-[22px] bg-transparent border border-hair-ink rounded-card transition-all duration-300 hover:border-ink-4 hover:shadow-lift hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 group/sec"
        class:opacity-50={!isGateOk}
        class:opacity-60={isBusy}
        class:pointer-events-none={isBusy}
        onclick={() => handleCheckout(PAYMENT_MODELS.HALF)}
      >
        <h3 class="h4 m-[0_0_10px] text-ink-2">Płatność w dwóch ratach</h3>
        <p class="text-[14px] leading-[1.6] text-ink-3 m-[0_0_20px] grow">Wolisz rozłożyć inwestycję? Płacisz połowę na start, a drugą część dopiero po odbiorze gotowego projektu.</p>
        <div class="font-heading font-bold text-[clamp(20px,2.1vw,25px)] leading-none mb-[4px] text-ink-2">{fmt(Math.round(fullPrice / BUSINESS_CONFIG.INSTALLMENT_DIVISOR))} PLN</div>
        <span class="block mb-[18px] caption">I rata — start prac</span>
        <span class="inline-flex items-center justify-center w-full font-mono font-semibold text-[12.5px] tracking-[0.14em] uppercase p-[14px_20px] mt-auto rounded-control transition-colors duration-300 border border-hair-ink text-ink group-hover/sec:border-ink">
          {processingModel === PAYMENT_MODELS.HALF ? 'Przetwarzanie...' : 'Opłać I ratę (50%)'}
        </span>
      </button>

      <!-- Optional Addon: Maintenance -->
      {#if quoteData.maintenancePrice}
        <label class="flex gap-[13px] items-start cursor-pointer border rounded-card p-[16px_18px] transition-all duration-300 group/addon"
               class:border-brass={clientSelectedMaintenance}
               class:bg-[color-mix(in_srgb,var(--color-brass),transparent_88%)]={clientSelectedMaintenance}
               class:border-[color-mix(in_srgb,var(--color-brass),transparent_50%)]={!clientSelectedMaintenance}
               class:bg-[color-mix(in_srgb,var(--color-brass),transparent_95%)]={!clientSelectedMaintenance}>
          <input type="checkbox" class="absolute opacity-0 w-0 h-0 peer" checked={clientSelectedMaintenance} onchange={toggleMaintenance} />
          
          <span class="shrink-0 w-[24px] h-[24px] mt-[1px] rounded-[6px] border-[1.5px] border-brass bg-paper flex items-center justify-center text-transparent transition-all duration-180 shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--color-brass),transparent_86%)] group-hover/addon:border-brass-dark peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass peer-checked:bg-brass peer-checked:border-brass peer-checked:text-void peer-checked:shadow-none" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M5 12.5 L10 17.5 L19 6.5"/></svg>
          </span>
          
          <span class="flex flex-col gap-[5px] min-w-0">
            <span class="flex items-baseline justify-between gap-[10px]">
              <span class="font-heading font-semibold text-[14px] tracking-[0.04em] uppercase text-ink">Opieka po wdrożeniu</span>
              <span class="font-mono text-[13px] text-brass-dark whitespace-nowrap font-semibold">+{fmt(quoteData.maintenancePrice)} zł/mies.</span>
            </span>
            <span class="text-[12.5px] leading-[1.58] text-ink-2">Twój system zostaje pod naszą ręką — działa bez przerw, jest aktualny i bezpieczny. Ty prowadzisz firmę, technologią zajmujemy się my.</span>
            <span class="text-[12.5px] leading-[1.55] text-ink-3 whitespace-pre-line">{quoteData.maintenanceDescription || 'Monitoring, aktualizacje, kopie zapasowe i drobne poprawki po starcie.'}</span>
            
            <span class="flex items-start gap-[7px] mt-[2px] pt-[10px] border-t border-[color-mix(in_srgb,var(--color-brass),transparent_78%)] text-[11.5px] leading-[1.5] text-brass-dark">
              <svg class="shrink-0 mt-[1px]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>
              <span>Pierwsza opłata rusza dopiero po oddaniu gotowego projektu — dziś nie płacisz za nią nic.</span>
            </span>
            
            <span class="mt-[3px] font-mono text-[10.5px] tracking-[0.1em] uppercase inline-flex items-center gap-[6px]"
                  class:text-ink-3={clientSelectedMaintenance}
                  class:text-brass-dark={!clientSelectedMaintenance}>
              {#if clientSelectedMaintenance}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M5 12.5 L10 17.5 L19 6.5"/></svg>
                W ofercie — start po wdrożeniu
              {:else}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 5v14M5 12h14"/></svg>
                Dodaj do oferty
              {/if}
            </span>
          </span>
        </label>
      {/if}

    {/if}
  </div>

  <DocModal 
    bind:isOpen={docModalOpen} 
    title={activeDoc?.title || ''} 
    html={activeDoc?.html || ''} 
  />
</aside>
