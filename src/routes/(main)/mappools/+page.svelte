<script>
	import Pool from '$lib/components/common/cards/MappoolCompact.svelte';
	export let data;
</script>

<svelte:head>
	<title>Mappool List</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content="Mappools" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Browse mappools from various tournaments hosted on Yagami." />
	<meta name="theme-color" content="#f34e87" /> <!-- var(--yagami-pink) -->
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
