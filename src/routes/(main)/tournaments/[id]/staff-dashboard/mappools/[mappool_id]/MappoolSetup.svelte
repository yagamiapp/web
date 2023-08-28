<script lang="ts">
	import type { ActionData } from "./$types";

    // Whether mappool is null should be handled in parent component
    export let mappool: db.MappoolWithMaps;
    export let form: ActionData;

    let maps: db.MapInPoolWithMap[] = mappool.Maps;
</script>

<table>
    <thead>
        <tr>
            <th>Local ID</th>
            <th>Map</th>
            <th>Map ID</th>
        </tr>
    </thead>
    <tbody>
        {#each maps as slot}
            <tr>
                <td>{slot.identifier}</td>
                <td>
                    {#if slot.mapId}
                        {slot.Map?.artist} - {slot.Map?.title}
                    {:else}
                        {#if form?.mapSearchError}
                            {form.mapSearchError.message}
                        {:else}
                            No map selected...
                        {/if}
                    {/if}
                </td>
                <td>
                    <form method="POST" action="?/search_map">
                        <input name="local_id" type="hidden" value={slot.identifier} />
                        <input name="id" type="number" value={slot.mapId} placeholder="Enter Map ID" />
                    </form>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<form method="POST" action="?/release_mappool">
    <button type="submit">Release Mappool</button>
</form>