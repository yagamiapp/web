<script lang="ts">
	import Map from '$lib/components/common/cards/Map.svelte';

	export let maps: db.MapInPoolWithMap[];

	let el: HTMLDivElement;
	let dark: HTMLDivElement;

	export const openModal = () => {
		el.classList.remove('closed');
		dark.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		dark.style.pointerEvents = 'all';
	};
	export const closeModal = () => {
		el.classList.add('closed');
		dark.style.backgroundColor = 'rgba(0, 0, 0, 0)';
		dark.style.pointerEvents = 'none';
	};
</script>

<article class="modal">
	<div class="maps">
		{#each maps as map}
			<Map {map} />
		{/each}
	</div>
</article>
<div class="dark" on:keydown={closeModal} on:click={closeModal} />

<style>
	.dark {
	}
</style>
