<script>
	import Default from "../../assets/icons/white.svg";
</script>

<div class="wrap">
	<div class="top">
		<img src={Default} alt="" class="icon" />
	</div>
</div>

<style>
	.top {
		position: relative;
		height: 60px;
	}

	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
	}
</style>
