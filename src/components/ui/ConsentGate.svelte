<script lang="ts">
  export type LegalDoc = { title: string; html: string; version?: string };
  
  let {
    docRegulamin,
    docPolityka,
    docUmowa,
    termsAccepted = $bindable(false),
    agreementAccepted = $bindable(false),
    isFlash = false,
    showAgreement = true,
    errorMessage = "Zaznacz obie zgody, aby odblokować płatność.",
    openDoc
  } = $props<{
    docRegulamin?: LegalDoc;
    docPolityka?: LegalDoc;
    docUmowa?: LegalDoc;
    termsAccepted: boolean;
    agreementAccepted?: boolean;
    isFlash?: boolean;
    showAgreement?: boolean;
    errorMessage?: string;
    openDoc: (doc: LegalDoc) => void;
  }>();

  let isGateOk = $derived(termsAccepted && (showAgreement ? agreementAccepted : true));
</script>

<div class="border border-paper-edge rounded-[24px] p-[20px_22px] flex flex-col gap-[14px] bg-paper-2" class:animate-[q-flash_1.1s_cubic-bezier(0.16,1,0.3,1)]={isFlash}>
  <span class="block text-ink-3 caption">Dokumenty i zgody</span>

  <!-- Regulamin + Polityka -->
  <div class="flex flex-col gap-[8px]">
    {#if docRegulamin || docPolityka}
      <div class="flex flex-col gap-[6px]">
        {#if docRegulamin}
          <button type="button" class="inline-flex items-center gap-[9px] text-left bg-none border-none cursor-pointer p-[4px_0] text-[13px] text-brass-dark underline underline-offset-3 transition-colors duration-[180ms] hover:text-ink group/doc" onclick={() => openDoc(docRegulamin)}>
            <svg class="shrink-0 text-ink-4 group-hover/doc:text-ink-3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>
            <span>{docRegulamin.title}</span>
            {#if docRegulamin.version}
              <span class="font-mono text-[10.5px] tracking-[0.04em] text-ink-4 whitespace-nowrap">wersja {docRegulamin.version}</span>
            {/if}
          </button>
        {/if}
        {#if docPolityka}
          <button type="button" class="inline-flex items-center gap-[9px] text-left bg-none border-none cursor-pointer p-[4px_0] text-[13px] text-brass-dark underline underline-offset-3 transition-colors duration-[180ms] hover:text-ink group/doc" onclick={() => openDoc(docPolityka)}>
            <svg class="shrink-0 text-ink-4 group-hover/doc:text-ink-3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>
            <span>{docPolityka.title}</span>
            {#if docPolityka.version}
              <span class="font-mono text-[10.5px] tracking-[0.04em] text-ink-4 whitespace-nowrap">wersja {docPolityka.version}</span>
            {/if}
          </button>
        {/if}
      </div>
    {/if}
    <label class="flex gap-[12px] items-start cursor-pointer group/check">
      <input type="checkbox" class="absolute opacity-0 w-0 h-0 peer" bind:checked={termsAccepted} />
      <span class="shrink-0 w-[22px] h-[22px] mt-[1px] rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--color-brass),transparent_40%)] flex items-center justify-center text-transparent bg-paper transition-all duration-[180ms] group-hover/check:border-brass peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass peer-checked:bg-brass peer-checked:border-brass peer-checked:text-void" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 L10 17.5 L19 6.5"/></svg>
      </span>
      <span class="text-[13px] leading-[1.6] text-ink-2 mt-[1px]">Akceptuję regulamin i politykę prywatności.</span>
    </label>
  </div>

  <!-- Umowa -->
  {#if showAgreement}
  <div class="flex flex-col gap-[8px]">
    {#if docUmowa}
      <div class="flex flex-col gap-[6px]">
        <button type="button" class="inline-flex items-center gap-[9px] text-left bg-none border-none cursor-pointer p-[4px_0] text-[13px] text-brass-dark underline underline-offset-3 transition-colors duration-[180ms] hover:text-ink group/doc" onclick={() => openDoc(docUmowa)}>
          <svg class="shrink-0 text-ink-4 group-hover/doc:text-ink-3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>
          <span>{docUmowa.title}</span>
          {#if docUmowa.version}
            <span class="font-mono text-[10.5px] tracking-[0.04em] text-ink-4 whitespace-nowrap">wersja {docUmowa.version}</span>
          {/if}
        </button>
      </div>
    {/if}
    <label class="flex gap-[12px] items-start cursor-pointer group/check">
      <input type="checkbox" class="absolute opacity-0 w-0 h-0 peer" bind:checked={agreementAccepted} />
      <span class="shrink-0 w-[22px] h-[22px] mt-[1px] rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--color-brass),transparent_40%)] flex items-center justify-center text-transparent bg-paper transition-all duration-[180ms] group-hover/check:border-brass peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass peer-checked:bg-brass peer-checked:border-brass peer-checked:text-void" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 L10 17.5 L19 6.5"/></svg>
      </span>
      <span class="text-[13px] leading-[1.6] text-ink-2 mt-[1px]">Akceptuję umowę współpracy.</span>
    </label>
  </div>
  {/if}

  {#if !isGateOk}
    <p class="m-[4px_0_0] text-center font-mono text-[11px] tracking-[0.04em] text-ink-4">{errorMessage}</p>
  {/if}
</div>

<style>
@keyframes q-flash {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  25% { box-shadow: 0 0 0 3px var(--color-brass-glow); border-color: var(--color-brass); }
}
</style>
