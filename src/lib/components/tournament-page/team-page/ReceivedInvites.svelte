<script lang="ts">
	import type { TeamInvite, Team, UserInTeam, User } from '@prisma/client';
	import TeamCard from '$lib/components/common/cards/Team.svelte';

	export let invites: (TeamInvite & {
		Team: Team & { Members: (UserInTeam & { User: User })[] };
	})[];
</script>

<section class="received_invites">
	<h1>Received Invites</h1>

	{#each invites as invite}
		<div class="invite">
			<TeamCard team={invite.Team} />

			<form method="POST" action="?/accept_invite">
				<input type="hidden" name="team_id" value={invite.teamId} />
				<button type="submit">Accept Invite</button>
				<button type="submit" formaction="?/reject_invite">Reject Invite</button>
			</form>
		</div>
	{/each}
</section>
