<script lang="ts">
  let { 
    isOpen = $bindable(false), 
    title, 
    html 
  } = $props<{
    isOpen: boolean;
    title: string;
    html: string;
  }>();

  function close() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-[1200] flex items-center justify-center p-[20px] bg-[#080b10]/60 backdrop-blur-[4px]" 
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  >
    <div class="relative bg-paper rounded-card max-w-[760px] w-full max-h-[86vh] overflow-y-auto p-[clamp(28px,4vw,48px)] shadow-lift overscroll-contain" data-lenis-prevent>
      <button 
        type="button" 
        class="sticky top-0 float-right bg-paper border-none cursor-pointer text-ink-3 p-[8px] transition-colors duration-[180ms] z-20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] -mt-[10px] -mr-[10px] hover:text-ink" 
        onclick={close} 
        aria-label="Zamknij"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h3 class="h3 mb-[20px] m-0 text-ink">{title}</h3>
      <div class="text-ink-2 leading-[1.7] text-[15px] rt">
        {@html html}
      </div>
    </div>
  </div>
{/if}
