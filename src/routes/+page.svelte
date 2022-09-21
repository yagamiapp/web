<script>
	import banner from "../assets/home-logo.png";
	import bgVideo from "../assets/clip.webm";

	let bg;
	function parallax(event) {
		bg.style.transform =
			"translate(" +
			event.clientX * -0.01 +
			"px, " +
			event.clientY * -0.01 +
			"px)";
	}
</script>

<svelte:head>
	<title>Yagami</title>
</svelte:head>

<section id="home" on:mousemove={parallax}>
	<img src={banner} alt="" />
	<video src={bgVideo} loop muted autoplay bind:this={bg} />
	<div class="bottom" />
</section>

<style>
	section {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		font-size: 3em;
		align-items: center;
	}

	section#home {
		position: relative;
		height: 100vh;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 10vw 10vw black inset;
	}
	#home video {
		position: absolute;
		filter: blur(10px);
		min-height: 100%;
		min-width: 100%;
		z-index: -1;
	}

	#home img {
		max-width: 100%;
		z-index: 1;
		pointer-events: none;
	}

	#home .bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 50%;
		width: 100%;
		background-color: var(--g1);
		background: linear-gradient(180deg, #00000000, var(--bg1));
	}
</style>
