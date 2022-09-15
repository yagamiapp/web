<script>
	export let data;

	let { id } = data;
</script>

<nav>
	<a href="/t/{id}">home</a>
	<a href="/t/{id}/mappools">mappools</a>
	<a href="/t/{id}/teams">teams</a>
</nav>
<slot />
