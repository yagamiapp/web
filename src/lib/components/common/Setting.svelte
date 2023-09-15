<script lang="ts">
	import HexSimpleColorPicker from '$lib/components/common/HexSimpleColorPicker.svelte';
	import ToggleSwitch from '$lib/components/common/ToggleSwitch.svelte';
	import { fade } from 'svelte/transition';
	
	export let name: string;
	export let label: string = '';
	export let value: any;
	// Errors are the same type as messages returned by Vine for validation errors
	export let errors: { message: string; rule: string; field: string }[];
	export let type: string;
	// Options are the same type as used in 'TournamentEnums.ts'
	export let options: { [key: number]: string } = {};
	export let tooltip: string = "";
	export let placeholder: string = "";

	const original = value;

	const error = errors?.find((item) => item.field === name);
</script>

<div class="wrapper">
	<label for={name}>
		<div class="label-wrapper">
			<span>{label}</span>
			<span class="tooltip">{tooltip}</span>
			{#if error}
				<span class="error">* {error?.message}</span>
			{/if}
		</div>
	</label>

	<div class="input-wrapper">
		{#if type == 'text'}

			<input bind:value {name} type="text" autocomplete="off" {placeholder} />

		{:else if type == 'textarea'}

			<textarea bind:value {name} {placeholder} />

		{:else if type == 'number'}

			<input bind:value {name} type="number" {placeholder} />

		{:else if type == 'select' && options}

			<select {name} bind:value>
				{#each Object.entries(options) as [n, modeName]}
					<option value={Number(n)} selected={value == Number(n)}>{modeName}</option>
				{/each}
			</select>

		{:else if type == 'switch'}

			<input bind:value {name} type="hidden" />
			<ToggleSwitch
				on:check={({ detail }) => {
					value = detail;
				}}
				checked={value}
				onColor="var(--tournament-color)"
				offColor="var(--bg3)"
				handleColor="var(--font-color)"
			/>

		{:else if type == 'color'}

			<div class="color-picker">
				<HexSimpleColorPicker bind:hex={value} />
			</div>
			<input type="hidden" {name} bind:value />

		{/if}

		<div class="modified-wrapper">
			{#if value !== original}
				<span
					class="modified"
					transition:fade={{ duration: 150 }}
					on:click={() => value = original}
					on:keypress={() => value = original}
				/>
			{/if}
		</div>
	</div>
</div>

<br />

<style>
	.wrapper {
		display: flex;
		gap: 1rem;
		justify-content: space-between;

		width: 100%;

		background-color: var(--bg4);
		border-radius: 0.4rem;
	}

	label {
		display: inline-block;
		width: 50%;
	}
	.label-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		width: fit-content;
		margin-left: 4%;
	}
	.error {
		color: tomato;
		font-size: 0.8rem;
	}
	.tooltip {
		color: #BBBBBB;
		font-size: 0.8rem;
	}

	.input-wrapper {
		display: flex;
		flex-direction: row;

		width: 50%;
	}
	input,
	select,
	option,
	textarea {
		color: var(--font-color);
		outline: none;

		font-family: inherit;
		font-size: inherit;

		border: solid 2px var(--font-color);
		border-radius: 6px;
		padding: 5px;
		margin: 0.4rem 0;
		transition: border-color 200ms ease;
		background-color: var(--bg1);

		display: inline-block;
		width: 100%;
	}
	textarea {
		height: 5rem;
		resize: vertical;
	}
	option {
		font-family: 'Quicksand', Arial;
	}
	input:focus,
	select:focus,
	textarea:focus {
		border: solid 2px var(--tournament-color);
	}
	.color-picker {
		margin: 0.4rem 0;
		width: fit-content;
		display: inline-block;
	}
	.modified-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
	}
	.modified {
		display: inline-block;
		margin: 2px 3px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: aquamarine;
	}
</style>
