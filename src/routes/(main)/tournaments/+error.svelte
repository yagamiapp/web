<script>
	import logo from '$lib/assets/icons/gradient.svg';
	import { page } from '$app/stores';
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';
</script>

<CentreNarrowPanel title="{$page.status} - {$page.error?.message}">

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
