<script lang="ts">
	import Default from '$lib/assets/icons/white.svg';
	import type { Tournament } from '@prisma/client';

	export let data: { tournament: Tournament };

	let name = data.tournament.name;

	let typing = false;
	let timeout: number;
	let msAfterInput = 3000;

	const keydown = (event: KeyboardEvent) => {
		clearTimeout(timeout);
		if (event.key == 'Enter') {
			typingEnd();
		}
		typing = true;
		timeout = setTimeout(typingEnd, msAfterInput);
	};

	const typingEnd = async () => {
		typing = false;
		const payload = new URLSearchParams();

		if (data.tournament.name != name) {
			payload.set('name', name);
			data.tournament.name = name;
		}

		await save(payload);
	};

	const save = async (payload: URLSearchParams) => {
		await fetch(`?/save`, {
			method: 'POST',
			body: payload.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};
</script>

<div class="wrap" style="--tournament-color: {data.tournament.color}">
	<div class="top">
		<img src={Default} alt="" class="icon" />
	</div>
	<label for="display-name">Tournament Name</label>
	<input on:keydown={keydown} bind:value={name} name="display-name" type="text" />
</div>

<style>
	.top {
		position: relative;
		height: 60px;
	}

	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
	}
	input[type='text'] {
		color: var(--font-color);
		outline: none;
		width: 30rem;
		font-family: 'Quicksand';
		border: solid 2px var(--font-color);
		border-radius: 6px;
		padding: 5px;
		font-size: 16px;
		font-weight: 600;
		transition: border-color 200ms ease;
		background-color: var(--bg1);
	}
	input[type='text']:focus {
		border: solid 2px var(--tournament-color);
	}
</style>
