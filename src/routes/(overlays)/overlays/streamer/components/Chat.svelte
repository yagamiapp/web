<script>
	import { onMount } from 'svelte';

	export let socketData;

	let chatbox;
	let chat;
	let scoreVisible;

	let transformString;
	$: {
		chat = socketData?.tourney?.manager?.chat;
		if (chatbox) {
			chatbox.scrollTop = chatbox.scrollHeight;
		}
		if (scoreVisible != socketData?.tourney?.manager?.bools?.scoreVisible) {
			scoreVisible = socketData?.tourney?.manager?.bools?.scoreVisible;
			if (scoreVisible) {
				transformString = 'translateY(-150%)';
			} else {
				transformString = 'translateY(0)';
			}
		}
	}

	onMount(() => {
		chatbox.scrollTop = chatbox.scrollHeight;
	});
</script>

<div class="chatbox" bind:this={chatbox} style="transform: {transformString}">
	{#if chat}
		{#each chat as msg}
			<div class="{msg.team} message">
				<span class="time">{msg.time}</span>
				<span class="user">{msg.name}</span>
				<span class="msg">{msg.messageBody}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	.chatbox {
		position: relative;
		width: 40%;
		height: 83%;
		border-radius: 10px;
		margin: 0.5%;
		padding: 0.4%;
		overflow: hidden;
		z-index: 1;
		transition: transform 0.7s ease;
		background-color: var(--bg1);
	}

	.message {
		font-size: 0.85em;
		font-family: Quicksand, sans-serif;
	}
	.time {
		color: #aaaaaa;
	}
	.user {
		font-weight: bold;
		padding: 2px;
	}

	.bot.message .user {
		background-color: rgb(202, 69, 176);
		color: #373434;
		padding: 0px 2px;
		border-radius: 5px;
	}
	.unknown.message .user {
		color: rgb(88, 88, 76);
	}
	.right.message .user {
		color: #acf0fd;
	}
	.left.message .user {
		color: #ff8993;
	}
</style>
