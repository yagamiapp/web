<script>
	import logo from '$lib/assets/icons/gradient.svg';
	import { page } from '$app/stores';
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';
</script>

<svelte:head>
	<title>{$page.status} - {$page.error?.message ?? "No error message."}</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content="Error {$page.status}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="{$page.error?.message ?? "No error message."}" />
	<meta property="og:image" content="" />
	<meta name="theme-color" content="#ff0000" />
</svelte:head>

<CentreNarrowPanel>

	<div class="error">
		<img class="logo" src={logo} alt="logo" />
		<h1>We encountered some trouble</h1>
		<b>{$page.status} - {$page.error?.message ?? "No error message."}</b>
		<p>Try again later. If this issue persists, contact tournament staff.</p>
	</div>
	
</CentreNarrowPanel>

<style>
	.error {
		max-width: 1000px;
		background-color: var(--bg3);
		height: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.logo {
		margin-top: 1.5rem;
		height: 150px;
	}
</style>
