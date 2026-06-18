<script lang="ts">
  import { API_ENDPOINTS } from '../../lib/constants';

  let {
    apiUrl,
    token
  } = $props<{
    apiUrl: string;
    token: string;
  }>();

  let isOpen = $state(false);
  let isSuccess = $state(false);
  let isBusy = $state(false);
  let message = $state('');

  function open() {
    isOpen = true;
    isSuccess = false;
    message = '';
  }

  function close() {
    isOpen = false;
  }

  async function submit() {
    const msg = message.trim();
    if (!msg) {
      alert('Wpisz treść uwag.');
      return;
    }
    
    isBusy = true;
    try {
      const res = await fetch(`${apiUrl}${API_ENDPOINTS.requestChange(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      
      if (res.ok) {
        isSuccess = true;
      } else {
        const d = await res.json();
        alert('Błąd: ' + (d.error || 'Spróbuj ponownie.'));
      }
    } catch {
      alert('Błąd połączenia.');
    }
    isBusy = false;
  }
</script>

<div class="pt-[clamp(28px,3vw,40px)] border-t border-hair-ink">
  <p class="text-[14px] text-ink-3 m-[0_0_16px]">Masz pytania lub chciałbyś zmodyfikować zakres tej wyceny?</p>
  <button 
    class="inline-flex items-center gap-[10px] font-mono text-[13px] tracking-[0.06em] text-brass-dark bg-none border-none cursor-pointer p-0 transition-colors duration-300 hover:text-ink group" 
    type="button"
    onclick={open}
  >
    <svg class="transition-transform duration-300 group-hover:-rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
    <span class="border-b border-brass-glow pb-[2px]">Poproś o poprawki do wyceny</span>
  </button>
</div>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-[1200] flex items-center justify-center p-[20px] bg-[#08090c]/60 backdrop-blur-[8px]"
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  >
    <div class="relative w-full max-w-[30rem] bg-paper-2 border border-hair-ink rounded-shell p-[clamp(28px,4vw,40px)] shadow-lift overscroll-contain" data-lenis-prevent>
      <button 
        class="sticky top-0 float-right bg-paper-2 border-none cursor-pointer text-ink-3 p-[8px] transition-colors duration-180 z-20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] -mt-[10px] -mr-[10px] hover:text-ink" 
        aria-label="Zamknij" 
        type="button"
        onclick={close}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      
      {#if !isSuccess}
        <div>
          <span class="eyebrow">Poprawki</span>
          <h3 class="h3 m-[12px_0_10px] text-ink">Zgłoś zmiany</h3>
          <p class="text-ink-2 text-[15px] leading-[1.6] m-[0_0_22px]">Napisz co chciałbyś zmienić w zakresie lub wycenie. Przygotujemy nową ofertę.</p>
          <textarea 
            rows="5" 
            maxlength="2000" 
            class="w-full p-[14px] font-sans text-[14px] text-ink bg-paper border border-hair-ink rounded-control resize-none mb-[20px] transition-colors duration-300 focus:outline-none focus:border-brass focus:shadow-[inset_0_0_0_1px_var(--color-brass)]" 
            placeholder="Twoje uwagi..."
            bind:value={message}
          ></textarea>
          <button 
            class="inline-flex items-center justify-center w-full font-mono font-semibold text-[13px] tracking-[0.14em] uppercase p-[16px_24px] bg-brass-bright text-void rounded-control transition-colors duration-300 border border-transparent hover:bg-brass-light hover:border-brass disabled:opacity-60 disabled:cursor-not-allowed" 
            type="button"
            onclick={submit}
            disabled={isBusy}
          >
            <span class="border-b border-transparent">{isBusy ? 'Wysyłanie...' : 'Wyślij prośbę o zmiany'}</span>
          </button>
        </div>
      {:else}
        <div class="text-center p-[16px_0]">
          <div class="w-[56px] h-[56px] rounded-full m-[0_auto_20px] flex items-center justify-center border border-brass text-brass-dark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="h3 m-[12px_0_10px] text-ink">Prośba przyjęta</h3>
          <p class="text-ink-2 text-[15px] leading-[1.6] m-[0_0_22px]">Otrzymaliśmy Twoje uwagi. Wrócimy z poprawioną wersją wyceny na Twój e-mail.</p>
          <button 
            class="inline-flex items-center justify-center mt-[26px] font-mono font-semibold text-[12px] tracking-[0.14em] uppercase p-[12px_20px] bg-transparent text-ink-2 rounded-control transition-colors duration-300 border border-hair-ink hover:border-ink hover:text-ink" 
            type="button"
            onclick={close}
          >
            <span class="border-b border-transparent">Zamknij</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
