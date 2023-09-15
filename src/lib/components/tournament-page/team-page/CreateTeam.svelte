<script lang="ts">
	import Button from '$lib/components/common/LargeButton.svelte';
	import type {
		ActionData,
		PageServerData
	} from '../../../../routes/(main)/tournaments/[id]/teams/new/$types';
	import Setting from '$lib/components/common/Setting.svelte';
	import ReceivedInvites from '$lib/components/tournament-page/team-page/ReceivedInvites.svelte';
	import TournamentPageTemplate from '$lib/components/tournament-page/TournamentPageTemplate.svelte';

	export let data: PageServerData;
	export let form: ActionData;

	console.log(form);

	let { tournament } = data;
	let { color } = tournament;
	let team_name: string;
</script>

<TournamentPageTemplate {tournament}>
	<div slot="top">
		<Button url="/tournaments/{tournament.id}/" text="TOURNAMENT HOME" />
	</div>

	<section class="new_team_form">
		<form method="POST" action="?/create_team">
			<h1>Create New Team</h1>
	
			<Setting
				name="name"
				label="Team Name"
				value={team_name}
				errors={form?.messages}
				type="text"
			/>
	
			<Setting
				name="color"
				label="Team Color"
				value={color}
				errors={form?.messages}
				type="color"
			/>
			
			<button type="submit">Create Team</button>
		</form>
	</section>

	{#if tournament.team_size > 1 && data.invites && data.invites?.length > 0}
		<!-- Show received invites with an accept invite button -->
		<ReceivedInvites invites={data.invites} />
	{/if}
</TournamentPageTemplate>
