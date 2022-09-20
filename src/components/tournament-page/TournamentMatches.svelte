<script>
	import MatchList from "./MatchList.svelte";
	import Switch from "../ToggleSwitch.svelte";

	export let tournament;
	export let rounds;
	let section;

	function toggleScoreVis(e) {
		if (e.detail) {
			section.classList.add("spoilered");
			return;
		}

		section.classList.remove("spoilered");
	}
</script>

<section id="matches" class="spoilered" bind:this={section}>
	<h1>Matches</h1>

	The match page is a work in progress.
	<!-- <div class="spoiler">
		<span>Only show score on hover:</span>
		<Switch
			on:check={toggleScoreVis}
			checked="true"
			onColor={tournament.color}
			offColor="var(--bg1)"
			handleColor="var(--bg2)"
		/>
	</div>
	<div class="list">
		{#each rounds as round}
			<MatchList {round} />
		{/each}
	</div> -->
</section>

<style>
	section {
		position: relative;
		background-color: var(--bg2);
		padding: 20px;
		z-index: 1;
	}
	.list {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
	.spoiler {
		position: absolute;
		top: 40px;
		right: 0;
		margin-right: 10px;
		gap: 10px;
		padding: 10px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		background-color: var(--bg3);
	}
</style>
