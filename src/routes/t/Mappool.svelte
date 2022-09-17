<script>
	import Map from "./Map.svelte";
	export let round;

	const switchClosed = (ev) => {
		const el = ev.target.parentElement;
		el.classList.toggle("closed");
	};
	let maps = round.mappool.maps;
</script>

<div class="closed details" style="--count:{maps.length}">
	<div class="summary" on:click={switchClosed}>
		{round.name}
		<span class="icon">▲</span>
	</div>

	<div class="maps">
		{#each maps as map}
			<Map {map} />
		{/each}
	</div>
</div>

<style>
	.summary {
		background-color: var(--bg1);
		font-size: 1.5em;
		height: 60px;
		padding-left: 20px;
		font-weight: bold;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.details.closed {
		height: 60px;
	}

	.icon {
		position: absolute;
		top: 0;
		right: 0;
		height: 60px;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		transition: transform 0.5s ease;
		transform: rotate(180deg);
	}

	.closed .icon {
		transform: rotate(90deg);
	}

	.details {
		position: relative;
		background-color: var(--bg3);
		height: calc(var(--count) * (20px + 75px) + 60px);
		overflow: hidden;
		transition: height 0.5s ease-in-out;
		margin-bottom: 30px;
		z-index: 1;
	}

	.maps {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
