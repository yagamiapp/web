<script lang="ts">
	import MatchList from '$lib/components/common/MatchList.svelte';
	import Switch from '$lib/components/common/ToggleSwitch.svelte';

	export let tournament: db.FullyPopulatedTournament;
	let section: HTMLElement;

	function toggleScoreVis(e: CustomEvent<boolean>) {
		if (e.detail) {
			section.classList.add('spoilered');
			return;
		}

		section.classList.remove('spoilered');
	}

	// Create list of rounds only including rounds with matches
	const rounds = tournament.rounds.filter((round) => round.Match.length > 0);
</script>

<section id="matches" class="spoilered" bind:this={section}>
	<h1>Matches</h1>

	<div class="spoiler">
		<span>Only show score on hover:</span>
		<Switch
			on:check={toggleScoreVis}
			checked={true}
			onColor={tournament.color}
			offColor="var(--bg1)"
			handleColor="var(--bg2)"
		/>
	</div>
	<div class="list">
		{#each rounds as round}
			<h3>{round.name}</h3>
			<MatchList matches={round.Match} />
		{/each}
	</div>
</section>

<style>
	h3 {
		width: 100%;
		padding-bottom: 5px;
		border-bottom: solid 2px var(--bg3);
	}
	.list {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
	.spoiler {
		position: absolute;
		top: 40px;
		right: 0;
		margin-right: 10px;
		gap: 10px;
		padding: 10px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		background-color: var(--bg3);
	}
</style>
