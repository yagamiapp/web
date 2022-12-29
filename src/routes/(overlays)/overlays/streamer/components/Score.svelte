<script>
	import { onMount } from "svelte";

	export let bestof;
	export let align;
	export let color;
	export let score = 0;

	let alignTypes = {
		right: "row-reverse",
		left: "row",
	};

	let max = Math.ceil(bestof / 2);
	let scoreBoxes = new Array(max).fill("transparent");

	$: {
		for (let i = 0; i < scoreBoxes.length; i++) {
			if (i < score) {
				scoreBoxes[i] = "white";
			}
		}
	}

	let list;

	export function setScore(n) {
		for (let i = 0; i < list.children.length; i++) {
			let el = list.children[i];

			if (i < n) {
				el.style.backgroundColor = `${color}`;
				el.style.border =
					"solid calc(var(--res) / 1000 ) rgba(255,255,255,0.1)";
				el.style.boxShadow = `0 0 calc(var(--res) / 100 ) ${color}`;
			} else {
				el.style.backgroundColor = "transparent";
				el.style.border =
					"solid calc(var(--res) / 750 ) rgba(255,255,255,0.1)";
				el.style.boxShadow = "0 0 0px white";
			}
		}
	}

	onMount(() => {
		setScore(score);
	});
</script>

<div class="base" style="flex-direction: {alignTypes[align]}" bind:this={list}>
	{#each scoreBoxes as box}
		<div class="box" />
	{/each}
</div>

<style>
	.base {
		display: flex;
		gap: calc(var(--res) / 150);
		height: 20%;
	}
	.box {
		height: calc(var(--res) / 45);
		width: calc(var(--res) / 45);
		/* border-radius: 1000px; */
		transition: all 0.5s ease;
	}
</style>
