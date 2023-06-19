<script>
	import { browser } from '$app/environment';
	const logout = async () => {
		let logoutReq = await fetch('/auth/logout', { method: 'POST' });
		console.log(logoutReq.status);
		if (browser && logoutReq.status == 200) {
			window.location.reload();
		}
	};
</script>

<button on:click={logout}>Logout</button>

<style>
	button {
		position: relative;
		margin: 20px;
		padding: 10px;
		width: 60%;
		text-align: center;
		border-radius: 10px;
		transition: 0.3s ease;
		background: transparent;
		font-family: 'MavenPro', sans-serif;
		font-size: 16px;
		border: 0;
		color: #f34e87;
		overflow: hidden;
		z-index: 1;
		cursor: pointer;
	}

	button:hover {
		border-radius: 10px;
		background: #f34e87;
		color: white;
	}
</style>
