<script>
	import defaultIcon from "../../assets/icons/white-gradient.png";

	export let banner;
	export let name;
	export let icon;
</script>

<div class="header">
	<div class="name-box">
		<img src={icon} alt="tournament icon" class="icon" />
		<div class="fade">
			<div class="name">{name}</div>
		</div>
	</div>
	{#if banner}
		<div class="bg" style="background-image: url({banner})" />
	{:else}
		<div class="default bg" style="background-image: url({defaultIcon})" />
	{/if}
</div>

<style>
	.header {
		position: relative;
		height: 350px;
	}

	.bg {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center center;
	}

	.name-box {
		position: absolute;
		bottom: 0;
		height: 150px;
		width: 100%;
		background-color: rgba(5, 5, 5, 0.75);
		backdrop-filter: blur(10px);
		display: flex;
	}

	.icon {
		transform: translate(30px, -30px);
		border-radius: 25px;
		width: 150px;
		height: 150px;
	}

	.name {
		position: relative;
		top: 0;
		left: 180px;
		padding: 10px;
		font-size: 3em;
		font-weight: bold;
		white-space: nowrap;
	}

	.fade {
		position: absolute;
		top: 0;
		left: 0;
		/* Some weird shenanigans with CSS makes it so I can't make this 100% */
		width: 99%;
		height: 100%;
		overflow: hidden;
		mask-image: linear-gradient(90deg, #000 80%, transparent);
		-webkit-mask-image: linear-gradient(90deg, #000 80%, transparent);
	}
</style>
