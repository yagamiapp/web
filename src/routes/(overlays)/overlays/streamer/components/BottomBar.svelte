<script>
	import { onMount } from "svelte";

	export let socketData;

	let barNum;
	$: barNum =
		socketData?.tourney?.manager?.gameplay?.score?.left -
		socketData?.tourney?.manager?.gameplay?.score?.right;

	function getProperWidth(n) {
		return Math.sqrt(Math.abs(n)) / 1050;
	}

	let bar;
	$: {
		console.log(getProperWidth(barNum));
		try {
			bar.style.width = `calc(50% * ${getProperWidth(barNum)})`;
			if (barNum < 0) {
				bar.style.right = `calc(50% - (50% * ${getProperWidth(
					barNum
				)}))`;
			} else {
				bar.style.right = "50%";
			}
		} catch (e) {
			console.log("Bar does not exist yet");
		}
	}
</script>

<div class="base">
	<div class="left-score">
		{socketData?.tourney?.manager?.gameplay?.score?.left}
	</div>
	<div class="bar" bind:this={bar} />
	<div class="right-score">
		{socketData?.tourney?.manager?.gameplay?.score?.right}
	</div>
</div>

<style>
	.base {
		position: relative;
		background-color: var(--bg2);
		height: 100%;
		width: 100%;
	}
	.bar {
		position: absolute;
		top: 0;
		right: 50%;
		background-color: aliceblue;
		height: 20px;
		transition: all 0.1s ease;
	}
</style>
