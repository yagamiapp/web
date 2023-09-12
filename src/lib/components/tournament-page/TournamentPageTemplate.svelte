<script lang="ts">
	import Header from '$lib/components/tournament-page/TournamentHeader.svelte';
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';

	export let tournament: db.FullyPopulatedTournament;
	export let color: string = tournament?.color;
	export let header = false;
	export let noTitle = false;
</script>

<CentreNarrowPanel --tournament-color={color}>
	<div slot="top" class="top">
		<slot name="top" />
		{#if !noTitle}
			<a href="/tournaments/{tournament.id}" class="title">
				<img src={tournament.icon_url} alt="" />
				<div class="name">{tournament.name}</div>
			</a>
		{/if}
	</div>

	{#if header}
		<Header {tournament} />
	{/if}

	{#if header}
		<div class="sticky">
			<slot name="nav" />
			<div class="line" />
			<slot name="sub-nav" />
		</div>
	{/if}

	<!-- The main content slot should be divided into <section>'s -->
	<slot />
</CentreNarrowPanel>

<style>
	.sticky {
		position: sticky;
		top: 0;
		z-index: 3;
	}
	.sticky :global(nav) {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		height: 2em;
		background-color: var(--bg2);
	}
	.sticky :global(nav a) {
		color: var(--fontColor);
		text-decoration: none;
		text-transform: uppercase;
	}
	.sticky :global(nav a:hover) {
		color: #a5a5a5;
	}

	.sticky :global(.line) {
		width: 100%;
		height: 0.5em;
		background-color: var(--tournament-color);
	}
	.title {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: white;
		font-weight: bold;
		gap: 10px;
		height: 100%;
	}
	.title img {
		width: 50px;
		height: 50px;
		border-radius: 10px;
	}
</style>
