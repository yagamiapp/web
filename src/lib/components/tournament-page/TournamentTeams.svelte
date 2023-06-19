<script>
	import UserCard from "$lib/components/UserCard.svelte";
	import Team from "./Team.svelte";

	export let tournament;
	let teams = tournament.Teams;
</script>

{#if tournament.team_size == 1}
	<section id="players">
		<h1>Players</h1>

		<div class="list">
			{#each teams as team}
				<UserCard user={team.Members[0].User} color={team.color} />
			{/each}
		</div>
	</section>
{:else}
	<section id="teams">
		<h1>Teams</h1>

		<div class="list">
			{#each teams as team}
				<Team {team} />
			{/each}
		</div>
	</section>
{/if}

<style>
	section {
		background-color: var(--bg3);
		padding: 20px;
		z-index: 1;
	}
	.list {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
