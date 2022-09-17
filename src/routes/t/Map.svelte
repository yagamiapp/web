<script>
	import clipMinus from "../../assets/clipboard-minus.svg";
	import clipCheck from "../../assets/clipboard-check.svg";
	export let map;

	let colors = {
		NM: "#3d85c6",
		HD: "#bf9000",
		HR: "#cc0000",
		DT: "#9263d2",
		FM: "#6aa84f",
		TB: "#aaaaaa",
	};

	let {
		beatmap_id,
		beatmapset_id,
		artist,
		title,
		difficultyrating,
		diff_size,
		diff_approach,
		diff_overall,
		bpm,
		version,
		creator,
		hit_length,
	} = map.map;

	let length = `${Math.round(hit_length / 60)}:${
		hit_length % 60 > 10 ? hit_length % 60 : "0" + (hit_length % 60)
	}`;
	let stars = parseFloat(difficultyrating).toFixed(2);
	let coverImage = `https://assets.ppy.sh/beatmaps/${beatmapset_id}/covers/cover.jpg`;
	// let thumbnailImage = `https://b.ppy.sh/thumb/${map.map.beatmapset_id}l.jpg`;
	let modSlug = map.identifier.substring(0, 2).toUpperCase();

	let clip = clipMinus;
	const copy = (ev) => {
		// I'm doing node gymnastics to find the beatmap ID because I'm lazy
		let banner = ev.target.parentNode.parentNode ?? ev.target.parentNode;
		let link = banner.children[1].href;
		let id = link.match(/https:\/\/osu\.ppy\.sh\/b\/(\d+)/)[1];
		navigator.clipboard.writeText(id);
		clip = clipCheck;
		console.log(ev);
	};
</script>

<div class="map" href="https://osu.ppy.sh/b/{map.mapId}">
	<div class="identifier" style="--color:{colors[modSlug]}">
		{map.identifier}
	</div>
	<div class="banner">
		<div class="banner-wrap">
			<div class="gradient" />
			<img
				src={coverImage}
				alt="{map.identifier} background"
				class="bg"
			/>
		</div>
		<a href="https://osu.ppy.sh/b/{map.mapId}" class="link">
			<div class="fade">
				<div class="meta">
					{artist} - {title} [{version}]
				</div>
				<div class="mapper">
					Mapped by {creator}
				</div>
				<div class="id">
					/b/<span class="copy-highlight">{beatmap_id}</span>
				</div>
			</div>

			<div class="stats">
				{stars}★ <br />
				{bpm} BPM, {length}<br />
				CS{diff_size} AR{diff_approach} OD{diff_overall}
			</div>
		</a>
		<div class="copy" on:click={copy}>
			<div>Copy ID</div>
			<img src={clip} alt="" width="25" height="25" />
		</div>
	</div>
</div>

<style>
	.map {
		display: flex;
		color: white;
		text-decoration: none;
		position: relative;
		overflow: hidden;
		margin-top: 20px;
		border-radius: 15px;
		width: calc(100% - 20px * 2);
		height: 75px;
		z-index: 1;
	}
	.link {
		color: white;
	}
	.banner {
		position: relative;
		width: calc(100% - 50px);
		height: 100%;
	}
	.mapper {
		color: rgba(255, 255, 255, 0.75);
	}
	.id {
		color: rgba(255, 255, 255, 0.5);
	}
	.banner-wrap {
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
		background: var(--bg1);
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.gradient {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, var(--bg1), transparent 50%);
		z-index: 1;
	}
	.banner-wrap .bg {
		min-width: 100%;
		min-height: 100%;
		filter: blur(5px) brightness(0.5);
		transform: scale(1.2);
	}
	.identifier {
		width: 75px;
		height: 100%;
		color: var(--color);
		background-color: var(--bg1);
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		display: grid;
		place-items: center;
		font-size: 1.25em;
		font-weight: bold;
		z-index: 1;
	}

	.fade {
		position: absolute;
		top: 0;
		left: 0;
		/* Some weird shenanigans with CSS makes it so I can't make this 100% */
		width: calc(100% - 100px);
		height: 100%;
		padding: 10px;
		overflow: hidden;
		white-space: nowrap;
		mask-image: linear-gradient(90deg, #000 80%, transparent);
		-webkit-mask-image: linear-gradient(90deg, #000 80%, transparent);
	}
	.stats {
		position: absolute;
		top: 0;
		right: 75px;
		padding: 10px;
		text-align: right;
		color: rgba(255, 255, 255, 0.3);
	}
	.copy {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		top: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		width: 75px;
		height: 75px;
		text-align: center;
		font-size: 0.8em;
		z-index: 5;
		cursor: pointer;
		transition: background-color 0.1s ease;
	}
	.copy img {
		margin-top: 10px;
		fill: #ffffff;
	}
	.copy:hover {
		background-color: rgba(0, 0, 0, 0.75);
	}
</style>
