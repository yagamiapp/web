<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let checkbox;
	function check() {
		dispatch('check', checkbox.checked);
	}

	export let size = 1;
	export let onColor = '#ffab74';
	export let offColor = 'var(--bg2)';
	export let handleColor = 'var(--bg3)';
	export let checked = false;

	onMount(() => {
		checkbox.checked = checked;
	});
</script>

<label
	class="switch"
	style="
        --size:{size}; 
        --onColor:{onColor}; 
        --offColor:{offColor}; 
        --handleColor:{handleColor}
        "
>
	<input type="checkbox" on:click={check} bind:this={checkbox} />
	<span class="slider">
		<span class="on" />
		<span class="off" />
	</span>
	<span class="handle" />
</label>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: calc(60px * var(--size));
		height: calc(34px * var(--size));
		margin: calc(2px * var(--size));
	}
	input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		display: flex;
		top: 10%;
		left: 0;
		right: 0;
		bottom: 10%;
		border-radius: calc(34px * var(--size));
		box-shadow: 0 0 calc(5px * var(--size)) rgba(0, 0, 0, 0.5);
		overflow: hidden;
		transition: background-color 0.4s ease;
	}

	.off {
		background-color: var(--offColor);
	}

	.on {
		background-color: var(--onColor);
	}

	.off,
	.on {
		position: relative;
		display: inline-block;
		min-width: 100%;
		min-height: 100%;
		transition: transform 0.4s ease;
		transform: translateX(-100%);
	}

	.handle {
		display: inline-block;
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		width: calc(34px * var(--size));
		height: calc(34px * var(--size));
		background-color: var(--handleColor);
		border-radius: calc(34px * var(--size));
		transition: transform 0.4s ease;
	}

	input:checked ~ .handle {
		transform: translateX(calc(34px * var(--size)));
	}

	input:checked + .slider .off,
	input:checked + .slider .on {
		transform: translateX(0%);
	}
</style>
