<script>
	export let pool;

	const switchClosed = (ev) => {
		const el = ev.target.parentElement;
		el.classList.toggle("closed");
	};
	console.log(pool);
</script>

<div class="closed details">
	<div class="summary" on:click={switchClosed}>
		{pool.name}
		<span class="icon">▼</span>
	</div>

	Text<br />
	Text<br />
	Text<br />
	Text<br />
	Text<br />
	Text<br />
</div>

<style>
	.summary {
		background-color: var(--bg1);
		font-size: 1.5em;
		height: 40px;
		display: flex;
		align-items: center;
	}
	.details.closed {
		height: 40px;
	}

	.icon {
		position: absolute;
		top: 0;
		right: 0;
		height: 40px;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		transition: transform 0.3s ease;
	}

	.closed .icon {
		transform: rotate(180deg);
	}

	.details {
		position: relative;
		background-color: var(--bg3);
		height: 100px;
		overflow: hidden;
		transition: height 0.3s ease-in-out;
	}
</style>
