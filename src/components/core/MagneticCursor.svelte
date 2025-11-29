<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  // Fizyka sprężyny dla maślanego ruchu 
  let coords = spring({ x: 0, y: 0 }, {
    stiffness: 0.15,
    damping: 0.7
  });

  let size = spring(10, {
    stiffness: 0.1,
    damping: 0.5
  });

  let isHovering = false;

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      coords.set({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => {
        isHovering = true;
        size.set(64); // Powiększenie przy hoverze
    };

    const handleHoverEnd = () => {
        isHovering = false;
        size.set(10); // Powrót do kropki
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Globalne wykrywanie elementów interaktywnych
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
</script>

<div 
  class="fixed top-0 left-0 pointer-events-none z-9999 rounded-full mix-blend-difference flex items-center justify-center"
  style="
    transform: translate3d({$coords.x}px, {$coords.y}px, 0) translate(-50%, -50%);
    width: {$size}px;
    height: {$size}px;
    background-color: #C5A059; 
  "
>
{#if isHovering}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-void animate-fade-in">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
        </svg>
    {/if}
</div>

<style>
    /* Płynne znikanie systemowego kursora na body zdefiniujemy w global.css, 
       ale tutaj upewniamy się, że nasz element nie blokuje kliknięć (pointer-events-none) */
</style>