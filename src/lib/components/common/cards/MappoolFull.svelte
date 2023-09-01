<script lang="ts">
	import Map from '$lib/components/common/cards/Map.svelte';

	export let round: db.RoundWithEverything;

	let pool: HTMLDivElement;

	const switchClosed = () => {
		pool.classList.toggle('closed');
	};
	let maps = round.mappool?.Maps.filter((m) => m.Map) ?? [];
</script>

<div class="closed details" bind:this={pool} style="--count:{maps.length}">
	<div class="summary" on:click={switchClosed} on:keydown={switchClosed}>
		{round.name}
		<div class="rules">
			Best of {round.best_of},
			{#if round.bans != 1}
				{round.bans} bans
			{:else}
				{round.bans} ban
			{/if}
		</div>
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

	.rules {
		position: absolute;
		top: 0;
		right: 60px;
		font-size: 0.75em;
		font-weight: normal;
		display: grid;
		place-items: center;
		color: rgba(255, 255, 255, 0.5);
		height: 60px;
		pointer-events: none;
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
		height: calc(var(--count) * (20px + 75px) + (60px + 20px));
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
