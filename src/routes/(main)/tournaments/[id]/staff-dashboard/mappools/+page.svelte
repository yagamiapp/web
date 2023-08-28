<script lang="ts">
    import EditPageSetting from "$lib/components/tournament-page/edit-page/EditPageSetting.svelte";
    import type { PageServerData, PageData, ActionData } from "./$types";
    import { Mods, ModList, ModNames, ModColors } from "$lib/ModEnums";
	import MappoolSetup from "./MappoolSetup.svelte";

    export let data: PageServerData & PageData;
    export let form: ActionData;
    let { tournament } = data;
    let { rounds } = tournament;

    // Right now, rounds and mappools are 1:1, but in the future this should change
    // So the svelte code below should be switched to using mappool objects instead of round objects
    // when we do that
    let selectedRound: db.RoundWithEverything | undefined = undefined;

    // Generate mappool format logic
    // Unfortunately, this is completely client-side (resets on refresh unless mappool is released)
    // In the future the format can be stored in the database so poolers can suggest maps for different slots
    
    // List of local mappool IDs
    let mappoolSlots: string[] = [];

    // const generateMappoolFormat = () => {
    //     // Get number of slots per mod
    //     let slotsPerMod: [string, number][] = [];
    //     for (const mod of ModList) {
    //         const nOfSlots = document.getElementById(mod)?.valueAsNumber;
    //         if (nOfSlots) {
    //             slotsPerMod.push([mod, nOfSlots]);
    //         }
    //     }

    //     // Construct list of local IDs of maps in the mappool
    //     let localIds: string[] = [];
    //     for (const modPool of slotsPerMod) {
    //         const modPoolName = modPool[0];
    //         const nOfSlots = modPool[1];

    //         for (let slot = 1; slot <= nOfSlots; slot++) {
    //             localIds.push(modPoolName + slot);
    //         }
    //     }
        
    //     return localIds;
    // };
</script>

<svelte:head>
    <title>Mappools - Staff View - {tournament.name}</title>
</svelte:head>

<div id="mappool-list">
    <h1>Mappools</h1>

    <div id="mappool-nav">
        {#each rounds as round (round.id)}
            <button 
                on:click={() => (selectedRound = round)}
                class:selected={selectedRound?.id === round.id}
            >
                {round.name}
            </button>
        {/each}
        <form method="POST" action="?/create_mappool">
            <button id="new-mappool">
                +
            </button>
        </form>
    </div>
</div>

{#if selectedRound}
    {#key selectedRound}
        <div id="mappool-settings">
            <form method="POST" action="?/update_mappool">
                <input name="id" type="hidden" value={selectedRound.id} />

                <EditPageSetting
                    name="name"
                    label="Round/Mappool Name"
                    value={selectedRound.name}
                    errors={form?.messages}
                    type="text"
                    --tournament-color={tournament.color}
                />
                <EditPageSetting
                    name="acronym"
                    label="Round/Mappool Acronym"
                    value={selectedRound.acronym}
                    errors={form?.messages}
                    type="text"
                    --tournament-color={tournament.color}
                />
                <EditPageSetting
                    name="bans"
                    label="Number of bans"
                    value={selectedRound.bans}
                    errors={form?.messages}
                    type="number"
                    --tournament-color={tournament.color}
                />
                <EditPageSetting
                    name="best_of"
                    label="Best of ?"
                    value={selectedRound.best_of}
                    errors={form?.messages}
                    type="number"
                    --tournament-color={tournament.color}
                />

                <div class="submit-buttons">
                    <button type="submit">Save Changes</button>
                    <button formaction="?/delete_mappool">Delete Mappool</button>
                </div>
            </form>
        </div>

        <div id="mappool-format-creator">
            <h2>Mappool Format</h2>
            <table id="mappool-format">
                <thead>
                    <tr>
                        <th>Mod</th>
                        <th>Number of slots</th>
                    </tr>
                </thead>
                <tbody>
                    {#each ModList as mod}
                        <tr>
                            <td style="color: {ModColors[mod]}">
                                {ModNames[mod]}
                            </td>
                            <td>
                                <input name="{mod}" form="generate-mappool" type="number" value="0" />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <form id="generate-mappool" method="POST" action="?/generate_mappool">
                <button>Generate Mappool Format</button>
            </form>
        </div>

        <div id="mappool-final">
            <h2>Mappool Setup</h2>

            {#if selectedRound.mappool}
                <MappoolSetup mappool={selectedRound.mappool} />
            {/if}
        </div>
    {/key}
{:else}
    <p>Select a mappool.</p>
{/if}

<style>

</style>