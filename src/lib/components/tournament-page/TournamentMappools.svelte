<script lang="ts">
	import Mappool from '$lib/components/common/cards/MappoolFull.svelte';

	export let tournament: db.FullyPopulatedTournament;
	let { rounds } = tournament;
</script>

<section id="mappools">
	<h1>Mappools</h1>
	{#each rounds as round}
		<Mappool {round} />
	{/each}
</section>
