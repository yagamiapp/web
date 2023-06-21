<script lang="ts">
	import Header from './TournamentHeader.svelte';
	import Mappools from './TournamentMappools.svelte';
	import Teams from './TournamentTeams.svelte';
	import Matches from './TournamentMatches.svelte';
	import Default from '$lib/assets/icons/white.svg';
	import EditButton from './EditButton.svelte';

	export let data: { tournament: db.FullyPopulatedTournament; editPerms: boolean };
	let { tournament, editPerms } = data;
	let { name, acronym, id, color, team_size } = tournament;
</script>

<svelte:head>
	<title>{acronym}: {name}</title>
</svelte:head>

<section id="home" />
<div class="wrap" style="--theme: {color}">
	<div class="top">
		<img src={Default} alt="" class="icon" />
		{#if editPerms}
			<div class="edit">
				<EditButton id={tournament.id} />
			</div>
		{/if}
	</div>
	<Header {tournament} />
	<div class="sticky">
		<nav>
			<a href="/t/{id}#home">home</a>
			<a href="/t/{id}#mappools">mappools</a>
			{#if team_size == 1}
				<a href="/t/{id}#players">players</a>
			{:else}
				<a href="/t/{id}#teams">teams</a>
			{/if}
			<a href="/t/{id}#matches">matches</a>
		</nav>
		<div class="line" />
	</div>
	<Mappools {tournament} />
	<Teams {tournament} />
	<Matches {tournament} />
</div>

<style>
	#home {
		position: absolute;
		top: 0;
		left: 0;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
	}

	.top {
		position: relative;
		height: 60px;
	}

	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.sticky {
		position: sticky;
		top: 0;
		z-index: 3;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		height: 2em;
		background-color: var(--bg2);
	}
	nav a {
		color: var(--fontColor);
		text-decoration: none;
		text-transform: uppercase;
	}

	nav a:hover {
		color: #a5a5a5;
	}

	.line {
		width: 100%;
		height: 0.5em;
		background-color: var(--theme);
	}

	.edit {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
	}
	@media screen and (max-width: 600px) {
		.wrap {
			margin-top: 0px;
			width: 100%;
			font-size: 0.7em;
		}
		.top .icon {
			height: 60%;
			padding: 3%;
			opacity: 0.25;
		}
	}
</style>
