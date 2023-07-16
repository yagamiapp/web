<script lang="ts">
	import Player from './TeamUser.svelte';

	export let team: db.TeamWithMembers;
	export let averageRank: number | null = null;

	let avgRank: string;
	if (averageRank) {
		avgRank = averageRank.toFixed(0);
		avgRank = parseInt(avgRank).toLocaleString();
	}
</script>

<div class="team" style="--color:{team.color}">
	<div class="name">
		<a href="/tournaments/{team.tournamentId}/teams/{team.id}">{team.name}</a>
	</div>

	<div class="icon">
		<img src={team.icon_url} alt="" />
	</div>
	<div class="line" />
	<div class="players">
		{#each team.Members as member}
			<Player user={member.User} />
		{/each}
	</div>
	{#if avgRank}
		<div class="avg">
			Average Rank: #{avgRank}
		</div>
	{/if}
</div>

<style>
	.players {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
	.team {
		position: relative;
		width: calc(100% - 20px * 2);
		background: var(--bg1);
		min-height: 125px;
		border-radius: 25px;
		margin-top: 60px;
		display: flex;
		align-items: center;
		z-index: 0;
	}

	.name {
		position: absolute;
		top: -40px;
		left: 0;
		background-color: var(--bg1);
		padding: 15px;
		font-size: 1.25em;
		padding-bottom: 50px;
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
		z-index: -1;
	}

	.icon {
		display: grid;
		place-items: center;
		width: 125px;
		height: 100%;
	}

	.icon img {
		width: 90px;
		height: 90px;
		border-radius: 15px;
	}

	.line {
		width: 5px;
		height: 75%;
		background: var(--color);
		border-radius: 3px;
	}
	.players {
		width: 100%;
	}
	.avg {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 10px;
		color: rgba(255, 255, 255, 0.5);
	}

	a {
		text-decoration: none;
		color: inherit;
	}
	a:hover {
		text-decoration: underline;
	}
</style>
