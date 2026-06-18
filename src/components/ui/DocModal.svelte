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

  // Portal action for mounting to body
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    use:portal
    class="fixed inset-0 z-[2000] flex items-center justify-center p-[20px] bg-[#080b10]/70 backdrop-blur-[10px] animate-in fade-in duration-300" 
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  >
    <div class="relative bg-paper rounded-card max-w-[760px] w-full max-h-[88vh] overflow-y-auto p-[clamp(28px,4vw,48px)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-[rgba(184,137,62,0.15)] overscroll-contain" data-lenis-prevent>
      <button 
        type="button" 
        class="sticky top-0 float-right bg-paper border-none cursor-pointer text-ink-3 p-[8px] transition-all duration-[180ms] z-20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] -mt-[14px] -mr-[14px] hover:text-ink hover:scale-105 hover:bg-paper-2" 
        onclick={close} 
        aria-label="Zamknij"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h3 class="h3 mb-[24px] m-0 text-ink pr-[40px] leading-tight">{title}</h3>
      <div class="text-ink-2 leading-[1.7] text-[15px] rt">
        {@html html}
      </div>
    </div>
  </div>
{/if}
