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
		margin: auto;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		width: fit-content;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
	}
	a {
		position: relative;
		border-radius: 20px;
		color: white;
		background: linear-gradient(90deg, var(--yagami-pink), var(--yagami-orange));
		text-decoration: none;
		font-weight: bold;
		width: 300px;
		padding: 0.7rem 10px;
		margin: 20px;
		font-family: 'MavenPro', sans-serif;
		font-size: 1.5rem;
	}
	a div {
		display: grid;
		place-items: center;
	}
	a::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 25px;
		filter: blur(10px);
		background: linear-gradient(90deg, var(--yagami-pink), var(--yagami-orange));
		z-index: -1;
	}
</style>
