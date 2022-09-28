<script>
	export let data;
	import defaultPfp from "../assets/person-circle.svg";
	import Switch from "./ToggleSwitch.svelte";
	import LoginButton from "./LoginButton.svelte";
	import LogoutButton from "./LogoutButton.svelte";
	import UserCard from "./UserCard.svelte";

	let pfp = defaultPfp;
	if (data.user) {
		pfp = `https://s.ppy.sh/a/${data.user.id}`;
	}
	// console.log(data);

	let el;
	let blur;

	const openSidebar = () => {
		el.classList.remove("closed");
	};
	const removeSidebar = () => {
		el.classList.add("closed");
	};

	const switchTheme = ({ detail }) => {
		if (detail) {
			document.body.classList.remove("lightmode");
			img.src = logoWhite;
		} else {
			document.body.classList.add("lightmode");
			img.src = logoDark;
		}
	};
</script>

<div class="sidebar closed" bind:this={el}>
	<img src={pfp} alt="profile" class="button" on:click={openSidebar} />
	<div class="menu">
		<div class="title">YAGAMI</div>
		{#if data.user}
			<UserCard user={data.user} />
			<LogoutButton />
		{:else}
			<LoginButton originUrl={data.origin} />
		{/if}
		<span />
		<div class="switch">
			Dark Mode <Switch checked="true" on:check={switchTheme} />
		</div>
	</div>
	<div class="blur" on:click={removeSidebar} bind:this={blur} />
</div>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 2;
	}

	.title {
		color: var(--bg3);
		font-size: bold;
		font-family: quicksand;
		font-size: 3em;
	}

	.button {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 60px;
		border-radius: 20px;
		cursor: pointer;
	}

	.menu {
		position: absolute;
		top: 0;
		right: 0;
		width: 500px;
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
		margin-bottom: 40px;
		margin-top: 40px;
		display: grid;
		place-items: center;
		border-bottom: solid 2px var(--bg3);
	}

	.blur {
		/* display: none; */
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(0px);
		z-index: -1;
		transition: all 0.4s;
	}

	.closed .menu {
		transform: translate(100%);
	}

	.closed .blur {
		background-color: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0px);
		z-index: -1;
	}
</style>
