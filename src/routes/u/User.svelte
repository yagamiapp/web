<script>
	export let osu_username;
	export let osu_id;
	export let osu_pp_rank;
	export let osu_cover_url;
	export let osu_country_code;
	export let osu_pp;
	export let osu_hit_accuracy;

	let rank = `#${osu_pp_rank.toLocaleString()}`;
	let pfp = `https://s.ppy.sh/a/${osu_id}`;
	let flag = `https://osu.ppy.sh/images/flags/${osu_country_code}.png`;
	("https://osu.ppy.sh/images/flags/US.png");
	let pp = osu_pp.toFixed(0).toLocaleString();
</script>

<div class="card" style="--cover={osu_id}">
	<img src={osu_cover_url} alt="cover background" class="bg" />
	<div class="pfp-wrap">
		<img src={pfp} alt="osu pfp" class="pfp" />
	</div>

	<div class="info-wrap">
		<div class="name-flag-wrap">
			<div class="name">{osu_username}</div>
			<img src={flag} alt="{flag} flag" class="flag" />
		</div>
		<div class="label-wrap">
			<div>Rank</div>
			<div>Accuracy</div>
			<div>pp</div>
		</div>
		<div class="stats-wrap">
			<div class="rank">{rank}</div>
			<div class="acc">{osu_hit_accuracy.toFixed(2)}%</div>
			<div class="pp">{pp}pp</div>
		</div>
	</div>
</div>

<style>
	.card {
		position: relative;
		display: flex;
		width: 400px;
		height: 125px;
		overflow: hidden;
		margin: 5px;
		border-radius: 15px;
		/* align-items: center; */
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		height: 150px;
		filter: blur(5px) brightness(0.5);
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
		content: "";
		background: rgba(255, 255, 255, 0.5);
		position: absolute;
		bottom: -7px;
		left: calc((100% - 85%) / 2);
		width: 85%;
		height: 5px;
		border-radius: 10px;
	}
</style>
