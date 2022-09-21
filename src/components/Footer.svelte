<script>
	import CautionTape from "./CautionTape.svelte";
	import logoWhite from "../assets/icons/white.svg";
</script>

<CautionTape />
<div class="foot">
	<h1>Warning</h1>
	<h3>
		This website is under heavy construction, expect things to change, move
		or break!
	</h3>
	<div class="switch" />
	<div class="links">
		<a href="/"><img src={logoWhite} alt="" /></a>
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
	.switch {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		font-size: 1.25em;
	}
	a {
		font-size: 18px;
		text-decoration: none;
		background: var(--bg2);
		padding: 10px;
		/* color: rgba(255, 255, 255, 0.4); */
		color: var(--fontColor);
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
		transition: 0.1s ease-in-out;
	}
	a:hover {
		transform: translate(-5px, -5px);
		/* background: rgba(255, 255, 255, 0.05); */
		box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.5);
	}
</style>
