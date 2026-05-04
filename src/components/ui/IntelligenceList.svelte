<script lang="ts">
    import AccordionItem from './AccordionItem.svelte';

    interface FAQItem {
        question: string;
        answer: string;
    }

    let { data }: { data: FAQItem[] } = $props();
    let openIndex = $state<number | null>(0); // Pierwszy otwarty domyślnie

    function toggle(index: number) {
        if (openIndex === index) {
            openIndex = null;
        } else {
            openIndex = index;
        }
    }
</script>

<div class="flex flex-col">
    {#each data as item, i}
        <AccordionItem 
            question={item.question} 
            answer={item.answer} 
            isOpen={openIndex === i} 
            onToggle={() => toggle(i)}
        />
    {/each}
</div>