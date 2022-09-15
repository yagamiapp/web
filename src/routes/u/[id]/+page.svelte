<script>
	import User from "../User.svelte";
	export let data;
</script>

<svelte:head>
	<title>{data.osu_username}'s userpage</title>
</svelte:head>

<User {...data} />
