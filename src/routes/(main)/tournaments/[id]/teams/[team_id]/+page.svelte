<script lang="ts">
	import ManageTeam from '$lib/components/tournament-page/team-page/ManageTeam.svelte';
	import type { ActionData, PageServerData } from './$types';
	export let data: PageServerData;
	export let form: ActionData;
</script>

<div class="wrap">
	<ManageTeam {data} {form} />
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
