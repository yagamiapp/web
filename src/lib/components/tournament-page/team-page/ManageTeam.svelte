<script lang="ts">
    import Default from '$lib/assets/icons/white.svg';
	import MatchCard from '$lib/components/Match.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
    import Button from '$lib/components/tournament-page/TournamentHeaderButton.svelte'
	import TournamentHeader from '../TournamentHeader.svelte';

    export let data: any;
    let { tournament, team, isTeamCaptain } = data;
    let { name, Members, color, InBracketMatches } = team;
</script>

<svelte:head>
	<title>{name} - {tournament.name}</title>
</svelte:head>

<section id="home" />
<div class="wrap" style="--theme: {color}">
	<div class="top">
		<img src={Default} alt="" class="icon" />
        <div class="back">
            <Button url="/tournaments/{tournament.id}/" text="TOURNAMENT HOME" />
        </div>
	</div>
	<TournamentHeader {tournament} />
	<div>
		<h1>
			{tournament.team_size == 1 ? "Player: " : "Team: "}
			{team.name}
		</h1>
	</div>

    <div class="players">
        {#if tournament.team_size != 1}
			<h1>Players</h1>
        {/if}
		{#each Members as member}
            <UserCard user={member.User} {color}/>
        {/each}
    </div>

    {#if isTeamCaptain}
        <div class="settings">
            <h1>Team Settings</h1>

            <!-- TODO: Add team color picker -->
        </div>

        {#if tournament.team_size != 1}
            <div class="invites">
                <h1>Team Invites</h1>
            </div>
        {/if}
    {/if}

	<div class="Matches">
		<h1>Match History</h1>

		{#if InBracketMatches.length > 0}
			{#each InBracketMatches as teamInMatch}
				<MatchCard match={teamInMatch.Match} />
			{/each}
		{:else}
			<p>This team has not played any matches yet.</p>
		{/if}
	</div>
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