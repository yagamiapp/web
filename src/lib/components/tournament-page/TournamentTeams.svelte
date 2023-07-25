<script lang="ts">
	import User from '$lib/components/common/cards/User.svelte';
	import Team from '$lib/components/common/cards/Team.svelte';
	import Button from '$lib/components/common/LargeButton.svelte';

	export let tournament: db.FullyPopulatedTournament;
	export let editPerms: boolean;
	export let sessionUserTeam: db.TeamWithMembers | null;
	let { team_size, Teams } = tournament;
</script>

<section id={tournament.team_size == 1 ? 'players' : 'teams'}>
	<div class="title">
		<h1>{tournament.team_size == 1 ? 'Players' : 'Teams'}</h1>
		{#if !editPerms && !sessionUserTeam}
			<Button url="/tournaments/{tournament.id}/teams/new" text="SIGN UP" />
		{:else if sessionUserTeam}
			<Button
				url="/tournaments/{tournament.id}/teams/{sessionUserTeam.id}"
				text={team_size == 1 ? 'MANAGE PLAYER CARD' : 'MANAGE TEAM'}
			/>
		{/if}
	</div>

	{#if tournament.team_size == 1}
		<div class="list">
			{#each Teams as team}
				<User user={team.Members[0].User} color={team.color} />
			{/each}
		</div>
	{:else}
		<div class="list">
			{#each Teams as team}
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
