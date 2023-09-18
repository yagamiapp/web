<script lang="ts">
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import Mappools from '$lib/components/tournament-page/TournamentMappools.svelte';
	import Teams from '$lib/components/tournament-page/TournamentTeams.svelte';
	import Matches from '$lib/components/tournament-page/TournamentMatches.svelte';
	import Button from '$lib/components/common/LargeButton.svelte';
	import RegistrationButton from '$lib/components/tournament-page/RegistrationButton.svelte';
	import { scoreModeEnum, teamModeEnum } from '$lib/TournamentEnums';

	export let data: {
		tournament: db.FullyPopulatedTournament;
		editPerms: boolean;
		sessionUserTeam: db.TeamWithMembers | null;
	};
	let { tournament, editPerms } = data;
	let { name, acronym, id, team_size, x_v_x_mode, team_mode, score_mode, banner_url, color } = tournament;

	const tournamentSummary = `
	${tournament.description}
	Team Size ${tournament.team_size}, ${tournament.score_mode}
	Team Size ${team_size}, ${x_v_x_mode}v${x_v_x_mode}
	${teamModeEnum[team_mode]}
	${scoreModeEnum[score_mode]}
	`;

	$: tournament = data.tournament;
	$: sessionUserTeam = data.sessionUserTeam;
</script>

<svelte:head>
	<title>{acronym}: {name}</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content={name} />
	<meta property="og:type" content="website" />
	<meta property="og:description" content={tournamentSummary} />
	<meta property="og:image" content={banner_url} />
	<meta name="theme-color" content={color} />
</svelte:head>

<TournamentPageTemplate {tournament} header noTitle>
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
	<div slot="sub-nav">
		{#if !editPerms && !sessionUserTeam}
			<RegistrationButton url="/tournaments/{tournament.id}/teams/new" text="SIGN UP" />
		{:else if sessionUserTeam && tournament.allow_registrations}
			<RegistrationButton
				url="/tournaments/{tournament.id}/teams/{sessionUserTeam.id}"
				text={team_size == 1 ? 'MANAGE REGISTRATION' : 'MANAGE TEAM'}
			/>
		{/if}
	</div>

	<Mappools {tournament} />
	{#key sessionUserTeam}
		<Teams {tournament} />
	{/key}
	{#if !tournament.allow_registrations}
		<Matches {tournament} />
	{/if}
</TournamentPageTemplate>

<style>
	div[slot='sub-nav'] {
		width: fit-content;
		margin: auto;
	}
</style>
