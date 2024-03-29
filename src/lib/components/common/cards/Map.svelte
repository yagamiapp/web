<script lang="ts">
	import clipMinus from '$lib/assets/clipboard-minus.svg';
	import clipCheck from '$lib/assets/clipboard-check.svg';
	export let map: db.MapInPoolWithMap;

	let colors: { [key: string]: string } = {
		NM: '#3d85c6',
		HD: '#bf9000',
		HR: '#cc0000',
		DT: '#9263d2',
		FM: '#6aa84f',
		TB: '#aaaaaa'
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
		hit_length
	} = map.Map;

	const lengthInt = parseInt(hit_length ?? '0');

	let length = `${Math.round(lengthInt / 60)}:${
		lengthInt % 60 > 10 ? lengthInt % 60 : '0' + (lengthInt % 60)
	}`;
	let stars = parseFloat(difficultyrating ?? '0').toFixed(2);
	let coverImage = `https://assets.ppy.sh/beatmaps/${beatmapset_id}/covers/cover.jpg`;
	// let thumbnailImage = `https://b.ppy.sh/thumb/${map.map.beatmapset_id}l.jpg`;
	let modSlug = map.identifier.substring(0, 2).toUpperCase();

	let clip = clipMinus;
	let id: HTMLSpanElement;
	let text: HTMLDivElement;
	const copy = () => {
		navigator.clipboard.writeText(beatmap_id);

		id.style.color = 'rgba(150,255,150,1)';
		text.textContent = 'Copied!';
		clip = clipCheck;

		setTimeout(() => {
			id.style.color = 'var(--fontColor)';
			text.textContent = 'Copy ID';
			clip = clipMinus;
		}, 3000);
	};
</script>

<div class="map">
	<div class="identifier" style="--color:{colors[modSlug]}">
		{map.identifier}
	</div>
	<div class="banner">
		<div class="banner-wrap">
			<div class="gradient" />
			<img src={coverImage} alt="{map.identifier} background" class="bg" />
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
					/b/<span bind:this={id} class="copy-highlight">{beatmap_id}</span>
				</div>
			</div>

			<div class="stats">
				{stars}★ <br />
				{bpm} BPM, {length}<br />
				CS{diff_size} AR{diff_approach} OD{diff_overall}
			</div>
		</a>
		<button class="copy" on:click={copy}>
			<div bind:this={text}>Copy ID</div>
			<img src={clip} alt="" width="25" height="25" />
		</button>
	</div>
</div>

<style>
	.map {
		display: flex;
		text-decoration: none;
		position: relative;
		overflow: hidden;
		color: white;
		margin-top: 20px;
		border-radius: 15px;
		width: calc(100% - 20px * 2);
		height: 75px;
		z-index: 1;
	}
	.link {
		color: var(--fontColor);
	}
	.banner {
		position: relative;
		width: calc(100% - 50px);
		height: 100%;
	}
	.mapper {
		opacity: 0.75;
	}
	.id {
		opacity: 0.5;
		transition: all 0.3s ease;
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
		filter: blur(0px) brightness(0.5);
		transform: scale(1.2);
	}

	.banner-wrap .bg:hover {
		filter: blur(10px);
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
		width: calc(100% - 100px - 75px);
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
		width: 200px;
		padding: 10px;
		text-align: right;
		background: linear-gradient(90deg, transparent, var(--bg1));
		opacity: 0.6;
	}
	.copy {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		top: 0;
		right: 0;
		border: 0;
		color: white;
		border-bottom-left-radius: 0px;
		border-top-left-radius: 0px;
		font-family: 'MavenPro';
		background-color: var(--bg1);
		width: 75px;
		height: 75px;
		text-align: center;
		font-size: 0.8em;
		z-index: 5;
		cursor: pointer;
		transition: opacity 0.3s ease;
		opacity: 0.7;
	}

	.lightmode .copy img {
		filter: invert(1);
	}
	.copy img {
		margin-top: 10px;
	}
	.copy:hover {
		opacity: 0.9;
	}
	@media screen and (max-width: 600px) {
		.map {
			height: 50px;
			width: calc(100% - 5px * 2);
		}
		.identifier {
			width: 30px;
			font-size: 1em;
		}
		.copy {
			width: 50px;
			height: 50px;
		}
		.stats {
			right: 50px;
		}
	}
</style>
