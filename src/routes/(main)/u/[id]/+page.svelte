<script lang="ts">
	import User from '$lib/components/common/cards/User.svelte';
	import type { PageServerData } from './$types.js';
	
	export let data: PageServerData;
	let { user } = data;
</script>

<svelte:head>
	<title>{user.username}'s userpage</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content="{user.username}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="" />
	<meta name="theme-color" content="#f34e87" /> <!-- var(--yagami-pink) -->
</svelte:head>

<User {user} />
