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
<footer><Footer /></footer>
