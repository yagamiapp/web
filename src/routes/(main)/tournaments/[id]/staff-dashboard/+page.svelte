<script lang="ts">
	import type { LayoutServerData } from '../$types';

    export let data: LayoutServerData;

    let { tournament } = data;
    let { name } = tournament;
</script>

<svelte:head>
    <title>{name} - Staff Dashboard</title>

    <meta name="twitter:card" content="summary" />
	<meta property="og:title" content="Staff - {name}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Manage various aspects of {name} (staff only)" />
</svelte:head>

<h1>Dashboard TBD</h1>
<!-- <Dashboard {tournament}>

</Dashboard> -->