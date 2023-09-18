<script>
	import { page } from '$app/stores';
	import logo from '$lib/assets/icons/gradient.svg';
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

<div class="wrap">
	<img class="logo" src={logo} alt="logo" />
	<h1>We encountered some trouble</h1>
	<b>{$page.status} - {$page.error?.message ?? "No error message."}</b>
	<p>Make sure your typed in the URL correctly, or try again later.</p>
</div>

<style>
	img.logo {
		width: 500px;
	}
	.wrap {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
