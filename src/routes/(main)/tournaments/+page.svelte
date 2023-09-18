<script lang="ts">
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';
	import Tournament from '$lib/components/common/cards/Tournament.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let { tournaments } = data;
</script>

<svelte:head>
	<title>Tournaments</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content="Tournaments" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Browse tournaments hosted on Yagami" />
	<meta name="theme-color" content="#f34e87" /> <!-- var(--yagami-pink) -->
</svelte:head>

<CentreNarrowPanel>
	<h1>Tournaments</h1>
	<div class="tournaments">
		{#each tournaments as tournament}
			<Tournament {tournament} />
		{/each}
	</div>
</CentreNarrowPanel>

<style>
	h1 {
		text-align: center;
	}
	.tournaments {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
