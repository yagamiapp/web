<script lang="ts">
	import link_icon from './external-link.svg';
	export let icon: string = link_icon;
	export let href: string;
	export let id: number;

	let link = true;

	if (href.startsWith('/')) {
		href = `/tournaments/${id}/staff-dashboard${href}`;
		link = false;
	}
</script>

{#if !link}
	<a {href}>
		<slot>Button</slot>
		<img src={icon} alt="" />
	</a>
{:else}
	<a class="link" {href}>
		<slot>Button</slot>
		<img src={link_icon} alt="" />
	</a>
{/if}

<style>
	a {
		position: relative;
		display: block;
		color: white;
		text-decoration: none;
		background: var(--bg3);
		width: calc(100% - 10px * 2 - 15px * 2);
		font-weight: bold;
		height: 24px;
		border-radius: 15px;
		padding: 10px;
		margin: 5px 15px;
	}
	a.link {
		font-weight: normal;
		background: transparent;
	}
	img {
		position: absolute;
		right: 10px;
		width: 24px;
		height: 24px;
	}
</style>
