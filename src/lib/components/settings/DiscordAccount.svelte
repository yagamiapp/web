<script>
	export let account;

	let logoutUrl = `/auth/logout/discord/?id=${account.id}`;
</script>

<div>
	<h1>{account.username}#{account.discriminator}</h1>
	<a href={logoutUrl}>Remove</a>
</div>

<style>
	div {
		background-color: var(--bg3);
		margin: 20px;
		padding: 10px;
		width: 60%;
	}

	div h1 {
		margin-top: 0px;
	}

	a {
		display: block;
		text-align: center;
		border: 0;
		padding: 10px;
		width: 100px;
		border-radius: 10px;
		background-color: #ff6666;
		color: white;
		text-decoration: none;
		font-weight: bold;
	}
</style>
