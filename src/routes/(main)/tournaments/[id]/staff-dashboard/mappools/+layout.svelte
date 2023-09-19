<script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageData } from "./$types";

    export let data: PageData;
    $: tournament = data.tournament;
    $: rounds = tournament.rounds;
</script>

<svelte:head>
    <title>Mappools - Staff View - {tournament.name}</title>

    <meta name="twitter:card" content="summary" />
	<meta property="og:title" content="Mappools - Staff - {tournament.name}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Edit mappools for {tournament.name}" />
</svelte:head>

<div id="mappool-list">
    <h1>Mappools</h1>

    <div id="mappool-nav">
        {#key rounds}
            {#each rounds as round (round.id)}
                <a href="/tournaments/{tournament.id}/staff-dashboard/mappools/{round.id}">
                    <button>
                        {round.name}
                    </button>
                </a>
            {/each}
        {/key}
        <form method="POST" action="/tournaments/{tournament.id}/staff-dashboard/mappools?/create_mappool" use:enhance>
            <button id="new-mappool">
                +
            </button>
        </form>
    </div>
</div>

<slot />

<style>

</style>