<script>
	import Mappool from './Mappool.svelte';

	export let tournament;
	let { rounds } = tournament;
</script>

<section id="mappools">
	<h1>Mappools</h1>
	{#each rounds as round}
		<Mappool {round} />
	{/each}
</section>

<style>
	section {
		padding: 20px;
		z-index: 1;
	}
</style>
