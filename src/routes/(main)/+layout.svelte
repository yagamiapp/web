<script>
	import Footer from "../../components/Footer.svelte";
	import Sidebar from "../../components/Sidebar.svelte";

	export let data;
</script>

<header>
	<Sidebar {data} />
</header>
<main>
	<slot />
</main>
<footer><Footer /></footer>
