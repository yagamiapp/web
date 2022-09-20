<script>
	import Match from "../Match.svelte";

	export let round;
	let { matches } = round;

	const switchClosed = (ev) => {
		const el = ev.target.parentElement;
		el.classList.toggle("closed");
	};
</script>

<div class="closed details" style="--count:{matches.length}">
	<div class="summary" on:click={switchClosed}>
		{round.name}
		<span class="icon">▲</span>
	</div>

	<div class="maps">
		{#each matches as match}
			<Match {match} />
		{/each}
	</div>
</div>

<style>
	.summary {
		font-size: 1.5em;
		height: 60px;
		padding-left: 20px;
		font-weight: bold;
		border-bottom: solid 2px rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.icon {
		position: absolute;
		top: 0;
		right: 0;
		height: 60px;
		width: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		transition: transform 0.5s ease;
		transform: rotate(0deg);
	}

	.closed .icon {
		transform: rotate(180deg);
	}

	.details {
		position: relative;
		background-color: var(--bg3);
		/* height: calc(var(--count) * (20px + 75px) + (60px + 20px)); */
		width: 100%;
		overflow: hidden;
		transition: height 0.5s ease-in-out;
		margin-bottom: 30px;
		z-index: 1;
	}
	.details.closed {
		height: 60px;
	}
</style>
