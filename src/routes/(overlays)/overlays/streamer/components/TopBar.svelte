<script>
	import Team from "./Team.svelte";
	export let match;
	let tournament = match.Round.Tournament;

	// console.log(match.Teams);
</script>

<div class="base">
	<div class="team1">
		<Team align="left" />
	</div>
	<div class="logo-box">
		<img src={tournament.icon_url} alt="logo" />
		<div class="name">{tournament.name}</div>
	</div>
	<div class="team2">
		<Team align="right" />
	</div>
</div>

<style>
	.base {
		width: 100%;
		height: 100%;
		background: var(--bg2);
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
		font-size: calc(var(--res) / 50);
		font-family: "Quicksand", sans-serif;
		font-weight: bold;
	}
</style>
