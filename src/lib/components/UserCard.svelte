<script lang="ts">
	import type { User } from '@prisma/client';

	export let user: User;
	export let color = 'rgba(255, 255, 255, 0.5)';

	let { username, id, pp_rank, cover_url, country_code, pp, hit_accuracy } = user;

	let rank = `#${pp_rank.toLocaleString()}`;
	let pfp = `https://s.ppy.sh/a/${id}`;
	let flag = `https://osu.ppy.sh/images/flags/${country_code}.png`;
	let ppNum = parseInt(pp.toFixed(0)).toLocaleString();
</script>

<div class="card" style="--cover={id}; --color:{color}">
	<div class="bg-wrap">
		<img src={cover_url} alt="cover background" class="bg" />
	</div>

	<div class="pfp-wrap">
		<img src={pfp} alt="osu pfp" class="pfp" />
	</div>

	<div class="info-wrap">
		<div class="name-flag-wrap">
			<div class="name">{username}</div>
			<img src={flag} alt="{flag} flag" class="flag" />
		</div>
		<div class="label-wrap">
			<div>Rank</div>
			<div>Accuracy</div>
			<div>pp</div>
		</div>
		<div class="stats-wrap">
			<div class="rank">{rank}</div>
			<div class="acc">{hit_accuracy.toFixed(2)}%</div>
			<div class="pp">{ppNum}pp</div>
		</div>
	</div>
</div>

<style>
	.card {
		position: relative;
		display: flex;
		max-width: 500px;
		height: 125px;
		overflow: hidden;
		margin: 5px;
		color: white;
		border-radius: 15px;
		z-index: 1;
	}
	.bg-wrap {
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
		background: #111111;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.bg {
		min-width: 100%;
		min-height: 100%;
		filter: blur(5px) brightness(0.5);
		scale: 1.1;
		z-index: -1;
	}
	.pfp-wrap {
		width: 125px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.name-flag-wrap,
	.stats-wrap,
	.label-wrap {
		position: relative;
		display: flex;
		align-items: center;
		width: calc(400px - 125px);
		height: 50%;
	}
	.label-wrap {
		height: 20%;
	}
	.stats-wrap,
	.label-wrap {
		justify-content: space-around;
		align-items: flex-start;
	}
	.stats-wrap *,
	.label-wrap * {
		position: relative;
		width: 33%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.name {
		font-size: 2rem;
	}
	.pfp {
		width: 100px;
		border-radius: 15px;
	}
	.flag {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 45px;
		height: 30px;
	}
	.label-wrap div::after {
		content: '';
		background: var(--color);
		position: absolute;
		bottom: -7px;
		left: calc((100% - 85%) / 2);
		width: 85%;
		height: 5px;
		border-radius: 10px;
	}
</style>
