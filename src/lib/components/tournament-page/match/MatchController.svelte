<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
    import List from "$lib/components/common/drag-and-drop/List.svelte";
	import DraggableTeam from "$lib/components/tournament-page/match/DraggableTeam.svelte";
	import type { Match, Round, Team, TeamInMatch } from "@prisma/client";
	import type { ActionData } from "../../../../routes/(main)/tournaments/[id]/staff-dashboard/matches/$types";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";
    
    export let rounds: db.RoundWithEverything[] = [];
    export let form: ActionData;
    export let selectedMatch: db.MatchWithTeams | undefined = undefined;

    // Dnd-List options
    const dropTargetStyle = { 
        'border': '0.2rem dashed yellow', 
        'border-radius': '0.7rem', 
    }
    
    // 'team1' and 'team2' should only hold 1 item but are arrays for DnD list compatibility
    let team1: Team[] = [];
    let team2: Team[] = [];
    let matchSelectionSuggestions: db.MatchWithTeams[] = [];
    let teamsSelected: boolean = false;

    // If a match has been pre-selected, update the team slots
    $: if (selectedMatch) {
        team1[0] = selectedMatch.Teams[0].Team;
        team2[0] = selectedMatch.Teams[1].Team;
    }
    
    function team1Drop (updatedTeams: Team[]) {
        team1 = updatedTeams;
        updateSelectedMatch();
    }
    function team2Drop (updatedTeams: Team[]) {
        team2 = updatedTeams;
        updateSelectedMatch();
    }
    
    function updateSelectedMatch() {
        if (team1.length == 1 && team2.length == 1) {
            teamsSelected = true;
            
            // Search for a match containing these teams
            rounds.forEach((round: db.RoundWithEverything) => {
                round.Match.forEach((match: db.MatchWithTeams) => {
                    const teamsInMatch = match.Teams;
                    
                    if (teamsInMatch[0].teamId == team1[0].id && teamsInMatch[1].teamId == team2[0].id ||
                    teamsInMatch[0].teamId == team2[0].id && teamsInMatch[1].teamId == team1[0].id) {
                        matchSelectionSuggestions.push(match);
                    }
                });
            });

            console.log(matchSelectionSuggestions);
            if (matchSelectionSuggestions.length > 0) {
            }
        }
        else {
            teamsSelected = false;
            matchSelectionSuggestions = [];
            selectedMatch = undefined;
        }
    }

    let loading = false;
    const matchCreated: SubmitFunction = async () => {
        loading = true;
        return async ({ update, result }) => {
            await update();
            loading = false;
        }
    }
</script>

<div id="match-controller">

    <div id="teams">
        <div id="team1" class="team-drop-zone">
            <h3>Team 1</h3>
            <div class="team-list" class:team-selected={team1.length == 1}>
                <List
                    itemsData={team1}
                    itemComponent={DraggableTeam}
                    onDrop={team1Drop}
                    {dropTargetStyle}
                    dropFromOthersDisabled={team1.length == 1}
                />
            </div>
        </div>

        <div id="vs">
            <h2>vs.</h2>
        </div>

        <div id="team2" class="team-drop-zone">
            <h3>Team 2</h3>
            <div class="team-list">
                <List
                    itemsData={team2}
                    itemComponent={DraggableTeam}
                    onDrop={team2Drop}
                    {dropTargetStyle}
                    dropFromOthersDisabled={team2.length == 1}
                />
            </div>
        </div>
    </div>

    <div id="match-settings">
        
        {#if selectedMatch}
            <h1>Match {selectedMatch.id}</h1>
        {:else}
            {#if teamsSelected}
                {#if matchSelectionSuggestions.length == 0}
                    <p>No match exists for this matchup.</p>
                {:else}
                    <p>Select a match or create a new match:
                    {#each matchSelectionSuggestions as match}
                        <br><button on:click={() => selectedMatch = match}>
                            Match {match.id} ({rounds.find((round) => round.id == match.roundId)?.acronym})
                        </button>
                    {/each}
                    </p>
                {/if}
                
                {#if rounds.length > 0}

                    {#if loading}
                        <LoadingSpinner scale={0.3} />
                    {:else}
                        <form method="POST" action="?/create_match" use:enhance={matchCreated}>
                            <button name="matchup_id" type="submit" value="{team1[0].id}vs{team2[0].id}">Create New Match</button>
                            <label for="rounds">for round: </label>
                            <select name="rounds" required>
                                {#each rounds as round}
                                    <option value={round.id}>{round.name}</option>
                                {/each}
                            </select>
                        </form>
                    {/if}

                    {#if form?.status == 500}
                        <p class="error">{form.message}</p>
                    {/if}
                {:else}
                    <p>There are no rounds to create matches for.</p>
                {/if}
                
            {:else}
                <p>Drag teams into the slots or select a match.</p>
            {/if}
        {/if}

    </div>
    
</div>

<style>
    #match-controller {
        height: 40vh;
        margin: 0.4rem;
        padding: 0.4rem;

        display: flex;
        flex-direction: column;

        background-color: var(--bg4);
        border: 0.2rem solid var(--bg1);
        border-radius: 1rem;
    }

    #teams {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        border-bottom: 0.15rem solid var(--bg1);
    }
    .team-drop-zone {
        margin: 0.4rem;
        width: 30%;
        text-align: center;
    }
    .team-drop-zone h3 {
        margin: 0;
        margin-bottom: 0.2rem;
    }
    #vs {
        width: 20%;
        text-align: center;
    }

    #match-controller :global(section) {
        height: 2rem;
        text-align: center;
        border: 0.2rem dashed;
        border-radius: 0.7rem;
    }
    #team1 :global(section) {
        border-color: red;
    }
    #team2 :global(section) {
        border-color: blue;
    }

    #match-settings {
        padding: 0.4rem;
        text-align: center;
    }
</style>