<script lang="ts">
	import EditPageSetting from '$lib/components/tournament-page/edit-page/EditPageSetting.svelte';
	import type { Tournament } from '@prisma/client';
	import { teamModeEnum, scoreModeEnum, doublePickEnum, doubleBanEnum } from '$lib/TournamentEnums';
	import type { ActionData } from './$types';
	import Button from '$lib/components/common/LargeButton.svelte';
	import CentreNarrowPanel from '$lib/components/common/CentreNarrowPanel.svelte';

	export let data: { tournament: Tournament };
	export let form: ActionData;

	let {
		id,
		acronym,
		name,
		color,
		description,
		force_nf,
		score_mode,
		team_mode,
		team_size,
		x_v_x_mode,
		allow_registrations,
		fm_mods,
		double_pick,
		double_ban
		// private (use 'data.tournament.private' as 'private' is a reserved keyword)
	} = data.tournament;

	function Str(variable: Object) {
		// Returns the name of the variable as a string
		return Object.keys(variable)[0];
	}
</script>

<svelte:head>
	<title>Edit Tournament - {name}</title>
</svelte:head>

<CentreNarrowPanel --tournament-color={data.tournament.color}>

	<div slot="top">
		<Button url="/tournaments/{id}" text="TOURNAMENT PAGE" />
	</div>

	<form method="POST" action="?/save">
		<h1>Tournament Page Settings</h1>

		<EditPageSetting
			name={Str({ name })}
			label="Tournament Name"
			value={name}
			errors={form?.messages}
			type="text"
		/>

		<EditPageSetting
			name={Str({ acronym })}
			label="Tournament Acronym"
			value={acronym}
			errors={form?.messages}
			type="text"
		/>

		<EditPageSetting
			name={Str({ color })}
			label="Theme Colour"
			value={color}
			errors={form?.messages}
			type="color"
		/>

		<EditPageSetting
			name={Str({ description })}
			label="Tournament Description"
			value={description}
			errors={form?.messages}
			type="textarea"
		/>

		<EditPageSetting
			name={Str({ allow_registrations })}
			label="Player Registrations Open"
			value={allow_registrations}
			errors={form?.messages}
			type="switch"
		/>

		<EditPageSetting
			name="private"
			label="Set Tournament to Private"
			value={data.tournament.private}
			errors={form?.messages}
			type="switch"
		/>

		<h1>Match Rules</h1>

		<EditPageSetting
			name={Str({ force_nf })}
			label="Force NoFail?"
			value={force_nf}
			errors={form?.messages}
			type="switch"
		/>

		<EditPageSetting
			name={Str({ score_mode })}
			label="Map Win Condition"
			value={score_mode}
			errors={form?.messages}
			type="select"
			options={scoreModeEnum}
		/>

		<EditPageSetting
			name={Str({ team_mode })}
			label="In-Match Team Mode"
			value={team_mode}
			errors={form?.messages}
			type="select"
			options={teamModeEnum}
		/>

		<EditPageSetting
			name={Str({ team_size })}
			label="Team Size"
			value={team_size}
			errors={form?.messages}
			type="number"
		/>

		<EditPageSetting
			name={Str({ x_v_x_mode })}
			label="Players Per Team Per Map"
			value={x_v_x_mode}
			errors={form?.messages}
			type="number"
		/>

		<EditPageSetting
			name={Str({ fm_mods })}
			label="Min-Number of Mods per Player (FreeMod Picks, not including NF)"
			value={fm_mods}
			errors={form?.messages}
			type="number"
		/>

		<EditPageSetting
			name={Str({ double_pick })}
			label="Double Picking Rule"
			value={double_pick}
			errors={form?.messages}
			type="select"
			options={doublePickEnum}
		/>

		<EditPageSetting
			name={Str({ double_ban })}
			label="Double Banning Rule"
			value={double_ban}
			errors={form?.messages}
			type="select"
			options={doubleBanEnum}
		/>

		<div class="line" />
		<button id="save_changes" type="submit">Save Changes</button>
	</form>

</CentreNarrowPanel>

<style>
	h1,
	.line {
		margin-left: 5%;
		padding-top: 1rem;
		border-top: 2px solid var(--tournament-color);
		width: 90%;
		background-color: rgba(0, 0, 0, 0);
	}

	#save_changes {
		margin-left: 70%;
		font-size: 22px;
		font-weight: 600;

		background-color: var(--tournament-color);
	}
</style>
