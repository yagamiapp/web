<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
    import { matchStates, MatchStates } from "$lib/MatchStates";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let match: db.MatchWithTeams;
    export let rounds: db.RoundWithEverything[];

    $: existingStartTime = match.start_time?.toISOString().substring(0, 16) ?? ""
    $: newStartTime = existingStartTime;

    function validateNotInThePast(event: KeyboardEvent) {
        if (newStartTime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
            const startTimeAsDate = new Date(newStartTime);
            if (startTimeAsDate < new Date()) {
                alert("Warning!\nSetting the start time to the past will default to the current time.\n\nThis will trigger the Discord bot to prompt the players to start the match immediately");
            }
        }
    }

    const confirmDelete: SubmitFunction = async ({ cancel, action }) => {
        if (action.search == '?/delete_match') {
            if (!confirm('Warning! This action is irreversible.\nAre you sure you want to continue?')) {
                cancel();
            }
            else {
                dispatch('clear');
            }
        }
	}
</script>

<h2>Match {match.id}</h2>
<p>Status: {matchStates[match.state]}</p>

{#if match.state == MatchStates.NOT_STARTED}
    <form method="POST" action="?/update_match" use:enhance={confirmDelete}>
        <input type="hidden" name="match_id" value={match.id} />
        
        <label for="rounds">Round: </label>
        <select name="rounds" required>
            {#each rounds as round}
                <option value={round.id} selected={round.id == match.roundId}>{round.name}</option>
            {/each}
        </select><br>

        <label for="date">Start Time (UTC):</label>
        <!-- Type "datetime-local" input elements format the value as a string: "[YYYY]-[MM]-[DD]T[HH]:[MM]" -->
        <!-- This is equivalent to the first 16 characters of an ISO date string -->
        <input 
            type="datetime-local"
            name="start_time"
            bind:value={newStartTime}
            on:keyup={validateNotInThePast}
        />

        <p>
            <button type="submit">Update</button>
            <button type="submit" formaction="?/delete_match">Delete</button>
            <button type="button" on:click={() => { dispatch('clear') }}>Clear</button>
        </p>
    </form>
{/if}

{#if match.mp_link}
    <p><a href={match.mp_link}>MP Link</a></p>
{/if}