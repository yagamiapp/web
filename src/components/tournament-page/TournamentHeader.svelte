<script>
	import defaultIcon from "../../assets/icons/white-gradient.png";

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

	let {
		banner,
		name,
		icon_url,
		x_v_x_mode,
		team_size,
		team_mode,
		score_mode,
	} = tournament;
</script>

<div class="header">
	<div class="name-box">
		<img src={icon_url} alt="tournament icon" class="icon" />
		<div class="fade">
			<div class="name">{name}</div>
		</div>
		<div class="rules">
			<div>
				Team Size {team_size}, {x_v_x_mode}v{x_v_x_mode}
			</div>
			<div>
				{teamModeEnum[team_mode]}
			</div>
			<div>
				{scoreModeEnum[score_mode]}
			</div>
		</div>
	</div>
	{#if banner}
		<div class="bg" style="background-image: url({banner})" />
	{:else}
		<div class="default bg" style="background-image: url({defaultIcon})" />
	{/if}
</div>

<style>
	.header {
		position: relative;
		height: 350px;
	}

	.bg {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center center;
	}

	.name-box {
		position: absolute;
		bottom: 0;
		height: 150px;
		width: 100%;
		background-color: rgba(5, 5, 5, 0.75);
		backdrop-filter: blur(10px);
		display: flex;
	}

	.icon {
		transform: translate(30px, -30px);
		border-radius: 25px;
		width: 150px;
		height: 150px;
	}

	.name {
		position: relative;
		top: 0;
		left: 180px;
		padding: 10px;
		font-size: 3em;
		font-weight: bold;
		white-space: nowrap;
	}

	.rules {
		position: absolute;
		padding: 10px;
		top: 0;
		height: 100%;
		text-align: right;
		color: rgba(255, 255, 255, 0.5);
		right: 0;
	}

	.fade {
		position: absolute;
		top: 0;
		left: 0;
		/* Some weird shenanigans with CSS makes it so I can't make this 100% */
		width: calc(100% - 125px);
		height: 100%;
		overflow: hidden;
		mask-image: linear-gradient(90deg, #000 80%, transparent);
		-webkit-mask-image: linear-gradient(90deg, #000 80%, transparent);
	}
</style>
