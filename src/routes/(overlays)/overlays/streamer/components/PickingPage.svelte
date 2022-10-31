<script>
	import Team from "./Team.svelte";
	import PickPageMap from "./PickPageMap.svelte";

	export let socketData;
	export let match;

	let scoreVisible;
	let tbMap;
	let transformString;
	$: {
		for (const team of match.Teams) {
			if (team.Picks.length > Math.floor((match.Round.best_of - 1) / 2)) {
				tbMap = team.Picks[team.Picks.length - 1];
			}
			team.Bans.length = match.Round.bans;
			team.Picks.length = Math.floor((match.Round.best_of - 1) / 2);
		}
	}
	$: {
		if (scoreVisible != socketData?.tourney?.manager?.bools?.scoreVisible) {
			scoreVisible = socketData?.tourney?.manager?.bools?.scoreVisible;

			if (scoreVisible) {
				transformString = "translateY(100%)";
			} else {
				transformString = "translateY(0)";
			}
		}
	}
</script>

<div class="picker-page" style="transform: {transformString}">
	<div class="teams">
		<div class="title">Teams</div>
		<div class="team">
			<div class="team-wrap">
				<Team
					team={match.Teams[0]}
					align="right"
					small="true"
					bestof={match.Round.best_of}
					color={match.Round.Tournament.color}
				/>
			</div>
		</div>
		<div class="team">
			<div class="team-wrap">
				<Team
					team={match.Teams[1]}
					align="right"
					small="true"
					bestof={match.Round.best_of}
					color={match.Round.Tournament.color}
				/>
			</div>
		</div>
	</div>

	<div class="bans">
		<div class="title">Bans</div>
		{#each match.Teams as team}
			<div class="ban-block">
				{#each team.Bans as ban}
					<div class="map ban">
						{#if ban}
							<PickPageMap map={ban} type="ban" />
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="picks">
		<div class="title">Picks</div>
		{#each match.Teams as team}
			<div class="ban-block">
				{#each team.Picks as pick}
					<div class="map pick">
						{#if pick}
							<PickPageMap map={pick} type="pick" />
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	{#if match.Round.best_of % 2 == 1}
		<div class="tiebreaker">
			<div class="title">Tiebreaker</div>
			<div class="map pick">
				{#if tbMap}
					<PickPageMap map={tbMap} type="pick" />
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.picker-page {
		width: 100%;
		height: 100%;
		align-items: center;
		display: flex;
		gap: 1%;
		background-color: var(--bg2);
		transition: transform 0.7s ease;
	}
	.teams {
		width: 20%;
		height: 80%;
		margin-right: calc(var(--res) / 25);
	}
	.team {
		display: flex;
		align-items: center;
		height: 50%;
	}
	.team-wrap {
		height: 30%;
		width: 100%;
	}
	.bans,
	.picks,
	.tiebreaker {
		--skew-amount: 10deg;
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 10px;
		grid-row: 1/3;
		height: 80%;
		width: fit-content;
		transform: skew(calc(-1 * var(--skew-amount)));
	}
	/* This is just to align the two pieces easier */
	.teams .title {
		opacity: 0;
	}
	.bans {
		border: solid 2px rgb(69, 32, 32);
	}
	.picks {
		border: solid 2px rgb(32, 69, 37);
	}
	.tiebreaker {
		border: solid 2px rgb(65, 65, 65);
	}
	.title {
		font-weight: bold;
		transform: skew(var(--skew-amount));
	}
	.ban-block {
		display: flex;
		gap: 5px;
		height: 50%;
	}
	.map {
		height: 100%;
		width: calc(var(--res) / 10);
		background: rgba(0, 0, 0, 0.5);
	}
</style>
