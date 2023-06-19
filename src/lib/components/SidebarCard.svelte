<script>
	export let user;
	export let color = 'rgba(255, 255, 255, 0.5)';

	let { username, id, pp_rank, cover_url, country_code } = user;

	let rank = `#${pp_rank.toLocaleString()}`;
	let pfp = `https://s.ppy.sh/a/${id}`;
	let flag = `https://osu.ppy.sh/images/flags/${country_code}.png`;
</script>

<a href="/u/{id}" class="card" style="--cover={id}; --color:{color}">
	<div class="bg-wrap">
		<img src={cover_url} alt="cover background" class="bg" onerror="this.style.display='none'" />
	</div>
	<div class="fade" />
	<div class="name-box">
		<div class="pfp-wrap">
			<img src={pfp} alt="osu pfp" class="pfp" />
		</div>
		<div class="stats">
			<div class="name">{username}</div>
			<div class="rank">{rank}</div>
		</div>

		<img src={flag} alt="{flag} flag" class="flag" />
	</div>
</a>

<style>
	.card {
		position: relative;
		display: flex;
		width: 80%;
		height: 150px;
		overflow: hidden;
		mask-image: linear-gradient(180deg, transparent, #000 70%, #000 80%, transparent);
		-webkit-mask-image: linear-gradient(180deg, transparent, #000 70%, #000 80%, transparent);
		color: white;
		z-index: 1;
	}
	.fade {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
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
		filter: brightness(0.5);
		z-index: -1;
	}
	.stats {
		margin: 5px;
		transform: translate(15px, 0px);
	}
	.name {
		font-size: 1.5rem;
	}
	.rank {
		color: #aaaaaa;
	}
	.pfp-wrap {
		width: 75px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translate(15px, -15px);
	}
	.pfp {
		width: 75px;
		border-radius: 15px;
	}
	.flag {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 45px;
		height: 30px;
	}
	.name-box {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 75px;
		width: 100%;
		background-color: rgba(5, 5, 5, 0.75);
		backdrop-filter: blur(10px);
		display: flex;
	}
</style>
