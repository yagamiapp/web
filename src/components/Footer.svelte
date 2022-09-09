<script>
	import CautionTape from "./CautionTape.svelte";
	import logo from "../assets/yagami_mask.svg";
</script>

<CautionTape />
<div class="foot">
	<h1>Warning</h1>
	<h3>
		This website is under heavy construction, expect things to change and
		break!
	</h3>
	<div class="links">
		<img src={logo} alt="" />
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
		background-color: #001620;
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
		color: rgba(255, 255, 255, 0.4);
	}
	a:hover {
		text-decoration: underline;
	}
</style>
