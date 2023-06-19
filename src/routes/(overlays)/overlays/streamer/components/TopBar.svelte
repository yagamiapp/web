<script>
	import Team from './Team.svelte';
	export let match;
	let tournament = match.Round.Tournament;

	// console.log(match.Teams);
</script>

<div class="base">
	<div class="team1">
		<Team
			align="left"
			bestof={match.Round.best_of}
			team={match.Teams[0]}
			color={match.Round.Tournament.color}
		/>
	</div>
	<div class="logo-box">
		<img src={tournament.icon_url} alt="logo" />
		<div class="name">{tournament.name}</div>
	</div>
	<div class="team2">
		<Team
			align="right"
			bestof={match.Round.best_of}
			team={match.Teams[1]}
			color={match.Round.Tournament.color}
		/>
	</div>
</div>

<style>
	.base {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--bg2);
		font-size: calc(var(--res) / 50);
		display: flex;
		justify-content: center;
	}
	.logo-box {
		width: fit-content;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.logo-box img {
		height: 75%;
		aspect-ratio: 1;
		border-radius: 1000px;
	}
	.logo-box .name {
		font-family: 'Quicksand', sans-serif;
		font-weight: bold;
	}
	.team1,
	.team2 {
		position: absolute;
		top: 5px;
		bottom: 5px;
	}
	.team1 {
		left: 5px;
	}
	.team2 {
		right: 5px;
	}
</style>
