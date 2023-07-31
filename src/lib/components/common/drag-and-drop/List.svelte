<!-- Inspired by the Generic List Component example on 'svelte-dnd-action' -->
<script lang="ts">
	import {dndzone, type DndEvent} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';

	export let itemsData: { [index: string]: any }[];
	export let itemComponent: ConstructorOfATypedSvelteComponent;
	export let onDrop: Function;
    // Type determines which lists are compatible with each other
    export let type: string = itemComponent.name;
	export let idPropertyName: string = "id";
	export let flipDurationMs: number = 300;
    export let dropTargetStyle: Record<string, string> = {};
	export let dropFromOthersDisabled: boolean = false;
	
	function handleConsider(e: CustomEvent<DndEvent<any>>) {
		itemsData = e.detail.items;
	}
	function handleFinalize(e: CustomEvent<DndEvent<any>>) {
		onDrop(e.detail.items);
	}
</script>

<section 
	use:dndzone={{ items: itemsData, type, flipDurationMs, dropTargetStyle, dropFromOthersDisabled }} 
	on:consider={handleConsider} 
	on:finalize={handleFinalize}
>
	{#each itemsData as item (item[idPropertyName])}
        <div animate:flip={{duration: flipDurationMs}}>
            <svelte:component this={itemComponent} {item}/>		
        </div>
	{/each}
</section>

<style>
	section {
		padding: 0.4em;
		overflow: scroll;
	}
</style>