<script lang="ts">
	import type { LayoutServerData } from '../$types';

    export let data: LayoutServerData;

    let { tournament } = data;
    let { name } = tournament;
</script>

<svelte:head>
    <title>{name} - Staff Dashboard</title>
</svelte:head>

<h1>Dashboard TBD</h1>
<!-- <Dashboard {tournament}>

</Dashboard> -->