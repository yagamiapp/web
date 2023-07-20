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
		border-radius: 25px;
		color: white;
		background: linear-gradient(90deg, #f34e87, #ffab74);
		text-decoration: none;
		font-weight: bold;
		padding: 10px;
		margin: 10px;
		font-family: 'MavenPro', sans-serif;
	}
	a div {
		display: grid;
		place-items: center;
	}
</style>
