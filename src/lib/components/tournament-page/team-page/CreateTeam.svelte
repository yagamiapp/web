<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import Default from '$lib/assets/icons/white.svg';
	import Button from '$lib/components/tournament-page/TournamentHeaderButton.svelte';
	import type {
		ActionData,
		PageServerData
	} from '../../../../routes/(main)/tournaments/[id]/teams/new/$types';
	import Team from '../Team.svelte';
	import TournamentHeader from '../TournamentHeader.svelte';
	import EditPageSetting from '../edit-page/EditPageSetting.svelte';
	import ReceivedInvites from './ReceivedInvites.svelte';

	export let data: PageServerData;
	export let form: ActionData;

	console.log(form);

	let { tournament } = data;
	let { color } = tournament;
	let team_name: string;

	// TODO: After submission, reveal a team invites panel, instead of redirecting to the team page
	// (use:enhance)
</script>

<svelte:head>
	<title>Registering for {tournament.name}</title>
</svelte:head>

<section id="home" />
<div class="wrap" style="--theme: {color}; --tournament-color: {color};">
	<div class="top">
		<img src={Default} alt="" class="icon" />
		<div class="back">
			<Button url="/tournaments/{tournament.id}/" text="TOURNAMENT HOME" />
		</div>
	</div>
	<TournamentHeader {tournament} />
	<form method="POST" action="?/create_team">
		<h1>Create New Team</h1>

		<EditPageSetting
			name="name"
			label="Team Name"
			value={team_name}
			errors={form?.messages}
			type="text"
		/>

		<!-- TODO: team color -->
		<input type="hidden" name="color" value={color} />

		<button type="submit">Create Team</button>
	</form>

	{#if tournament.team_size > 1 && data.invites && data.invites?.length > 0}
		<!-- Show received invites with an accept invite button -->
		<ReceivedInvites invites={data.invites} />
	{/if}
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
	.back {
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
