<script>
	let numOfLines = 75;
	let lines = new Array(numOfLines).fill("");
</script>

<div class="tape" style="--lines: {numOfLines}">
	<div class="lines">
		{#each lines as i}
			<div class="line{i}" />
		{/each}
	</div>
</div>

<style>
	.tape {
		position: relative;
		background-color: rgb(228, 228, 22);
		height: 10px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lines {
		position: absolute;
		width: 200%;
		height: 100%;
		display: flex;
		align-items: center;
		animation: shift 1s linear infinite;
	}
	.line {
		transform: rotate(15deg);
		height: 150%;
		width: 100%;
	}
	.line:nth-child(even) {
		background-color: rgba(255, 255, 255, 0.5);
	}
	@keyframes shift {
		from {
			transform: translateX(0);
		}

		to {
			transform: translate(calc(100% / var(--lines) * 2));
		}
	}
</style>
