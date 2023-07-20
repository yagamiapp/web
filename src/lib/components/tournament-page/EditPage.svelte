<script lang="ts">
	import Default from '$lib/assets/icons/white.svg';
	import EditPageSetting from './edit-page/EditPageSetting.svelte';
	import type { Tournament } from '@prisma/client';
	import { teamModeEnum, scoreModeEnum, doublePickEnum, doubleBanEnum } from '$lib/TournamentEnums';
	import type { ActionData } from '../../../routes/(main)/tournaments/[id]/edit/$types';
	import Button from './TournamentHeaderButton.svelte';

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

<div class="wrap" style="--tournament-color: {data.tournament.color}">
	<div class="top">
		<img src={Default} alt="" class="icon" />
		<div class="back">
			<Button url="/tournaments/{id}" text="TOURNAMENT PAGE" />
		</div>
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

		<!-- <label for="color">Theme Colour</label>
		<input bind:value={color} name="color" type="color" /><br> -->
		<EditPageSetting
			name={Str({ color })}
			label="Theme Colour"
			value={color}
			errors={form?.messages}
			type="text"
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

		<h1 />
		<button class="save_changes" type="submit">Save Changes</button>
	</form>
</div>

<style>
	.top {
		position: relative;
		height: 60px;
	}
	.back {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
	}

	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
		font-family: 'Quicksand';
		font-size: 16px;
		font-weight: 600;
	}
	h1 {
		margin-left: 5%;
		padding-top: 1rem;
		border-top: 2px solid var(--tournament-color);
		width: 90%;
	}

	button {
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
	.save_changes {
		margin-left: 70%;
		font-size: 22px;
		font-weight: 600;

		background-color: var(--tournament-color);
	}
</style>
