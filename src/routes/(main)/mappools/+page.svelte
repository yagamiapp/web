<script>
	import Pool from "../../../components/MappoolCard.svelte";
	export let data;
</script>

<svelte:head>
	<title>Mappool List</title>
</svelte:head>

<h1>Mappools</h1>

<section>
	{#each data.mappools as pool}
		<Pool {pool} />
	{/each}
</section>

<style>
	section {
		margin: auto;
		width: 90vw;
		max-width: 1500px;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
	}
	@media screen and (max-width: 600px) {
		section {
			width: 100vw;
			gap: 5px;
		}
	}
</style>
