<script lang="ts">
	import EditPage from '$lib/components/tournament-page/EditPage.svelte';
	import type { ActionData, PageData } from './$types.js';
	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Edit Tournament</title>
</svelte:head>

<div class="wrap">
	<EditPage {data} {form} />
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
