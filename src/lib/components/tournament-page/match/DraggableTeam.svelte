<script lang="ts">
	import type { Team } from "@prisma/client";

    export let item: Team;
</script>

<div class="draggable-team">
    <img src={item.icon_url} class="icon" alt="Team icon" />
    {item.name}
</div>

<style>
    .draggable-team {
        margin-bottom: 0.3rem;
        padding: 0.3rem;
        text-align: center;
        font-size: 1rem;
        border-radius: 0.3rem;
        border: 0.1rem solid var(--font-color);
    }
    .icon {
        height: 1rem;
    }
</style>