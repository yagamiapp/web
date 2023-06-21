<script lang="ts">
	import Match from '../Match.svelte';

	export let round: db.RoundWithEverything;
	let { Match: matches } = round;
</script>

<h3>{round.name}</h3>

<div class="maps">
	{#each matches as match}
		<Match {match} />
	{/each}
</div>

<style>
	h3 {
		width: 100%;
		padding-bottom: 5px;
		border-bottom: solid 2px var(--bg3);
	}
	.maps {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
