<script lang="ts">
    import { matchStates } from "$lib/MatchStates";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let match: db.MatchWithTeams;
    export let selected: boolean = false;
    let { Teams: teams } = match;
</script>

<div class="compact-match" class:selected={selected} on:click={() => dispatch("select", match)} on:keydown>

    <p id="match-id">ID:{match.id}</p>

    {#each teams as team, index}
        <div class="team-{index+1} icon">
            <img src={team.Team.icon_url} alt="Team {index+1} icon" />
        </div>
        <h4 class="team-{index+1} name"><a href="/tournaments/{team.Team.tournamentId}/teams/{team.Team.id}">{team.Team.name}</a></h4>
        <p class="team-{index+1} score-box">
            {team.score}
        </p>
    {/each}

    <p id="status">Status: {matchStates[match.state]}</p>
</div>

<style>
    .compact-match {
        display: grid;
        grid-template-columns: 0.7fr 1fr 2fr repeat(2, 0.5fr) 2fr repeat(2, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0.4rem;
        grid-row-gap: 0px;

        border: 0.1rem solid var(--font-color);
        border-radius: 0.4rem;
        background-color: var(--bg4);
        padding: 0.4rem;
        margin: 0.2rem;

        width: 100%;
        height: 2.5rem;
    }
    .selected {
        border-color: mediumspringgreen;
    }

    p, h4, .icon {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    a {
        text-decoration: none;
        color: var(--font-color);
    }

    img {
        height: 2.5rem;
    }
    .team-2.icon {
        grid-area: 1 / 7 / 2 / 8;
    }

    .team-1 {
        text-shadow: 0 0 0.3rem red;
    }
    .team-2 {
        text-shadow: 0 0 0.3rem blue;
    }

    .team-1.score-box {
        border-right: 0.2rem solid var(--bg3);
    }
    .team-2.score-box {
        border-left: 0.2rem solid var(--bg3);
        grid-area: 1 / 5 / 2 / 6;
    }
    
    #status  {
        font-size: 0.8rem;
    }

    @media screen and (min-width: 1800px) {
        .compact-match {
            width: 48%;
        }
    }
</style>