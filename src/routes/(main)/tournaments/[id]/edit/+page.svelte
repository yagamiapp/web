<script lang="ts">
	import Setting from '$lib/components/common/Setting.svelte';
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
		double_ban,
		// private (use 'data.tournament.private' as 'private' is a reserved keyword)
	} = data.tournament;

	function Str(variable: Object) {
		// Returns the name of the variable as a string
		return Object.keys(variable)[0];
	}
</script>

<svelte:head>
	<title>Edit Tournament - {name}</title>

	<meta name="twitter:card" content="summary" />
	<meta property="og:title" content="{name} Settings" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Configure main tournament settings (host only)" />
	<meta property="og:image" content={banner_url} />
	<meta name="theme-color" content={color} />
</svelte:head>

<CentreNarrowPanel --tournament-color={data.tournament.color}>

	<div slot="top">
		<Button url="/tournaments/{id}" text="TOURNAMENT PAGE" />
	</div>

	<form method="POST" action="?/save">
		<h1>Tournament Page Settings</h1>

		<Setting
			name={Str({ name })}
			label="Tournament Name"
			value={name}
			errors={form?.messages}
			type="text"
		/>

		<Setting
			name={Str({ acronym })}
			label="Tournament Acronym"
			value={acronym}
			errors={form?.messages}
			type="text"
		/>

		<Setting
			name={Str({ color })}
			label="Theme Colour"
			value={color}
			errors={form?.messages}
			type="color"
		/>

		<Setting
			name={Str({ description })}
			label="Tournament Description"
			value={description}
			errors={form?.messages}
			type="textarea"
		/>

		<Setting
			name={Str({ allow_registrations })}
			label="Player Registrations Open"
			value={allow_registrations}
			errors={form?.messages}
			type="switch"
		/>

		<Setting
			name="private"
			label="Set Tournament to Private"
			value={data.tournament.private}
			errors={form?.messages}
			type="switch"
		/>

		<h1>Match Rules</h1>

		<Setting
			name={Str({ force_nf })}
			label="Force NoFail?"
			value={force_nf}
			errors={form?.messages}
			type="switch"
		/>

		<Setting
			name={Str({ score_mode })}
			label="Map Win Condition"
			value={score_mode}
			errors={form?.messages}
			type="select"
			options={scoreModeEnum}
		/>

		<Setting
			name={Str({ team_mode })}
			label="In-Match Team Mode"
			value={team_mode}
			errors={form?.messages}
			type="select"
			options={teamModeEnum}
		/>

		<Setting
			name={Str({ team_size })}
			label="Team Size"
			value={team_size}
			errors={form?.messages}
			type="number"
		/>

		<Setting
			name={Str({ x_v_x_mode })}
			label="Players Per Team Per Map"
			value={x_v_x_mode}
			errors={form?.messages}
			type="number"
		/>

		<Setting
			name={Str({ fm_mods })}
			label="Min-Number of Mods per Player (FreeMod Picks, not including NF)"
			value={fm_mods}
			errors={form?.messages}
			type="number"
		/>

		<Setting
			name={Str({ double_pick })}
			label="Double Picking Rule"
			value={double_pick}
			errors={form?.messages}
			type="select"
			options={doublePickEnum}
		/>

		<Setting
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
