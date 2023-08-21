<script lang="ts">
	import { scoreModeEnum } from '$lib/TournamentEnums';
	import type { Tournament } from '@prisma/client';

	export let tournament: Tournament;

	let score_mode: string;
	$: score_mode = scoreModeEnum[tournament.score_mode];
</script>

<a class="tournament" href="/t/{tournament.id}">
	<div class="bg-wrap">
		<img src={tournament.banner_url} alt="mappool" />
	</div>
	<div class="type-banner">
		<div class="type">
			{tournament.x_v_x_mode}V{tournament.x_v_x_mode}, {score_mode}
		</div>
	</div>
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
		filter: brightness(0.5) blur(2px);
		transition: 0.3s ease-in-out;
	}
	.tournament:hover img {
		filter: brightness(0.4) blur(5px);
		transform: scale(1.2);
		animation: breathe 5s ease-out;
	}
	.tournament:hover .name {
		padding-left: 30px;
		animation: slide 0.3s ease 0s;
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
	@keyframes slide {
		0% {
			padding-left: 10px;
		}
		100% {
			padding-left: 30px;
		}
	}
</style>
