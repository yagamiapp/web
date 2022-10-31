<script>
	import Chat from "./Chat.svelte";
	import Map from "./Map.svelte";
	export let socketData;
	export let ws;
	export let match;

	let barNum;
	$: barNum =
		socketData?.tourney?.manager?.gameplay?.score?.left -
		socketData?.tourney?.manager?.gameplay?.score?.right;

	function getWidth() {
		return Math.sqrt(Math.abs(barNum)) / 1050 > 0.69
			? 0.69
			: Math.sqrt(Math.abs(barNum)) / 1050;
	}

	let bar;
	let left;
	let right;
	let score;
	let scoreVisible;
	let transformString;

	$: {
		try {
			bar.style.width = `calc(50% * ${getWidth()})`;
			if (barNum < 0) {
				bar.style.right = `calc(50% - (50% * ${getWidth()}))`;

				left.style.scale = "1.0";
				right.style.scale = "1.05";
				left.style.fontWeight = "normal";
				right.style.fontWeight = "bold";
				score.style.left = `calc(50% * ${getWidth()})`;
			} else if (barNum == 0) {
				left.style.scale = "1.0";
				right.style.scale = "1.0";
				left.style.fontWeight = "normal";
				right.style.fontWeight = "normal";
				score.style.left = "0";
			} else {
				bar.style.right = "50%";
				left.style.scale = "1.05";
				right.style.scale = "1.0";
				left.style.fontWeight = "bold";
				right.style.fontWeight = "normal";
				score.style.left = `calc(-50% * ${getWidth()})`;
			}
			if (
				scoreVisible !=
				socketData?.tourney?.manager?.bools?.scoreVisible
			) {
				scoreVisible =
					socketData?.tourney?.manager?.bools?.scoreVisible;

				if (scoreVisible) {
					transformString = "translateY(0)";
				} else {
					transformString = "translateY(-150%)";
				}
			}
		} catch (e) {
			console.log("Bar does not exist yet");
		}
	}
</script>

<div class="base">
	<div
		class="score-container"
		bind:this={score}
		style="transform: {transformString}"
	>
		<div class="left-score" bind:this={left}>
			{socketData?.tourney?.manager?.gameplay?.score?.left.toLocaleString()}
		</div>
		<div class="right-score" bind:this={right}>
			{socketData?.tourney?.manager?.gameplay?.score?.right.toLocaleString()}
		</div>
	</div>

	<div class="bar" bind:this={bar} />
	<div class="map">
		<Map {socketData} {match} {ws} />
	</div>
	<Chat {socketData} />
</div>

<style>
	.base {
		position: relative;
		background-color: var(--bg2);
		height: 100%;
		width: 100%;
		z-index: 1;
		overflow: hidden;
		transition: transform 0.7s ease;
	}
	.bar {
		position: absolute;
		top: 0;
		right: 50%;
		background-color: aliceblue;
		height: calc(var(--res) / 40);
		transition: all 0.1s ease;
	}
	.score-container {
		position: absolute;
		justify-content: center;
		width: 100%;
		gap: 10px;
		top: calc(var(--res) / 40);
		display: flex;
		transition: left 0.1s ease;
	}
	.score-container > * {
		width: 15%;
		font-size: calc(var(--res) / 22);
	}
	.left-score {
		text-align: right;
	}

	.map {
		position: absolute;
		bottom: 0;
		height: 100%;
		width: 100%;
		left: 0;
		z-index: -1;
	}
</style>
