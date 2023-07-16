<script lang="ts">
    import ToggleSwitch from "$lib/components/ToggleSwitch.svelte";

    export let name: string;
    export let label: string;
    export let value: any;
    export let errors: { message: string, rule: string, field: string }[];
    export let type: string;
    // Options are the same type as used in 'TournamentEnums.ts'
    export let options: { [key: number]: string } = {};

    const original = value;

    const error = errors?.find((item) => item.field === name)
</script>

<label for={name}>{label}</label>

{#if type == "text"}
    <input bind:value {name} type="text" />
{:else if type == "textarea"}
    <br><textarea bind:value {name} />
{:else if type == "number"}
    <input bind:value {name} type="number" />
{:else if type == "select" && options}
    <select {name} bind:value>
        {#each Object.entries(options) as [n, modeName]}
            <option value={Number(n)}
                selected={value == Number(n)}
            >{modeName}</option>
        {/each}
    </select>
{:else if type == "switch"}
    <input bind:value {name} type="hidden" />
    <ToggleSwitch
        on:check={({ detail }) => { value = detail }}
        checked={value}
        onColor="var(--tournament-color)"
        offColor="var(--bg3)"
        handleColor="var(--font-color)"
    />
<!-- TODO: color -->
{/if}

<span class:modified={value !== original}></span>
<span class:error>* {error?.message}</span><br>

<style>
    label, .error {
		font-size: 16px;
		height: min-content;
		margin-left: 2rem;
	}
	input, select, option, textarea {
		color: var(--font-color);
		outline: none;

		font-family: inherit;
		font-size: inherit;

		border: solid 2px var(--font-color);
		border-radius: 6px;
		padding: 5px;
		margin-bottom: 2rem;
		transition: border-color 200ms ease;
		background-color: var(--bg1);
	}
	textarea {
		margin-left: 2rem;
		margin-top: 0.5rem;
		width: 90%;
		resize: vertical;
	}
	input[type='text'] {
		width: 30rem;
	}
	input[type='number'] {
		width: 3rem;
	}
	option {
		font-family: 'Quicksand', Arial;
	}
	input:focus, select:focus {
		border: solid 2px var(--tournament-color);
	}
    span {
		visibility: hidden;
	}
	.modified {
		visibility: visible;
		display: inline-block;
		margin-bottom: 6px;
		margin-left: 0.4rem;
		width: 4px;
		height: 4px;
		border-radius: 2px;
		background-color:aquamarine;
		box-shadow: 0 0 3px 3px aquamarine;
		transition: visibility 200ms ease;
	}
	.error {
		visibility: visible;
		color: tomato;
	}
</style>