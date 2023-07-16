<script lang="ts">
	import ManageTeam from "$lib/components/tournament-page/team-page/ManageTeam.svelte";
    import type { PageServerData } from "./$types";
    export let data: PageServerData;
</script>

<div class="wrap">
	<ManageTeam {data} />
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>