<script>
	import BanIcon from "../x-circle.svg";
	import WinIcon from "../trophy.svg";

	export let map;
	export let type;

	let url = `https://assets.ppy.sh/beatmaps/${map.Map.Map.beatmapset_id}/covers/cover.jpg`;
</script>

<div class="map">
	<div class="bg-wrap">
		<img src={url} alt="" />
	</div>
	{#if type == "ban"}
		<div class="label">
			<div class="icon">
				<img src={BanIcon} alt="" />
				<img src={BanIcon} alt="" />
			</div>
			<div class="text">Banned</div>
		</div>
	{/if}
	{#if type == "pick" && map.WonBy}
		<div class="label">
			<div class="icon">
				<img src={WinIcon} alt="" />
				<img src={WinIcon} alt="" />
			</div>
			<div class="text">Won By</div>
		</div>

		<div class="winning-team">
			<img
				src={map.WonBy.Team.icon_url}
				alt="team icon"
				class="team-icon"
			/>
			<div class="name">{map.WonBy.Team.name}</div>
		</div>
	{/if}
	<div class="map-name">
		{map.Map.identifier}
	</div>
</div>

<style>
	.map {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		font-family: Quicksand, sans-serif;
		z-index: 1;
	}
	.bg-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		overflow: hidden;
		z-index: -1;
	}
	.label {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 0.8em;
		font-weight: bold;
		width: 70%;
		transform: skew(var(--skew-amount)) translateY(-15%);
	}
	.bg-wrap img {
		min-height: 100%;
		filter: brightness(0.5);
	}
	.icon {
		position: relative;
		width: 100%;
		height: 100%;
		display: grid;
	}
	.icon img:nth-child(1) {
		width: 100%;
		grid-row: 1/1;
		grid-column: 1/1;
	}
	.icon img:nth-child(2) {
		width: 100%;
		grid-row: 1/1;
		grid-column: 1/1;
		filter: blur(2px);
	}
	.text {
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
	}
	.winning-team {
		position: absolute;
		bottom: 15%;
		width: 100%;
		/* height: 60%; */
		z-index: -1;
		font-size: 0.5em;
	}
	.winning-team .name {
		text-align: center;
		font-weight: bold;
	}
	.team-icon {
		position: absolute;
		bottom: 0;
		left: -10%;
		width: 120%;
		filter: brightness(0.5);
		mask-image: linear-gradient(0deg, black, transparent);
		-webkit-mask-image: linear-gradient(0deg, black, transparent);
		transform: skew(var(--skew-amount));
		z-index: -1;
	}
	.map-name {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		bottom: 0;
		background-color: var(--bg1);
		width: 150%;
		height: 15%;
		transform: skew(var(--skew-amount));
	}
</style>
