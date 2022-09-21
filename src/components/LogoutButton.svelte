<script>
	import { browser } from "$app/environment";
	const logout = async () => {
		console.log("Click!");
		let logoutReq = await fetch("/auth/logout", { method: "POST" });
		console.log(logoutReq.status);
		if (browser && logoutReq.status == 200) {
			console.log("Hi!");
			window.location.reload();
		}
	};
</script>

<div on:click={logout}>Logout</div>

<style>
	div {
		position: relative;
		margin: 5px;
		padding: 10px;
		width: 100px;
		text-align: center;
		border-radius: 10px;
		transition: 0.3s ease;
		color: #f34e87;
		overflow: hidden;
		z-index: 1;
		cursor: pointer;
	}

	div:hover {
		border-radius: 10px;
		background: #f34e87;
		color: white;
	}
</style>
