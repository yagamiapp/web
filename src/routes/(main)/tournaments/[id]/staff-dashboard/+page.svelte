<script lang="ts">
	import type { LayoutServerData } from '../$types';

    export let data: LayoutServerData;

    let { tournament } = data;
</script>

<svelte:head>
    <title>{tournament.name} - Staff Dashboard</title>
</svelte:head>

<h1>Dashboard TBD</h1>
<!-- <Dashboard {tournament}>

</Dashboard> -->