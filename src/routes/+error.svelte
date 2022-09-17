<script>
	import { page } from "$app/stores";
	import logo from "../assets/icons/gradient.svg";
	import bg from "../assets/blue bg.png";
</script>

<svelte:head>
	<title>{$page.status} - {$page.error.message}</title>
</svelte:head>

<div class="wrap">
	<div class="bg-wrap">
		<img class="bg" src={bg} alt="background" />
	</div>
	<img class="logo" src={logo} alt="logo" />
	<h1>We encountered some trouble</h1>
	<b>{$page.status} - {$page.error.message}</b>
	<p>Make sure your typed in the URL correctly, or try again later.</p>
</div>

<style>
	.bg-wrap {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		overflow: hidden;
	}

	img.bg {
		min-width: 100%;
	}
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
