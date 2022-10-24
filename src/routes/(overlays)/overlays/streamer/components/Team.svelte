<script>
	import { onMount } from "svelte";
	import Score from "./Score.svelte";

	export let bestof = 9;
	export let team;
	export let color;
	export let align;
	let alignTypes = {
		right: "row-reverse",
		left: "row",
	};
	let flexType = {
		right: "flex-end",
		left: "flex-start",
	};

	let score;

	onMount(() => {
		score.setScore(2);
	});
</script>

<div class="base" style="flex-direction: {alignTypes[align]}">
	<img src={team.Team.icon_url} alt="" />
	<div class="stat-box" style="align-items: {flexType[align]}">
		<div class="name">
			{team.Team.name}
		</div>
		<Score bind:this={score} {color} {align} {bestof} score={team.score} />
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
		font-size: 2em;
		font-family: "Montserrat-Bold", sans-serif;
	}
	.stat-box {
		display: flex;
		flex-direction: column;
		gap: 5%;
		justify-content: center;
	}
</style>
