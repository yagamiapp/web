<script lang="ts">
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';
	import Tournament from '$lib/components/common/cards/Tournament.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let { tournaments } = data;
</script>

<svelte:head>
	<title>Tournaments</title>
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
	.tournaments {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
