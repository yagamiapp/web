<script>
	import Pool from "../../components/MappoolCard.svelte";
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
		width: 100vw;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
