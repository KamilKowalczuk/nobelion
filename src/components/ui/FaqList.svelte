<script lang="ts">
  import { slide } from 'svelte/transition';

  interface FaqItem {
    question: string;
    answer: string;
  }

  interface Props {
    data: FaqItem[];
  }

  let { data }: Props = $props();
  let openIndex = $state(0);

  function toggle(i: number) {
    openIndex = openIndex === i ? -1 : i;
  }
</script>

<div>
  {#each data as item, i}
    {@const isOpen = openIndex === i}
    <div class="nb-acc {isOpen ? 'is-open' : ''}">
      <button class="nb-acc__q" onclick={() => toggle(i)} aria-expanded={isOpen}>
        <span class="nb-acc__dot"></span>
        <span class="nb-acc__qt">{item.question}</span>
        <span class="nb-acc__ico">
          {#if isOpen}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M5 12 H19" />
            </svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M12 5 V19 M5 12 H19" />
            </svg>
          {/if}
        </span>
      </button>
      {#if isOpen}
        <div transition:slide={{ duration: 520 }}>
          <div class="nb-acc__inner">
            <p>{item.answer}</p>
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .nb-acc {
    border-bottom: 1px solid rgba(21, 23, 29, 0.10);
  }
  .nb-acc__q {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    padding: 24px 0;
  }
  .nb-acc__dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-brass);
    transform: rotate(45deg);
    transition: background 300ms;
  }
  .nb-acc.is-open .nb-acc__dot {
    background: var(--color-brass);
  }
  .nb-acc__qt {
    flex: 1;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink);
  }
  .nb-acc__ico {
    color: var(--color-brass);
    display: inline-flex;
  }
  .nb-acc__inner p {
    font-size: 15px;
    line-height: 1.7;
    color: var(--color-ink-2);
    margin: 0;
    padding: 0 0 26px 24px;
    max-width: 640px;
  }
</style>
