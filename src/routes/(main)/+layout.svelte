<script>
	import Footer from '$lib/components/common/Footer.svelte';
	import Sidebar from '$lib/components/common/Sidebar.svelte';

	export let data;
</script>

<header>
	<Sidebar {data} />
</header>
<main>
	<slot />
</main>
<footer>
	<Footer />
</footer>

<style>
	header,
	footer,
	main {
		position: relative;
	}
	header,
	footer {
		z-index: 1;
	}
	main {
		z-index: 0;
	}
</style>
