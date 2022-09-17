<script>
	const teamModeEnum = {
		0: "Head to Head",
		1: "Tag Team",
		2: "Tag Team Vs",
		3: "Team Vs",
	};

	const scoreModeEnum = {
		0: "Score",
		1: "Accuracy",
		2: "Combo",
		3: "ScoreV2",
	};

	export let tournament;
	let { score_mode, team_mode, team_size, x_v_x_mode } = tournament;
</script>

<section id="rules">
	<h1>Rules</h1>
	<ul>
		<li>Format: Team Size {team_size}, {x_v_x_mode}v{x_v_x_mode}</li>
		<li>Team type: {teamModeEnum[team_mode]}</li>
		<li>Score type: {scoreModeEnum[score_mode]}</li>
	</ul>
</section>

<style>
	section {
		padding: 20px;
		background-color: var(--bg3);
	}
</style>
