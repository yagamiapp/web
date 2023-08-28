<script lang="ts">
    // Whether mappool is null should be handled in parent component
    export let mappool: db.MappoolWithMaps;

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
                        {slot.Map?.title}
                    {:else}
                        No map selected...
                    {/if}
                </td>
                <td>
                    <form method="POST" action="?/search_map">
                        <input name="map_in_pool_id" type="hidden" value="{slot.identifier}{slot.mappoolId}" />
                        <input name="id" type="number" value={slot.mapId} placeholder="Enter Map ID" />
                    </form>
                </td>
            </tr>
        {/each}
    </tbody>
</table>