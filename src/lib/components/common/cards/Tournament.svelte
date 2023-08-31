<script lang="ts">
	import { scoreModeEnum } from '$lib/TournamentEnums';
	import type { Tournament } from '@prisma/client';

	export let tournament: Tournament;

	let score_mode: string;
	$: score_mode = scoreModeEnum[tournament.score_mode];
</script>

<a class="tournament" href="/tournaments/{tournament.id}">
	<div class="bg-wrap">
		<img src={tournament.banner_url} alt="mappool" />
	</div>
	<div class="type-banner">
		<div class="type">
			{tournament.x_v_x_mode}V{tournament.x_v_x_mode}, {score_mode}
		</div>
	</div>
	<img class="icon" src={tournament.icon_url} alt="icon" />
	<div class="name">
		{tournament.name}
	</div>
</a>

<style>
	a {
		color: var(--text-color);
		text-decoration: none;
	}
	.tournament {
		position: relative;
		background-color: var(--bg4);
		margin: 5px;
		width: 400px;
		border-radius: 10px;
		height: 150px;
		z-index: 0;
		overflow: hidden;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
	}
	.type-banner {
		background-color: var(--bg3);
		width: 400px;
		height: 20px;
		-webkit-mask-image: url(./cardmask.png);
		mask-image: url(./cardmask.png);
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
	.bg-wrap img {
		width: 410px;
		transform: scale(1);
		filter: brightness(0.5);
		transition: 0.3s ease-in-out;
	}
	.icon {
		position: absolute;
		width: 75px;
		height: 75px;
		bottom: 10px;
		right: 10px;
		transform-origin: 100% 100%;
		transition: transform 0.5s ease;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
	}
	.name {
		display: flex;
		align-items: center;
		padding-left: 10px;
		font-weight: bold;
		font-size: 18px;
		width: 400px;
		height: 50px;
		background-color: var(--bg3);
	}
	.type {
		width: 120px;
		height: 20px;
		text-align: center;
		color: #aaaaaa;
		font-size: 14px;
	}
	.tournament:hover .bg-wrap img {
		filter: brightness(0.4) blur(5px);
		transform: scale(1.2);
		animation: breathe 5s ease-out;
	}
	.tournament:hover .icon {
		transform: scale(1.1);
	}
	@keyframes breathe {
		0% {
			transform: scale(1);
		}
		10% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1.2);
		}
	}
</style>
