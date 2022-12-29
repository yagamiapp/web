<script>
	export let data;
	import AddAccountButton from "../../../../components/AddAccountButton.svelte";
	import { browser } from "$app/environment";
	import DiscordAccount from "../../../../components/settings/DiscordAccount.svelte";
  import TwitchAccount from "../../../../components/settings/TwitchAccount.svelte";
	import Session from "../../../../components/settings/Session.svelte";
	let { user, discordAccounts, twitchAccounts, origin, sessions } = data;
  console.log(twitchAccounts);

	let themeChecked = true;
	if (browser) {
		themeChecked = !document.body.classList.contains("lightmode");
	}

	const switchTheme = ({ detail }) => {
		if (detail) {
			document.body.classList.remove("lightmode");
		} else {
			document.body.classList.add("lightmode");
		}
	};
</script>

<svelte:head>
	<title>{user.username} - Settings</title>
</svelte:head>

<div class="wrap">
	<div class="panel">
		<div class="top">
			<img src="https://s.ppy.sh/a/{user.id}" alt="" />
      <b>{user.username}'s profile Settings</b>
		</div>
		<!-- <section id="appearance">
			<h1>Appearance</h1>
			<div class="switch">
				<span> Dark Mode</span>
				<Switch checked={themeChecked} on:check={switchTheme} />
			</div>
		</section> -->
		<section id="integrations">
			<h1>Integrations</h1>
			<div class="discord">
				<h2>Discord</h2>
				{#if discordAccounts.length > 0}
					{#each discordAccounts as account}
						<DiscordAccount {account} />
					{/each}
				{:else}
          <h3>
            No Accounts
          </h3>
				{/if}
				<AddAccountButton {origin} type="discord" />
			</div>
			<div class="twitch">
				<h2>Twitch</h2>
				{#if twitchAccounts.length > 0}
					{#each twitchAccounts as account}
						<TwitchAccount {account} />
					{/each}
				{:else}
          <h3>
            No Accounts
          </h3>
				{/if}
				<AddAccountButton {origin} type="twitch" />
			</div>
		</section>
		<hr />
		<section id="sessions">
			<h1>Sessions</h1>
			{#each sessions as session}
				<Session {session} />
			{/each}
		</section>
	</div>
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.panel {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		display: flex;
		flex-direction: column;
		background-color: var(--bg2);
	}
	.panel section {
		padding: 20px;
	}
	.top {
		width: 100%;
		height: 60px;
		background-color: var(--bg3);
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.top img {
		height: 45px;
		border-radius: 50px;
		margin-left: 10px;
	}
	hr {
		width: 95%;
		border: solid 1px var(--bg3);
	}
	#integrations div {
		margin-left: 50px;
		font-size: 0.8em;
	}
</style>
