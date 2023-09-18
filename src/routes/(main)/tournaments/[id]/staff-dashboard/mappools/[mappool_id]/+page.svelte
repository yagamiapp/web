<script lang="ts">
	import { ModColors, ModList, ModNames } from "$lib/ModEnums";
	import Setting from "$lib/components/common/Setting.svelte";
	import MappoolSetup from "./MappoolSetup.svelte";
	import type { ActionData, PageData, PageServerData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";

    export let data: PageServerData & PageData;
    export let form: ActionData;
    $: tournament = data.tournament;
    $: round = data.round;
    $: mappoolReleased = round.show_mappool;

    const confirmDelete: SubmitFunction = async ({ cancel, action }) => {
        if (action.search == '?/delete_mappool') {
            if (!confirm('Warning! This action is irreversible.\nAre you sure you want to continue?')) {
                cancel();
            }
        }
	}
</script>

{#key round}
    <div id="mappool-settings">
        <form method="POST" action="?/update_mappool" use:enhance={confirmDelete}>
            <Setting
                name="name"
                label="Round/Mappool Name"
                value={round.name}
                errors={form?.messages}
                type="text"
                --tournament-color={tournament.color}
            />
            <Setting
                name="acronym"
                label="Round/Mappool Acronym"
                value={round.acronym}
                errors={form?.messages}
                type="text"
                --tournament-color={tournament.color}
            />
            <Setting
                name="bans"
                label="Number of bans"
                value={round.bans}
                errors={form?.messages}
                type="number"
                --tournament-color={tournament.color}
            />
            <Setting
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
            <form id="generate-mappool" method="POST" action="?/generate_mappool" use:enhance>
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