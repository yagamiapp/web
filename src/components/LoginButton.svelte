<script>
	import { browser } from "$app/environment";
	let params = `
    scrollbars=no,
    resizable=no,
    status=no,
    location=no,
    toolbar=no,
    menubar=no,
    width=600,
    height=800,
    left=100,
    top=100
    `;

	const openWindow = () => {
		let url =
			"https://osu.ppy.sh/oauth/authorize?client_id=14803&redirect_uri=http://localhost:4000/auth/osu&response_type=code&scope=identify";

		let loginWindow = open(url, "login", params);
		loginWindow.onbeforeunload = () => {
			if (browser) {
				window.location.reload();
			}
		};
	};
</script>

<div on:click={openWindow}>Login</div>

<style>
	div {
		position: relative;
		margin: 5px;
		width: 60%;
		height: 10%;
		display: grid;
		place-items: center;
		font-size: 2em;
		/* background: linear-gradient(90deg, #f34e87, #ffab74); */
		border-radius: 40px;
		transition: 0.3s ease;
		overflow: hidden;
		z-index: 1;
		cursor: pointer;
	}

	div::after {
		content: "";
		position: absolute;
		top: -200%;
		left: -50%;
		background: linear-gradient(90deg, #f34e87, #ffab74);
		width: 200%;
		height: 500%;
		transform: translate(-25%);
		transition: 0.3s ease;
		z-index: -1;
	}

	div:hover::after {
		transform: translate(25%);
	}

	div:hover {
		border-radius: 10px;
	}
</style>
