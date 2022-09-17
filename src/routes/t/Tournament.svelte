<script>
	import Header from "./TournamentHeader.svelte";
	import Rules from "./TournamentRules.svelte";
	import Mappools from "./TournamentMappools.svelte";
	import Default from "../../assets/icons/white.svg";

	export let data;
	let { tournament, rounds } = data;
	let { banner, name, acronym, icon_url, id, color } = tournament;

	// banner =
	// 	"http://www.newdesignfile.com/postpic/2010/09/free-abstract-banner-backgrounds_117038.jpg";
</script>

<svelte:head>
	<title>{acronym}: {name}</title>
</svelte:head>

<section id="home" />
<div class="wrap" style="--theme: {color}">
	<div class="top">
		<img src={Default} alt="" class="icon" />
	</div>
	<Header {banner} {name} icon={icon_url} />
	<div class="sticky">
		<nav>
			<a href="/t/{id}#home">home</a>
			<a href="/t/{id}#rules">rules</a>
			<a href="/t/{id}#mappools">mappools</a>
			<a href="/t/{id}#teams">teams</a>
			<a href="/t/{id}#matches">matches</a>
		</nav>
		<div class="line" />
	</div>
	<Rules {tournament} />
	<Mappools {rounds} />
	<div class="big" />
</div>

<style>
	#home {
		position: absolute;
		top: 0;
		left: 0;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
	}

	.top {
		height: 60px;
	}

	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.sticky {
		position: sticky;
		top: 0;
	}

	/* This is a development class */
	.big {
		height: 150vh;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		height: 2em;
		background-color: #151515;
	}
	nav a {
		color: white;
		text-decoration: none;
		text-transform: uppercase;
	}

	nav a:hover {
		color: #a5a5a5;
	}

	.line {
		width: 100%;
		height: 0.5em;
		background-color: var(--theme);
	}
</style>
