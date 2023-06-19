<script>
	export let match;

	let teams = match.Teams;

	// Sort picks from both teams
	// into ordered pick array
	let picks = [];
	teams[0].Picks.forEach((x) => {
		picks.push(x);
	});
	teams[1].Picks.forEach((x) => {
		picks.push(x);
	});
	picks.sort((a, b) => {
		return a.pickNumber - b.pickNumber;
	});

	function teamFromId(id) {
		return teams.find((x) => id == x.teamId);
	}
</script>

<article>
	<div class="banner">
		<div class="names">
			<span>
				{teams[0].Team.name}
			</span>
			<span>
				{teams[1].Team.name}
			</span>
		</div>
		<div class="banner-bg">
			<div class="team1">
				<img src={teams[0].Team.icon_url} alt="team 1 logo" />
			</div>
			<div class="team2">
				<img src={teams[1].Team.icon_url} alt="team 2 logo" />
			</div>
		</div>
	</div>
	<div class="fold">
		<b>Score</b>
		<div>{teams[0].score} - {teams[1].score}</div>
		<div class="map-list">
			<b>Bans</b>

			<div>
				<span>{teams[0].Team.name}: </span>
				{#each teams[0].Bans as ban}
					<span>
						{ban.mapIdentifier}
					</span>
				{/each}
			</div>
			<div>
				<span>{teams[1].Team.name}: </span>
				{#each teams[1].Bans as ban}
					<span>
						{ban.mapIdentifier}
					</span>
				{/each}
			</div>
		</div>
		<div class="map-list">
			<b>Picks</b>
			{#each picks as pick}
				<div>
					{pick.mapIdentifier}, won by {teamFromId(pick.wonByTeamId)?.Team?.name}
				</div>
			{/each}
		</div>
	</div>
</article>

<style>
	article {
		width: 45%;
		z-index: 0;
	}
	.fold {
		margin: auto;
		position: relative;
		background-color: var(--bg3);
		width: 90%;
		top: -30px;
		padding: 10px;
		padding-top: 40px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.banner {
		position: relative;
		width: 100%;
		height: 75px;
		border-radius: 25px;
		overflow: hidden;
		z-index: 3;
	}
	.banner-bg {
		z-index: -1;
	}
	.names {
		font-weight: bold;
		z-index: 1;
		display: flex;
	}
	.names span {
		display: grid;
		overflow: hidden;
		width: 50%;
		height: 75px;
		place-items: center;
	}
	.banner img {
		position: absolute;
		top: 0;
		left: 0;
		background-color: var(--bg1);
		width: 100%;
		height: 100%;
		filter: blur(3px) brightness(0.5);
		z-index: -1;
	}
	.banner::after {
		position: absolute;
		top: -50%;
		left: 49.5%;
		content: '';
		box-shadow: 0 0 5px 1px #000;
		width: 0.5%;
		height: 200%;
		transform: rotate(45deg);
		background: #000000;
	}
	.banner .team1 img {
		mask-image: linear-gradient(135deg, #000 0%, #000 50%, transparent 50%);
		-webkit-mask-image: linear-gradient(135deg, #000 0%, #000 50%, transparent 50%);
	}
	.banner .team2 img {
		mask-image: linear-gradient(-45deg, #000 0%, #000 50%, transparent 50%);
		-webkit-mask-image: linear-gradient(-45deg, #000 0%, #000 50%, transparent 50%);
	}
</style>
