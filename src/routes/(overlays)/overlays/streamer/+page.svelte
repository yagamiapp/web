<script>
	import TopBar from "./components/TopBar.svelte";

	export let data;
	let { res, match } = data;
	res = res ?? 720;
</script>

<div class="base" style="--res: {res}px">
	<div class="top">
		<TopBar {match} />
	</div>
</div>

<style>
	.base {
		height: var(--res);
		width: calc(var(--res) * 16 / 9);
		background: url("https://imgs.search.brave.com/Jl0Gx6aIIViLTA7ohXmteI8EH24HWW6Myn_uvgkRUW8/rs:fit:1200:720:1/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aS96/ZC1VYkhJLU04US9t/YXhyZXNkZWZhdWx0/LmpwZw");
		background-size: cover;
	}
	.top {
		height: 16%;
	}
</style>
