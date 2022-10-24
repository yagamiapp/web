<script>
	import EditPage from "../../../../../components/tournament-page/EditPage.svelte";
	export let data;
</script>

<svelte:head>
	<title>Edit Tournament</title>
</svelte:head>

<div class="wrap">
	<EditPage {data} />
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
