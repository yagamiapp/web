<script lang="ts">
	import Mappool from '$lib/components/common/cards/MappoolFull.svelte';

	export let tournament: db.FullyPopulatedTournament;
	let { rounds } = tournament;
	let mappoolCount = 0;

	function incrCount() {
		mappoolCount++;
		return "";
	}
</script>

<section id="mappools">
	<h1>Mappools</h1>
	{#each rounds as round}
		{#if round.mappool}
			{incrCount()}
			<Mappool {round} />
		{/if}
	{/each}
	{#if mappoolCount === 0}
		<p>No mappool(s) released yet.</p>
	{/if}
</section>
