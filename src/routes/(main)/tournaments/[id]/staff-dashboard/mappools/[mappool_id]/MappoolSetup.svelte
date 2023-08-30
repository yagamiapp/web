<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

    // Whether mappool is null should be handled in parent component
    export let mappool: db.MappoolWithMaps;
    export let locked: boolean;
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
                        No map selected...
                    {/if}
                </td>
                <td>
                    {#if !locked}
                        <form method="POST" action="?/search_map" use:enhance>
                            <input name="local_id" type="hidden" value={slot.identifier} />
                            <input name="id" type="number" value={slot.mapId} placeholder="Enter Map ID" />
                            {#if form?.mapSearchError?.slot == slot.identifier}
                                {form.mapSearchError.message}
                            {/if}
                        </form>
                    {:else}
                        {slot.mapId}
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
