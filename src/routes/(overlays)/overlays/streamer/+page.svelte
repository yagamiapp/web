<script>
	export let data;
	let { res, match, ws } = data;
	res = res ?? 720;
	ws = ws ?? "ws://localhost:24050/ws";

	import TopBar from "./components/TopBar.svelte";
	import BottomBar from "./components/BottomBar.svelte";
	import ReconnectingWebSocket from "reconnecting-websocket";
	import Error from "./components/Error.svelte";
	import PickingPage from "./components/PickingPage.svelte";

	const socket = new ReconnectingWebSocket(ws);

	let socketClosed = true;
	socket.onopen = () => {
		socketClosed = false;
		console.log("Successfully Connected");
	};

	socket.onerror = () => {
		socketClosed = true;
	};

	let socketData;
	let scoreVisible;
	let chatLength;

	socket.onmessage = (event) => {
		socketClosed = false;
		socketData = JSON.parse(event.data);

		// Refresh data on new message, or state change.
		if (scoreVisible != socketData?.tourney?.manager?.bools?.scoreVisible) {
			scoreVisible = socketData?.tourney?.manager?.bools?.scoreVisible;
			updateMatch();
		}

		if (chatLength != socketData?.tourney?.manager?.chat?.length) {
			chatLength = socketData?.tourney?.manager?.chat?.length;
			updateMatch();
		}
	};

	async function updateMatch() {
		let response = await fetch(`/api/get_match/?id=${match.id}`);
		response = await response.json();
		match = response;
	}
</script>

<svelte:head />

<div class="base" style="--res: {res}px">
	{#if socketClosed}
		<Error />
	{:else}
		<div class="top">
			<TopBar {match} />
		</div>
		<div class="middle">
			<PickingPage {match} {socketData} />
		</div>
		<div class="bottom">
			<BottomBar {socketData} {ws} {match} />
		</div>
	{/if}
</div>

<style>
	.base {
		position: relative;
		height: var(--res);
		width: calc(var(--res) * 16 / 9);
		background-size: cover;
	}
	.top {
		height: calc(var(--res) * 0.143);
	}
	.middle {
		position: absolute;
		top: 0;
		width: 100%;
		height: calc(var(--res) - (var(--res) * 0.19));
	}
	.bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(var(--res) * 0.19);
	}
</style>
