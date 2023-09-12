<script lang="ts">
	export let text: string;
	export let url: string;
</script>

<div class="wrap">
	<a href={url}>
		<div>{text}</div>
	</a>
</div>

<style>
	.wrap {
		display: grid;
		height: 100%;
		place-items: center;
	}
	a {
		border-radius: 20px;
		color: white;
		background: linear-gradient(90deg, var(--yagami-pink), var(--yagami-orange));
		text-decoration: none;
		font-weight: bold;
        padding: 0.7rem 10px;
		margin: 10px;
		font-family: 'MavenPro', sans-serif;
        font-size: 1.5rem;
        box-shadow: 0 0 0.5rem 0 var(--tournament-color);
	}
	a div {
		display: grid;
		place-items: center;
	}
</style>
