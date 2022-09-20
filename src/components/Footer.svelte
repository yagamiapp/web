<script>
	import CautionTape from "./CautionTape.svelte";
	import logo from "../assets/icons/white.svg";
	import Switch from "./ToggleSwitch.svelte";

	const switchTheme = ({ detail }) => {
		if (detail) {
			document.body.classList.add("lightmode");
		} else {
			document.body.classList.remove("lightmode");
		}
	};
</script>

<CautionTape />
<div class="foot">
	<h1>Warning</h1>
	<h3>
		This website is under heavy construction, expect things to change and
		break!
	</h3>
	<Switch on:check={switchTheme} />
	<div class="links">
		<a href="/"><img src={logo} alt="" /></a>
		<a href="/discord">Discord</a>
		<a href="/twitter">Twitter</a>
		<a href="/invite">Invite</a>
		<a href="/github">Source Code</a>
	</div>
</div>

<style>
	img {
		width: 50px;
		height: 50px;
		opacity: 25%;
	}
	h3 {
		margin: 0;
	}
	.foot {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		background-color: var(--bg1);
	}
	.links {
		width: 100%;
		padding: 25px 0px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	a {
		font-size: 18px;
		text-decoration: none;
		/* background: green; */
		padding: 10px;
		color: rgba(255, 255, 255, 0.4);
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
		transition: 0.1s ease-in-out;
	}
	a:hover {
		transform: translate(-5px, -5px);
		background: rgba(255, 255, 255, 0.05);
		box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.5);
	}
</style>
