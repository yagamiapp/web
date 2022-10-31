<script>
	import Score from "./Score.svelte";

	export let bestof = 9;
	export let team;
	export let color;
	export let align;
	export let small = false;

	let textStyle = "font-size: 1.5em";
	if (small) {
		textStyle = "font-size:0.8em";
	}

	let alignTypes = {
		right: "row-reverse",
		left: "row",
	};
	let flexType = {
		right: "flex-end",
		left: "flex-start",
	};
</script>

<div class="base" style="flex-direction: {alignTypes[align]}">
	<img src={team.Team.icon_url} alt="" />
	<div class="stat-box" style="align-items: {flexType[align]}">
		<div class="name" style={textStyle}>
			{team.Team.name}
		</div>
		<Score {color} {align} {bestof} score={team.score} />
	</div>
</div>

<style>
	.base {
		display: flex;
		height: 100%;
		gap: 3%;
	}
	.base img {
		border-radius: 5px;
	}
	.name {
		white-space: nowrap;
		font-size: 1.5em;
		font-family: "Montserrat-Bold", sans-serif;
	}
	.stat-box {
		display: flex;
		flex-direction: column;
		gap: 5%;
		justify-content: space-evenly;
	}
</style>
