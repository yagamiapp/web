<script lang="ts">
    import Dashboard from '$lib/components/tournament-page/staff/StaffSidebar.svelte';
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