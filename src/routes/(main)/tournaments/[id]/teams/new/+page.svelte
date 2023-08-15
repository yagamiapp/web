<script lang="ts">
	import { invalidate } from '$app/navigation';
	import TournamentHeaderButton from '$lib/components/common/LargeButton.svelte';
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import CreateTeam from '$lib/components/tournament-page/team-page/CreateTeam.svelte';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
	let { tournament } = data;
</script>

<svelte:head>
	<title>Register for {tournament.name}</title>
</svelte:head>

{#if tournament.team_size == 1}
	<TournamentPageTemplate {tournament}>
		<section>
			<h1>Registration</h1>

			<p>{data.feedback}</p>

			<TournamentHeaderButton url="/tournaments/{data.tournament.id}" text={'BACK'} />
			<!-- TODO: Fix bug that this button doesn't refresh the tournament page, so the player doesn't appear in the player list until the page is reloaded -->
			<!-- Note: I tried using on:change(() => {invalidate...}) but it didn't work -->
		</section>
	</TournamentPageTemplate>
{:else}
	<CreateTeam {data} {form} />
{/if}
