<script>
	export let socketData;
	export let ws;
	export let match;

	// Extract the image url from the ws url
	let wsUrl = ws.match(/ws:\/\/(\D+):(\d+)/);
	let [_, host, port] = wsUrl;
	let baseUrl = `http://${host}:${port}/Songs/`;

	// Set background image
	let img;
	let url;
	$: {
		try {
			img = socketData.menu.bm.path.full;
			url = `${baseUrl}${img}`;
		} catch (e) {
			console.log("Websocket not connected");
		}
	}
	let transformString = "translateY(100%)";
	let maps = match.Round.mappool.Maps;
	// Update other variables;
	let titleString, id, mapper, identifier, cs, ar, od, hp, sr, scoreVisible;
	// If the map ID changes, everything else changes.

	$: {
		try {
			if (id != socketData.menu.bm.id) {
				id = socketData.menu.bm.id;
				let md = socketData.menu.bm.metadata;
				titleString = `${md.artist} - ${md.title} [${md.difficulty}]`;
				mapper = md.mapper;

				let stats = socketData.menu.bm.stats;

				cs = stats.CS;
				ar = stats.AR;
				od = stats.OD;
				hp = stats.HP;

				sr = stats.fullSR;

				let map = maps.find((x) => x.mapId === id);
				console.log(map);

				identifier = map?.identifier ?? "Warmup";
			}
			if (scoreVisible != socketData.tourney.manager.bools.scoreVisible) {
				scoreVisible = socketData.tourney.manager.bools.scoreVisible;
				if (scoreVisible) {
					transformString = "translateY(0)";
				} else {
					transformString = "translateY(100%)";
				}
			}
		} catch {
			console.log("Cannot connect to socket");
		}
	}
</script>

<div class="wrap" style="transform: {transformString}">
	<div class="bg-wrap">
		<img src={url} alt="map background" class="bg" />
		<div class="gradient" />
	</div>
	<div class="identifier">{identifier?.toUpperCase()}</div>
	<div class="title">{titleString}</div>
	<div class="stats">
		<span class="label">CS: </span>
		<span class="prop">{cs}</span>
		<span class="divider">/</span>
		<span class="label">AR: </span>
		<span class="prop">{ar}</span>
		<span class="divider">/</span>
		<span class="label">OD: </span>
		<span class="prop">{od}</span>
		<span class="divider">/</span>
		<span class="label">HP: </span>
		<span class="prop">{hp}</span>
		<span class="divider">/</span>
		<span class="label">SR: </span>
		<span class="prop">{sr}</span>
	</div>
	<div class="mapper">Mapset by: {mapper}</div>
</div>

<style>
	.wrap {
		position: absolute;
		bottom: 0;
		right: 0;
		background: red;
		height: 75%;
		width: 100%;
		overflow: hidden;
		font-family: "Quicksand", sans-serif;
		z-index: 0;
		display: flex;
		align-items: center;
		transition: transform 0.7s ease;
	}
	.bg-wrap {
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
	.bg {
		min-height: 100%;
		width: 100%;
		transform: scale(1.2);
		filter: brightness(0.5);
	}
	.gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, var(--bg2), transparent);
	}
	.identifier {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px;
		width: 9%;
		border-radius: 1000px;
		background: var(--bg2);
		font-size: 1.5em;
		font-weight: bold;
		margin-left: 1%;
	}
	.title {
		position: absolute;
		top: 25%;
		left: 12%;
		font-size: 1.25em;
		font-weight: bold;
	}
	.mapper {
		position: absolute;
		top: 46%;
		font-size: 1.25em;
		left: 12%;
	}
	.stats {
		position: absolute;
		bottom: calc(var(--res) / 100);
		right: calc(var(--res) / 60);
	}
	.prop {
		font-weight: bold;
		text-shadow: 0 0 5px white;
	}
	.label {
		font-weight: 600;
	}
</style>
