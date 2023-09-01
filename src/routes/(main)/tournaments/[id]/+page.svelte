<script lang="ts">
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import Mappools from '$lib/components/tournament-page/TournamentMappools.svelte';
	import Teams from '$lib/components/tournament-page/TournamentTeams.svelte';
	import Matches from '$lib/components/tournament-page/TournamentMatches.svelte';
	import Button from '$lib/components/common/LargeButton.svelte';

	export let data: {
		tournament: db.FullyPopulatedTournament;
		editPerms: boolean;
		sessionUserTeam: db.TeamWithMembers | null;
	};
	let { tournament, editPerms } = data;
	let { name, acronym, id, team_size } = tournament;

	$: tournament = data.tournament;
	$: sessionUserTeam = data.sessionUserTeam;
</script>

<svelte:head>
	<title>{acronym}: {name}</title>
</svelte:head>

<TournamentPageTemplate {tournament}>

	<div slot="top">
		{#if editPerms}
			<Button url="/tournaments/{id}/edit" text="EDIT TOURNAMENT" />
		{/if}
	</div>

	<nav slot="nav">
		<a href="#home">home</a>
		<a href="#mappools">mappools</a>
		{#if team_size == 1}
			<a href="#players">players</a>
		{:else}
			<a href="#teams">teams</a>
		{/if}
		<a href="#matches">matches</a>
	</nav>

	<Mappools {tournament} />
	{#key sessionUserTeam}
		<Teams {tournament} {editPerms} {sessionUserTeam} />
	{/key}
	<Matches {tournament} />

</TournamentPageTemplate>
