<script lang="ts">
	import User from '$lib/components/common/cards/User.svelte';
	import Team from '$lib/components/common/cards/Team.svelte';

	export let tournament: db.FullyPopulatedTournament;
	let { team_size, Teams: teams } = tournament;

	// Teams are sorted by who registered first (i.e. low to high ID)
</script>

<section id={tournament.team_size == 1 ? 'players' : 'teams'}>
	<div class="title">
		<h1>{tournament.team_size == 1 ? 'Players' : 'Teams'}</h1>
	</div>

	{#if tournament.team_size == 1}
		<div class="list">
			{#each teams as team}
				<User user={team.Members[0].User} color={team.color} />
			{/each}
		</div>
	{:else}
		<div class="list">
			{#each teams as team}
				<Team {team} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.list {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
	/* All elements in the title are on the same line */
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
