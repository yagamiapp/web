<script lang="ts">
	export let data: { user: User };
	import defaultPfp from '$lib/assets/person-circle.svg';
	import type { User } from '@prisma/client';
	import LoginButton from '$lib/components/common/sidebar/LoginButton.svelte';
	import LogoutButton from '$lib/components/common/sidebar/LogoutButton.svelte';
	import UserCard from '$lib/components/common/sidebar/SidebarCard.svelte';

	let pfp = defaultPfp;
	if (data.user) {
		pfp = `https://s.ppy.sh/a/${data.user.id}`;
	}

	let el: HTMLDivElement;
	let blur: HTMLDivElement;

	const openSidebar = () => {
		el.classList.remove('closed');
		blur.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		blur.style.pointerEvents = 'all';
	};
	const removeSidebar = () => {
		el.classList.add('closed');
		blur.style.backgroundColor = 'rgba(0, 0, 0, 0)';
		blur.style.pointerEvents = 'none';
	};
</script>

<img
	draggable="false"
	src={pfp}
	alt="profile"
	class="button"
	on:click={openSidebar}
	on:keydown={openSidebar}
/>
<div class="sidebar closed" bind:this={el}>
	<div class="menu">
		<div class="close-button" on:click={removeSidebar} on:keydown={removeSidebar}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="45"
				height="45"
				fill="currentColor"
				class="bi bi-x-lg"
				viewBox="0 0 16 16"
			>
				<path
					d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
				/>
			</svg>
		</div>
		<div class="title">YAGAMI</div>
		{#if data.user}
			<UserCard user={data.user} />
		{:else}
			<LoginButton />
		{/if}
		<span />
		<a on:click={removeSidebar} href="/">Home</a>
		<a on:click={removeSidebar} href="/tournaments">Tournaments</a>
		<a on:click={removeSidebar} href="/mappools">Mappools</a>
		{#if data.user}
			<a on:click={removeSidebar} data-sveltekit-reload class="settings" href="/profile/settings"
				>Settings</a
			>
			<LogoutButton on:click={removeSidebar} />
		{/if}
	</div>
</div>
<div class="blur" on:click={removeSidebar} on:keydown={removeSidebar} bind:this={blur} />

<style>
	.sidebar {
		position: fixed;
		top: 0;
		right: 0;
		height: 100%;
		overflow: hidden;
		z-index: 1000;
	}

	.closed.sidebar {
		pointer-events: none;
	}

	.title {
		color: var(--bg3);
		font-size: bold;
		font-family: quicksand;
		font-size: 3em;
		margin-bottom: 20px;
	}

	.button {
		position: fixed;
		top: 20px;
		right: 20px;
		width: 60px;
		border-radius: 20px;
		cursor: pointer;
		transition: 0.4s;
		z-index: 10;
	}

	.menu {
		width: 100vw;
		max-width: 500px;
		height: 100%;
		background-color: var(--bg2);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 20px;
		transition: transform 0.4s;
	}

	.menu > * {
		width: 80%;
		display: grid;
		place-items: center;
		border-bottom: solid 2px var(--bg3);
	}

	.close-button {
		position: absolute;
		top: 15px;
		left: 15px;
		width: 45px;
		height: 45px;
		border: 0;
		cursor: pointer;
	}

	.blur {
		pointer-events: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0);
		z-index: 10;
		transition: all 0.4s;
	}

	.closed .menu {
		transform: translate(100%);
	}

	.menu a {
		padding: 20px 0px;
	}

	.menu a:hover {
		background-color: var(--bg3);
	}

	@media screen and (max-width: 600px) {
		.button {
			width: 50px;
			top: 5px;
			right: 5px;
			border-radius: 15px;
		}
	}
</style>
