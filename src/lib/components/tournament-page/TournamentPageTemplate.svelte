<script lang="ts">
	import Header from '$lib/components/tournament-page/TournamentHeader.svelte';
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';

    export let tournament: db.FullyPopulatedTournament;
    export let color: string = tournament.color;
    export let title: string = tournament.acronym + ': ' + tournament.name;
</script>

<CentreNarrowPanel title={title} --tournament-color={color}>

	<div slot="top">
		<slot name="top" />
	</div>

	<Header {tournament} />

	<div class="sticky">
		<slot name="nav" />
		<div class="line" />
	</div>
	
	<!-- The main content slot should be divided into <section>'s -->
    <slot />

</CentreNarrowPanel>

<style>
	.sticky {
		position: sticky;
		top: 0;
		z-index: 3;
	}
	:global(nav) {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		height: 2em;
		background-color: var(--bg2);
	}
	:global(nav a) {
		color: var(--fontColor);
		text-decoration: none;
		text-transform: uppercase;
	}
	:global(nav a:hover) {
		color: #a5a5a5;
	}

	:global(.line) {
		width: 100%;
		height: 0.5em;
		background-color: var(--tournament-color);
	}
</style>
