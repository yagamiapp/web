<script lang="ts">
	import User from '$lib/components/common/cards/User.svelte';
	import InvitePlayer from '$lib/components/tournament-page/team-page/InvitePlayer.svelte';
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';
	import MatchList from '$lib/components/common/MatchList.svelte';
	import type { PageServerData, ActionData, LayoutServerData } from './$types';
	import Setting from '$lib/components/common/Setting.svelte';
	import { enhance, type SubmitFunction } from '$app/forms';

	export let data: PageServerData & LayoutServerData;
	export let form: ActionData;
	let { tournament, team, isTeamCaptain } = data;
	let { name, color, InBracketMatches } = team;
	$: Members = data.team.Members;

	let inTeam: boolean = false;
	function updateInTeam(memberId: number) {
		if (memberId == data.user?.id) {
			inTeam = true;
		}
		return '';
	}

	const confirmUnregister: SubmitFunction = async ({ cancel, action }) => {
		if (action.search == '?/unregister') {
			if (!confirm('Warning! This action is irreversible.\nAre you sure you want to continue?')) {
				cancel();
			}
		}
	}

	const confirmLeaveTeam: SubmitFunction = async ({ cancel }) => {
		if (!confirm('Are you sure you want to leave this team? You may not be invited back.')) {
			cancel();
		}
		else {
			inTeam = false;
		}
	}
</script>

<svelte:head>
	<title>{name} - {tournament.name}</title>
</svelte:head>

<TournamentPageTemplate {tournament}>
	{#if tournament.team_size > 1}
		<section class="team_header">
			<h1>
				Team: {name}
			</h1>
		</section>
	{/if}

	<section class="players">
		{#if tournament.team_size != 1}
			<h1>Players</h1>
		{/if}
		<div class="player_cards">
			{#each Members as member (member.User.id)}
				<User user={member.User} bind:color={color} />
				{updateInTeam(member.User.id)}
			{/each}
		</div>
		{#if inTeam && !isTeamCaptain && tournament.allow_registrations}
			<form method="POST" action="?/leave_team" use:enhance={confirmLeaveTeam}>
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

			<form id="team_settings" method="POST" action="?/update_team" use:enhance={confirmUnregister}>
				{#if tournament.team_size != 1}
					<Setting
						name="name"
						label="Team Name"
						bind:value={name}
						errors={form?.messages}
						type="text"
						placeholder="Enter team name..."
					/>
				{/if}
				<Setting
					name="color"
					label="Team Color"
					bind:value={color}
					errors={form?.messages}
					type="color"
					tooltip="Changes the accent color on your team and player cards for this tournament."
				/>
				<div class="submit-buttons">
					<button type="submit" id="update-team">Update Team</button>
					<button formaction="?/unregister" id="unregister-team">Unregister Team</button>
				</div>
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

	.submit-buttons {
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: end;
	}
	.submit-buttons button {
		margin: 0.5rem 0.5rem;
	}

	#update-team {
		border-color: rgb(15, 185, 15);
	}
	#unregister-team {
		border-color: rgb(244, 54, 54);
	}
</style>
