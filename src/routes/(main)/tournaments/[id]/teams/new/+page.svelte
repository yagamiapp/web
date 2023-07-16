<script lang="ts">
	import TournamentHeaderButton from "$lib/components/tournament-page/TournamentHeaderButton.svelte";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<h1>Registration</h1>

<p>{data.success}</p>

<TournamentHeaderButton url="/tournaments/{data.tournament.id}" text={"BACK"} />