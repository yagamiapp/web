<script>
	import { page } from "$app/stores";
	import logo from "../assets/yagami var.png";
</script>

<svelte:head>
	<title>{$page.status} - {$page.error.message}</title>
</svelte:head>

<div>
	<img src={logo} alt="" />
	<h1>We encountered some trouble</h1>
	<b>{$page.status} - {$page.error.message}</b>
	<p>Make sure your typed in the URL correctly, or try again later.</p>
</div>

<style>
	img {
		width: 500px;
	}
	div {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
