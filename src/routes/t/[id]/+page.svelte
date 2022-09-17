<script>
	import Tournament from "../Tournament.svelte";
	export let data;
</script>

<div class="wrap">
	<Tournament {data} />
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
