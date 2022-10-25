<script>
	export let data;
	let { res, match, ws } = data;
	res = res ?? 720;
	ws = ws ?? "ws://localhost:24050/ws";

	import TopBar from "./components/TopBar.svelte";
	import BottomBar from "./components/BottomBar.svelte";
	import ReconnectingWebSocket from "reconnecting-websocket";

	const socket = new ReconnectingWebSocket(ws);

	socket.onopen = () => {
		console.log("Successfully Connected");
	};

	let socketData;

	socket.onmessage = (event) => {
		socketData = JSON.parse(event.data);
	};
</script>

<svelte:head />

<div class="base" style="--res: {res}px">
	<div class="top">
		<TopBar {match} />
	</div>
	<div class="bottom">
		<BottomBar {socketData} {match} />
	</div>
</div>

<style>
	.base {
		position: relative;
		height: var(--res);
		width: calc(var(--res) * 16 / 9);
		/* background: url("https://imgs.search.brave.com/Jl0Gx6aIIViLTA7ohXmteI8EH24HWW6Myn_uvgkRUW8/rs:fit:1200:720:1/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aS96/ZC1VYkhJLU04US9t/YXhyZXNkZWZhdWx0/LmpwZw"); */
		background-size: cover;
	}
	.top {
		height: calc(var(--res) * 0.143);
	}
	.bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(var(--res) * 0.19);
	}
</style>
