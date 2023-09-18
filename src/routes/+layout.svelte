<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let currentUrl: string;
	onMount(() => {
		currentUrl = window.location.href;
	});
</script>

<svelte:head>
	<meta property="og:url" content={currentUrl} />
</svelte:head>

<slot />
