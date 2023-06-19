<script>
	import Map from "./Map.svelte";

	export let maps;

	let el;
	let dark;

	export const openModal = () => {
		el.classList.remove("closed");
		dark.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		dark.style.pointerEvents = "all";
	};
	export const closeModal = () => {
		el.classList.add("closed");
		dark.style.backgroundColor = "rgba(0, 0, 0, 0)";
		dark.style.pointerEvents = "none";
	};
</script>

<article class="modal">
	<div class="maps">
		{#each maps as map}
			<Map {map} />
		{/each}
	</div>
</article>
<div class="dark" on:click={closeModal} />

<style>
	.dark {
	}
</style>
