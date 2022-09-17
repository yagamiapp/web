<script>
	import User from "../../../components/UserCard.svelte";
	export let data;
	let { user } = data;

	console.log(user.osu_username);
</script>

<svelte:head>
	<title>{user.osu_username}'s userpage</title>
</svelte:head>

<User {user} />
