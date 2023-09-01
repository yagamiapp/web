<script lang="ts">
	import List from '$lib/components/common/drag-and-drop/List.svelte';
	import DraggableTeam from '$lib/components/tournament-page/match/DraggableTeam.svelte';
	import MatchController from '$lib/components/tournament-page/match/MatchController.svelte';
	import type { ActionData, PageServerData } from './$types';
	import CompactMatchCard from '$lib/components/tournament-page/match/CompactMatchCard.svelte';

	export let data: PageServerData;
	export let form: ActionData;
	let { tournamentName, teams, rounds } = data;
	let selectedMatch: db.MatchWithTeams | undefined = undefined;

	function onDrop(updatedTeams: db.TeamWithMembersAndMatches[]) {
		teams = updatedTeams;
	}

	$: if (form?.status == 200) {
		selectedMatch = form.match;

		// Update round match list
		if (selectedMatch != undefined) {
			rounds.find((round) => round.id == selectedMatch?.roundId)?.Match.push(selectedMatch);
		}
	}
</script>

<svelte:head>
	<title>Matches - Staff View - {tournamentName}</title>
</svelte:head>

<div class="matches">
	<h1>Matches</h1>

	<div class="match-list">
		{#key rounds}
			{#each rounds as round (round.id)}
				<div class="round">
					<h2>{round.name}</h2>
					{#each round.Match as match}
						<CompactMatchCard
							{match}
							selected={selectedMatch?.id == match.id}
							on:select={() => (selectedMatch = match)}
						/>
					{/each}
				</div>
			{/each}
		{/key}
	</div>

	<MatchController {rounds} {form} bind:selectedMatch />
</div>

<div class="idle-teams">
	<h1>Idle Teams</h1>

	<div class="team-list">
		<List
			itemsData={teams}
			itemComponent={DraggableTeam}
			{onDrop}
			dropTargetStyle={{
				border: '0.2rem dashed yellow',
				'border-radius': '0.3rem',
				padding: '0.3rem'
			}}
		/>
	</div>
</div>

<style>
	:global(main) {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		background-color: var(--bg3);
	}
	div {
		margin: 0.4rem;
	}
	h1 {
		margin-left: 3%;
		margin-right: 3%;
		border-bottom: 0.2rem solid var(--bg1);
	}

	.matches {
		width: 75%;
		background-color: var(--bg3);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.idle-teams {
		border: 0.2rem solid var(--bg1);
		width: 25%;
		background-color: var(--bg4);
	}
	.team-list {
		margin-left: 3%;
		margin-right: 3%;
		width: 94%;
		padding: 0.2rem;
	}
	.team-list :global(section) {
		display: absolute;
		padding: 0.5rem;
		height: 100vh;
	}

	.match-list {
		align-self: stretch;
		height: 60vh;
		overflow: scroll;
	}
	.round {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.round h2 {
		width: calc(100% - 10px * 2);
		margin-left: 10px;
		border-bottom: 0.2rem solid var(--bg2);
	}
</style>
