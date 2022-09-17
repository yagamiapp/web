<script>
	import Mappool from "./Mappool.svelte";

	export let rounds;
	console.log(rounds);
</script>

<section id="mappools">
	<h1>Mappools</h1>
	{#each rounds as pool}
		<Mappool {pool} />
	{/each}
</section>

<style>
	section {
		padding: 20px;
	}
</style>
