<script lang="ts">
	import { ModColors, ModList, ModNames } from "$lib/ModEnums";
	import EditPageSetting from "$lib/components/tournament-page/edit-page/EditPageSetting.svelte";
	import MappoolSetup from "./MappoolSetup.svelte";
	import type { ActionData, PageData, PageServerData } from "./$types";
	import MappoolFull from "$lib/components/common/cards/MappoolFull.svelte";
	import { enhance } from "$app/forms";

    export let data: PageServerData & PageData;
    export let form: ActionData;
    $: tournament = data.tournament;
    $: round = data.round;
    $: mappoolReleased = round.show_mappool;
</script>

{#key round}
    <div id="mappool-settings">
        <form method="POST" action="?/update_mappool" use:enhance>
            <EditPageSetting
                name="name"
                label="Round/Mappool Name"
                value={round.name}
                errors={form?.messages}
                type="text"
                --tournament-color={tournament.color}
            />
            <EditPageSetting
                name="acronym"
                label="Round/Mappool Acronym"
                value={round.acronym}
                errors={form?.messages}
                type="text"
                --tournament-color={tournament.color}
            />
            <EditPageSetting
                name="bans"
                label="Number of bans"
                value={round.bans}
                errors={form?.messages}
                type="number"
                --tournament-color={tournament.color}
            />
            <EditPageSetting
                name="best_of"
                label="Best of ?"
                value={round.best_of}
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

    {#if !mappoolReleased}

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
    {/if}

    {#if round?.mappool?.Maps?.length}
        <div id="mappool-final">
            <h2>Mappool {!mappoolReleased ? "Setup" : ""}</h2>

            {#if round.mappool}
                <MappoolSetup mappool={round.mappool} locked={mappoolReleased} {form} />
            {/if}

            <form method="POST" action="?/release_mappool">
                <button type="submit">{mappoolReleased ? "Unrelease" : "Release"} Mappool</button>
                {#if form?.releasePoolResponse}
                    {form.releasePoolResponse}
                {/if}
            </form>
        </div>
    {/if}

{/key}