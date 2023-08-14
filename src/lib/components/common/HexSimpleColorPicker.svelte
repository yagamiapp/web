<script lang="ts">
    import ColorPicker from "svelte-awesome-color-picker";
    export let hex: string;
</script>

<div class="color-picker">
    <ColorPicker 
        bind:hex 
        isAlpha={false} 
        canChangeMode={false}
        --focus-color={hex}
		--picker-z-index="100" />
</div>

<style>
	.color-picker :global(.wrapper) {
		background-color: var(--bg1);
		border: 0.1rem solid var(--font-color);
	}
	.color-picker :global(input) {
		color: var(--font-color);
		background-color: var(--bg1);
	}
	.color-picker :global(label) {
		/* These styles match the buttons on the tournament pages. */
        color: var(--font-color);
		outline: none;

		font-family: inherit;
		font-size: inherit;

		border: solid 2px var(--font-color);
		border-radius: 6px;
		transition: border-color 200ms ease;
		background-color: var(--bg1);
		
		display: flex;
		justify-content: center;
		width: 10rem;
		height: 2.5rem;
	}
</style>