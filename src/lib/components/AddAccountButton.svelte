<script>
	export let origin;
	export let type = 'discord';
	import { env } from '$env/dynamic/public';

	let types = {
		discord: {
			url: `https://discord.com/oauth2/authorize?client_id=${env.PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${origin}%2Fauth%2Fdiscord&response_type=code&scope=identify%20guilds.join%20guilds`,
			color: '#5865F2',
			img: 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/discord.svg'
		},
		twitch: {
			url: `https://id.twitch.tv/oauth2/authorize?client_id=${env.PUBLIC_TWITCH_CLIENT_ID}&redirect_uri=${origin}/auth/twitch&force_verify=true&response_type=code`,
			color: '#9146FF',
			img: 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/twitch.svg'
		}
	};

	let { url, color, img } = types[type];
</script>

<a href={url} style="--color: {color}">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="currentColor"
		class="bi bi-plus"
		viewBox="0 0 16 16"
	>
		<path
			d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
		/>
	</svg>
	<span class="icon" style="mask: url({img}); -webkit-mask: url({img})" alt="" />
	<span>Add new</span>
</a>

<style>
	a {
		display: block;
		background-color: var(--color);
		width: fit-content;
		height: 30px;
		padding: 0px 15px 0px 5px;
		font-size: bold;
		display: flex;
		justify-content: center;
		border-radius: 5px;
		align-items: center;
		color: white;
		gap: 5px;
		text-decoration: none;
	}

	.icon {
		display: inline-block;
		width: 20px;
		height: 20px;
		background-color: white;
	}
</style>
