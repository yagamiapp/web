import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const { tournament, user } = await parent();

	// Retrieve team from tournament and params
	const team = tournament.Teams.find((team) => team.id === parseInt(params.team_id));

	if (!team) {
		throw error(
			StatusCodes.NOT_FOUND,
			'Team not found. Make sure you are looking in the right tournament.'
		);
	}

	// Team captains have a member_order of 0
	const isTeamCaptain = team.Members.some(
		(member) => member.osuId === user?.id && member.member_order === 0
	);

	return { team, isTeamCaptain };
};
