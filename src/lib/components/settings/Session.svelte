<script lang="ts">
	import Desktop from '$lib/assets/devices/desktop.svg';
	import Phone from '$lib/assets/devices/phone.svg';
	import Tablet from '$lib/assets/devices/tablet.svg';
	import Unknown from '$lib/assets/devices/unknown.svg';
	import { browser } from '$app/environment';
	import type { UserSession } from '@prisma/client';

	export let session: UserSession;

	function getImage() {
		if (!session.os || !session.browser) {
			return Unknown;
		}

		let map: { [key: string]: string } = {
			desktop: Desktop,
			smartphone: Phone,
			phablet: Phone,
			tablet: Tablet
		};

		let device;
		if (session.device) {
			map[session.device];
		}
		return device;
	}

	function getTime() {
		const units: [Intl.RelativeTimeFormatUnit, number][] = [
			['year', 31536000000],
			['month', 2628000000],
			['day', 86400000],
			['hour', 3600000],
			['minute', 60000],
			['second', 1000]
		];
		let now = new Date();

		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

		let relative = session.lastUsed.getTime() - now.getTime();
		for (const [unit, amount] of units) {
			if (Math.abs(relative) > amount || unit === 'second') {
				return rtf.format(Math.round(relative / amount), unit);
			}
		}
	}

	async function removeSession(date: Date) {
		// I really don't like the idea of passing all the
		// session IDs to the client, so I'm using the creation
		// date, which should usually be unique, and checking it
		// against the session id in the cookies.
		let response = await fetch('/api/remove_session', {
			method: 'DELETE',
			body: JSON.stringify({
				sessionCreationDate: date
			})
		});
		console.log(response);
		if (browser && response.status == 200) {
			window.location.reload();
		}
	}
</script>

<article>
	{#if getImage()}
		<img src={getImage()} alt={session.device} />
	{/if}

	{#if session.os && session.browser}
		<span>
			{session.os} ({session.browser})
			{#if session.current}
				<span class="current">CURRENT</span>
			{/if}
		</span>
	{:else}
		<span>Unknown</span>
	{/if}

	<div>Last Active: {getTime()}</div>
	<button on:click={() => removeSession(session.createdAt)}>Remove Session</button>
</article>

<style>
	article {
		position: relative;
		display: grid;
		margin-left: 3em;
		grid-template-columns: 50px 1fr 0.25fr;
		height: 50px;
		align-items: center;
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: solid 3px var(--bg3);
		width: 60%;
	}
	article span,
	article div {
		grid-column: 2;
	}
	article img {
		height: 75%;
		grid-row: 1/3;
		filter: invert(1);
	}
	article button {
		background-color: #f661;
		border: 0;
		color: white;
		font-size: bold;
		font-family: MavenPro, sans-serif;
		border-radius: 10px;
		grid-column: 3/3;
		grid-row: 1/3;
		cursor: pointer;
		transition: all 0.2s;
	}
	article button:hover {
		background-color: #f66;
		animation: shake 0.2s linear infinite;
	}
	article button:focus {
		scale: 0.8;
		background-color: #f665;
		animation: none;
	}
	.current {
		display: inline-block;
		font-size: 0.9em;
		padding: 0.5em;
		border-radius: 10px;
		background-color: var(--bg1);
		text-shadow: 0 0 5px white;
		transform: translate(5px, -5px);
	}
	@keyframes shake {
		0% {
			transform: rotate(2deg);
		}
		50% {
			transform: rotate(-2deg);
		}
		100% {
			transform: rotate(2deg);
		}
	}
</style>
