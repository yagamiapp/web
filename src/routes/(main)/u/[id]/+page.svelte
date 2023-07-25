<script>
	import User from '$lib/components/common/cards/User.svelte';
	export let data;
	let { user } = data;
</script>

<svelte:head>
	<title>{user.username}'s userpage</title>
</svelte:head>

<User {user} />
