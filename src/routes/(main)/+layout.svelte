<script>
	import Footer from '$lib/components/Footer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	export let data;
</script>

<header>
	<Sidebar {data} />
</header>
<main>
	<slot />
</main>
<footer><Footer /></footer>
