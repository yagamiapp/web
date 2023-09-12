<script lang="ts">
	import User from '$lib/components/common/cards/User.svelte';
	import Button from '$lib/components/common/LargeButton.svelte';
	import InvitePlayer from '$lib/components/tournament-page/team-page/InvitePlayer.svelte';
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import MatchList from '$lib/components/common/MatchList.svelte';
	import type { PageServerData, ActionData, LayoutServerData } from './$types';
	import EditPageSetting from '$lib/components/tournament-page/edit-page/EditPageSetting.svelte';

	export let data: PageServerData & LayoutServerData;
	export let form: ActionData;
	let { tournament, team, isTeamCaptain } = data;
	let { name, Members, color, InBracketMatches } = team;

	let inTeam: boolean = false;
	function updateInTeam(memberId: number) {
		if (memberId == data.user?.id) {
			inTeam = true;
		}
		return '';
	}
</script>

<svelte:head>
	<title>{name} - {tournament.name}</title>
</svelte:head>

<TournamentPageTemplate {tournament}>
	{#if tournament.team_size > 1}
		<section class="team_header">
			<h1>
				Team: {team.name}
			</h1>
		</section>
	{/if}

	<section class="players">
		{#if tournament.team_size != 1}
			<h1>Players</h1>
		{/if}
		<div class="player_cards">
			{#each Members as member}
				<User user={member.User} {color} />
				{updateInTeam(member.User.id)}
			{/each}
		</div>
		{#if inTeam && !isTeamCaptain}
			<form method="POST" action="?/leave_team">
				<button type="submit">Leave Team</button>
			</form>
		{/if}
		{#if form?.left}
			<span class="success">{form.left}</span>
		{/if}
	</section>

	{#if isTeamCaptain && tournament.allow_registrations}
		<section class="settings">
			<h1>Team Settings</h1>

			<form id="team_settings" method="POST" action="?/update_team">
				{#if tournament.team_size != 1}
					<EditPageSetting
						name="name"
						label="Team Name"
						value={name}
						errors={form?.messages}
						type="text"
					/>
				{/if}
				<EditPageSetting
					name="color"
					label="Team Color"
					value={color}
					errors={form?.messages}
					type="color"
				/>
				<button type="submit">Update Team</button>
			</form>

			<form id="unregister" method="POST" action="?/unregister">
				Registrations are still open.
				<button type="submit">Unregister Team?</button>
			</form>
		</section>

		{#if tournament.team_size != 1 && tournament.allow_registrations}
			<section class="invites">
				<h1>Team Invites</h1>

				{#if team.Members.length < tournament.team_size}
					<InvitePlayer {data} {form} />
				{:else}
					<p>Your team is full. You can't invite anymore players.</p>
				{/if}
			</section>
		{/if}
	{/if}

	<section class="matches">
		<h1>Matches</h1>
		<MatchList teamInMatches={InBracketMatches} />
	</section>
</TournamentPageTemplate>

<style>
	.player_cards {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
