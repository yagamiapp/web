<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import User from '$lib/components/common/cards/User.svelte';
	import type { TeamInvite } from '@prisma/client';

	export let data: db.FullyPopulatedTournament & (TeamInvite & { Team: db.TeamWithMembers }); ;
	export let form: any;
	if (form) console.log(form);

	let player_id: string;
	let loading = false;
	$: suggestedUserInvite = null;

	const playerSearch: SubmitFunction = async () => {
		loading = true;

		return async ({ update, result }) => {
			loading = false;
			await update();

			if (result.status == 200) {
				suggestedUserInvite = result.data.user;
			}
		};
	};
</script>

<div id="player_search">
	<form method="POST" action="?/player_search" use:enhance={playerSearch}>
		<label for="player_id">Search for Player: </label>
		<input
			bind:value={player_id}
			type="text"
			name="player_id"
			id="player_id"
			placeholder="Username or ID (e.g. ..ppy.sh/users/''17258960'')"
			autocomplete="off"
		/>

		{#if form?.error}
			<span class="error">{form.error}</span>
		{/if}

		{#if suggestedUserInvite && !loading}
			{#key suggestedUserInvite}
				<User bind:user={suggestedUserInvite} color={data.tournament.color} />
			{/key}

			<form
				method="POST"
				action="?/invite_player"
				use:enhance
				on:submit={() => (suggestedUserInvite = null)}
			>
				<button name="invite_player" id="invite_player" value={suggestedUserInvite.id}
					>Send Invite</button
				>
			</form>

			{#if form?.success}
				<span>{form.success}</span>
			{/if}
		{:else if loading}
			<br /><LoadingSpinner />
		{/if}
	</form>
</div>

<div class="pending">
	<h2>Pending invites:</h2>

	{#each data.invites as invite (invite.inviteeUserId)}
		<div class="invite">
			<User user={invite.Invitee} color={data.tournament.color} />
			<form method="POST" action="?/cancel_invite" use:enhance>
				<button
					type="submit"
					name="cancel_invite"
					class="cancel_invite"
					value={invite.inviteeUserId}>Cancel Invite</button
				>
			</form>

			{#if form?.cancelErrorId == invite.inviteeUserId}
				<span class="error">{form.cancelError}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.pending {
		display: flex;
		flex-direction: column;
	}
	.pending .invite {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 0.4rem;
		margin-left: 5%;
	}
	label,
	.error {
		font-size: 16px;
		height: min-content;
		margin-left: 2rem;
	}
	input {
		color: var(--font-color);
		outline: none;

		font-family: inherit;
		font-size: inherit;

		border: solid 2px var(--font-color);
		border-radius: 6px;
		padding: 5px;
		margin-bottom: 2rem;
		transition: border-color 200ms ease;
		background-color: var(--bg1);
	}
	input[type='text'] {
		width: 30rem;
	}
	input:focus {
		border: solid 2px var(--tournament-color);
	}
	span {
		visibility: hidden;
	}
	.error {
		visibility: visible;
		color: tomato;
	}
	#invite_player {
		display: inline-block;
	}
</style>
