<script lang="ts">
	import type { Mappool } from '@prisma/client';
	import { ModColors } from '$lib/ModEnums';

	export let pool: Mappool & { Maps: db.MapInPoolWithMap[]; Round: db.RoundWithEverything };

	let lastMap = pool.Maps[pool.Maps.length - 1];
	let bgImg =
		pool.Round?.Tournament?.banner_url ||
		`https://assets.ppy.sh/beatmaps/${lastMap.Map.beatmapset_id}/covers/cover.jpg`;

	let modCount: { mod: string; count: number }[] = [];

	for (const map of pool.Maps) {
		let mod = map.identifier.match(/\w{2}/g)[0];
		let old = modCount.find((x) => x.mod === mod);
		if (old) {
			modCount[modCount.indexOf(old)] = {
				mod,
				count: old.count + 1
			};
		} else {
			modCount.push({
				mod,
				count: 1
			});
		}
	}
	console.log(modCount);
	let name = pool.Round?.Tournament?.name ?? pool.tournament_name ?? 'Unknown';
	let round = pool.Round?.name ?? pool.round_name ?? 'Unknown';

	let colors = ModColors;
</script>

<article class="card">
	<div class="bg-wrap">
		<img src={bgImg} alt="mappool" />
	</div>
	<div class="mod-box">
		{#each modCount as mod}
			<div class="mod-count" style="--color: {colors[mod.mod] || '#AAAAAAAA'}">
				<div class="count">
					{mod.count}
				</div>
				<div class="text">
					{mod.mod}
				</div>
			</div>
		{/each}
	</div>
	<div class="title">
		<div class="name">
			{name}
		</div>
		<div class="round">
			{round}
		</div>
	</div>
</article>

<style>
	.card {
		position: relative;
		width: 400px;
		height: 150px;
		overflow: hidden;
		border-radius: 10px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		z-index: 0;
		cursor: pointer;
	}
	.card img {
		width: 550px;
		transform: scale(1);
		filter: brightness(0.5) blur(2px);
		transition: 0.3s ease-in-out;
	}
	.bg-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 400px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: -1;
	}
	.mod-box {
		position: absolute;
		background-color: var(--bg2);
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.5) 50%, transparent 80%);
		display: flex;
		align-items: center;
		padding-left: 20px;
	}
	.mod-count {
		position: relative;
		display: grid;
		place-items: center;
		width: 40px;
		height: 35px;
		background-color: var(--color);
		transform: skew(-20deg);
	}
	.mod-count > * {
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}
	.mod-count .text {
		position: absolute;
		bottom: 1px;
		left: 1px;
		font-weight: bold;
		font-size: 10px;
		color: rgba(255, 255, 255, 0.5);
	}
	.mod-count .count {
		font-size: bold;
		font-size: 24px;
		font-family: Montserrat-Bold, sans-serif;
		transform: skew(20deg);
	}

	.title {
		font-family: Montserrat-ExtraBold, sans-serif;
		font-size: 1.25em;
		margin: 10px;
		margin-top: 25px;
		transition: 0.3s ease;
	}
	.name {
		transition: 0.3s ease;
	}
	.round {
		color: #aaaaaa;
		font-size: 0.8em;
		transition: 0.3s ease;
	}
	.card:hover img {
		filter: brightness(0.4) blur(5px);
		transform: scale(1.2);
		animation: breathe 5s ease-out;
	}
	.card:hover .name {
		transform: translate(20px);
		animation: slide 0.3s ease 0s;
	}
	.card:hover .round {
		transform: translate(20px);
		animation: slide 0.5s ease 0s;
	}
	@keyframes breathe {
		0% {
			transform: scale(1.025);
		}
		100% {
			transform: scale(1.2);
		}
	}
	@keyframes slide {
		0% {
			transform: translate(0);
		}
		100% {
			transform: translate(20px);
		}
	}
</style>
