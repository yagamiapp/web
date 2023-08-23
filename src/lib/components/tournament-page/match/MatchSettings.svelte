<script lang="ts">
    import { matchStates, MatchStates } from "$lib/MatchStates";

    export let match: db.MatchWithTeams;
    export let rounds: db.RoundWithEverything[];
</script>

<h2>Match {match.id}</h2>
<p>Status: {matchStates[match.state]}</p>

{#if match.state == MatchStates.NOT_STARTED}
    <form method="POST" action="?/update_match">
        <input type="hidden" name="match_id" value={match.id} />
        
        <label for="rounds">Round: </label>
        <select name="rounds" required>
            {#each rounds as round}
                <option value={round.id}>{round.name}</option>
            {/each}
        </select>

        <p>
            <button type="submit">Update</button>
            <button type="submit" formaction="?/delete_match">Delete</button>
        </p>
    </form>
{/if}

{#if match.mp_link}
    <p><a href={match.mp_link}>MP Link</a></p>
{/if}