<script lang="ts">
	import { invalidate } from '$app/navigation';
	import TournamentHeaderButton from '$lib/components/common/LargeButton.svelte';
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import CreateTeam from '$lib/components/tournament-page/team-page/CreateTeam.svelte';
	import { onDestroy } from 'svelte';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
	let { tournament } = data;

	onDestroy(() => {
		invalidate('tournament:teams');
	});
</script>

<svelte:head>
	<title>Register for {tournament.name}</title>

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:title" content="Register for {tournament.name}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content={tournament.allow_registrations ? 'Registrations still open.' : 'Registrations currently closed.'} />
	<meta property="og:image" content={tournament.banner_url} />
	<meta name="theme-color" content={tournament.color} />
</svelte:head>

{#if tournament.team_size == 1}
	<TournamentPageTemplate {tournament}>
		<section>
			<h1>Registration</h1>

			<p>{data.feedback}</p>

			<TournamentHeaderButton url="/tournaments/{data.tournament.id}/" text={'BACK'} />
		</section>
	</TournamentPageTemplate>
{:else}
	<CreateTeam {data} {form} />
{/if}
