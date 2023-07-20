<script lang="ts">
	import TournamentHeaderButton from '$lib/components/tournament-page/TournamentHeaderButton.svelte';
	import CreateTeam from '$lib/components/tournament-page/team-page/CreateTeam.svelte';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
	let { tournament } = data;
</script>

<div class="wrap">
	{#if tournament.team_size == 1}
		<h1>Registration</h1>

		<p>{data.feedback}</p>

		<TournamentHeaderButton url="/tournaments/{data.tournament.id}" text={'BACK'} />
	{:else}
		<CreateTeam {data} {form} />
	{/if}
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
