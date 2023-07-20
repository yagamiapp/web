<script>
	import Default from '$lib/assets/icons/white.svg';
	import { StatusCodes } from '$lib/StatusCodes';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} {$page.error?.message}</title>
</svelte:head>

<!-- TODO: Reformat this page -->
<div class="wrap">
	<div class="top">
		<img src={Default} alt="" class="icon" />
	</div>

	<div class="error">
		{#if $page.status == StatusCodes.NOT_FOUND}
			<div>
				Tournament not found! <br /> Make sure you typed in the URL correctly
			</div>
		{:else}
			<div>{$page.status}<br />{$page.error?.message}</div>
		{/if}
	</div>
</div>

<style>
	.top {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
		height: 60px;
	}
	.error {
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg3);
		height: 300px;
	}

	.error div {
		margin: 20px;
	}

	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
