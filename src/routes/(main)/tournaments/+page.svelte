<script>
	export let data;

	let { tournaments } = data;
</script>

<h1>Tournaments</h1>
<ul>
	{#each tournaments as tournament}
		<li><a href="/t/{tournament.id}">{tournament.name}</a></li>
	{/each}
</ul>
