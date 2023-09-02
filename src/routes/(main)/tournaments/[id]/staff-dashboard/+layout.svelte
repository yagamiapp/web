<script lang="ts">
	import type { LayoutData } from './$types';
	import yagami from '$lib/assets/icons/gradient.svg';
	import SidebarButton from './nav-components/SidebarButton.svelte';

	import bracket from './nav-components/bracket.svg';
	import dashboard from './nav-components/dashboard.svg';
	import matches from './nav-components/matches.svg';
	import settings from './nav-components/settings.svg';
	import mappools from './nav-components/mappools.svg';

	export let data: LayoutData;

	const tournament_icon = data.tournament?.icon_url;
	const id = data.tournament.id;
</script>

<nav class="sidebar" style="--color: {data.tournament.color}">
	<div class="icons">
		<img src={yagami} alt="yagami" />
		<img src={tournament_icon} alt="yagami" />
	</div>
	<div class="buttons">
		<SidebarButton {id} href="/" icon={dashboard}>Dashboard</SidebarButton>
		<SidebarButton {id} href="/matches" icon={matches}>Matches</SidebarButton>
		<SidebarButton {id} href="/bracket" icon={bracket}>Bracket</SidebarButton>
		<SidebarButton {id} href="/mappools" icon={mappools}>Mappools</SidebarButton>
		<SidebarButton {id} href="/settings" icon={settings}>Settings</SidebarButton>
		<SidebarButton {id} href="./">Tournament Page</SidebarButton>
	</div>
</nav>
<div class="content">
	<slot />
</div>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100vh;
		background-color: var(--bg2);
		/* z-index: -1; */
	}
	.content {
		position: absolute;
		top: 0;
		left: 250px;
		width: calc(100% - 250px);
		min-height: 100%;
	}
	.icons {
		width: 90%;
		margin: auto;
		display: flex;
		gap: 10px;
		justify-content: center;
		border-bottom: solid 4px var(--color);
	}
	.icons img {
		padding: 5px;
		border-radius: 15px;
		width: 50px;
		height: 50px;
	}
</style>
