<script>
	import CentreNarrowPanel from "$lib/components/common/CentreNarrowPanel.svelte";

	export let data;

	let { tournaments } = data;
</script>

<svelte:head>
	<title>Tournaments</title>
</svelte:head>

<CentreNarrowPanel>

	<h1>Tournaments</h1>
	<ul>
		{#each tournaments as tournament}
			<li><a href="/t/{tournament.id}">{tournament.name}</a></li>
		{/each}
	</ul>

</CentreNarrowPanel>

