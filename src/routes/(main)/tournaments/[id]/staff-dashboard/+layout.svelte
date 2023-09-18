<script lang="ts">
    import type { LayoutServerData } from './$types';

    export let data: LayoutServerData;
    let { banner_url, color } = data.tournament;
</script>

<svelte:head>
    <meta property="og:image" content={banner_url} />
	<meta name="theme-color" content={color} />
</svelte:head>

<slot />

<style>
</style>
