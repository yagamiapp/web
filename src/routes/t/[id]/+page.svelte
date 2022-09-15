<script>
	import Tournament from "../Tournament.svelte";
	export let data;

	let e = JSON.stringify(data);
</script>

<Tournament {...data.tournament} />
<div>{e}</div>
