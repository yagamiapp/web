import prisma from '$lib/prisma';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';
import { parseFormData } from 'parse-nested-form-data';
import vine, { errors } from '@vinejs/vine';

export const load: PageServerLoad = async ({ params }) => {
	// Retrieve list of existing player invites
	const invites = await prisma.teamInvite.findMany({
		where: {
			teamId: parseInt(params.team_id)
		},
		include: {
			Invitee: true
		}
	});

	return { invites };
};

export const actions: Actions = {
	player_search: async ({ request, fetch }) => {
		const formData = await request.formData();
		const playerId = String(formData.get('player_id'));
		let user;
		let query;

		if (RegExp(/^[0-9]+$/).test(playerId)) {
			// Fetch player from numerical ID
			query = { id: parseInt(playerId) };
		} else {
			// Fetch player from username
			query = { username: playerId };
		}

		user = await prisma.user.findFirst({
			where: query,
			include: {
				Invites: {
					include: {
						Team: {
							select: {
								id: true
							}
						}
					}
				}
			}
		});

		if (!user) {
			// Fetch player from osu!api
			// TODO: Make the fetch dependent on the gamemode of the tournament (not always just 'osu')?
			const osuResponse = await fetch(`https://osu.ppy.sh/api/v2/users/${playerId}/osu`);
			const userData = await osuResponse.json();

			if (osuResponse.status == StatusCodes.NOT_FOUND) {
				return { error: 'Player not found.' };
			}
			if (osuResponse.status == StatusCodes.UNAUTHORIZED) {
				return { error: 'Unauthorized. Try again later, or log out and log in again.' };
			}

			if (query.username) {
				// Double check database with username if queried with non-matching case
				// (cannot query the database case-insensitively due to SQLite limitations)
				console.log(
					'Double checking database for username: ' + query.username + '/' + userData.username
				);
				user = await prisma.user.findFirst({
					where: {
						username: {
							contains: userData.username
						}
					},
					include: {
						Invites: {
							include: {
								Team: {
									select: {
										id: true
									}
								}
							}
						}
					}
				});

				if (user) {
					return { user };
				}
			}

			// Add user to database
			const { id, username, country_code, cover_url } = userData;
			const country_name = userData.country.name;
			const { ranked_score, play_count, total_score, hit_accuracy, pp } = userData.statistics;
			const { current: level, progress: level_progress } = userData.statistics.level;

			// Handle unranked users (null global_rank)
			let { global_rank: pp_rank } = userData.statistics;
			if (pp_rank == null) {
				pp_rank = 0;
			}

			user = await prisma.user.create({
				data: {
					id,
					username,
					country_code,
					country_name,
					cover_url,
					ranked_score,
					play_count,
					total_score,
					pp_rank,
					hit_accuracy,
					level,
					level_progress,
					pp
				}
			});
		}

		return { user };
	},

	invite_player: async ({ params, request }) => {
		const formData = await request.formData();
		const inviteeId = parseInt(String(formData.get('invite_player')));
		const teamId = params.team_id;

		// Validate invitee isn't already in the team
		const team = await prisma.team.findUnique({
			where: {
				id: parseInt(teamId)
			},
			select: {
				Members: {
					select: {
						osuId: true
					}
				}
			}
		});
		if (team?.Members.some((member) => member.osuId == inviteeId)) {
			return { error: 'This user is already in the team.' };
		}

		// Construct team invite
		const teamInvite = await prisma.teamInvite.upsert({
			create: {
				inviteeUserId: inviteeId,
				teamId: parseInt(teamId)
			},
			update: {},
			where: {
				inviteeUserId_teamId: {
					inviteeUserId: inviteeId,
					teamId: parseInt(teamId)
				}
			}
		});

		if (!teamInvite) {
			return { error: 'Something went wrong. Try again later.' };
		}
		return { success: 'Invite sent.' };
	},

	cancel_invite: async ({ params, request }) => {
		const formData = parseFormData(await request.formData());
		const inviteeId = String(formData['cancel_invite']);
		const teamId = params.team_id;

		const cancelInvite = await prisma.teamInvite.delete({
			where: {
				inviteeUserId_teamId: {
					inviteeUserId: parseInt(inviteeId),
					teamId: parseInt(teamId)
				}
			}
		});

		if (!cancelInvite) {
			return { cancelErrorId: inviteeId, cancelError: 'Something went wrong. Try again later.' };
		}
		return;
	},

	unregister: async ({ params }) => {
		// Validate that the tournament registrations are still open
		const tournament = await prisma.tournament.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!tournament?.allow_registrations) {
			return fail(StatusCodes.BAD_REQUEST, { message: 'Tournament registrations are closed.' });
		}

		const team_id = parseInt(params.team_id);
		await prisma.team.delete({
			where: {
				id: team_id
			}
		});

		throw redirect(StatusCodes.MOVED_PERMANENTLY, '/tournaments/' + params.id);
	},

	leave_team: async ({ params, locals }) => {
		// Validate that the tournament registrations are still open
		const tournament = await prisma.tournament.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!tournament?.allow_registrations) {
			return fail(StatusCodes.BAD_REQUEST, { message: 'Tournament registrations are closed.' });
		}

		await prisma.userInTeam.delete({
			where: {
				osuId_teamId: {
					osuId: locals.user.id,
					teamId: parseInt(params.team_id)
				}
			}
		});

		return { left: "You've left the team." };
	},

	update_team: async ({ request, params }) => {
		// TODO: Validate local user is team captain?
		const data = parseFormData(await request.formData());
		const schema = vine.object({
			name: vine.string(),
			color: vine.string().regex(new RegExp(/#([a-f0-9]{6})/g)),
		});

		try {
			const result = await vine.validate({ schema, data });

			// Yeah this should probably validate if the data is staying the same before
			//  querying the database, but I'm sure I'll come back to this page eventually
			await prisma.team.update({
				where: {
					id: parseInt(params.team_id)
				},
				data: result
			});
		} catch (err) {
			if (err instanceof errors.E_VALIDATION_ERROR) {
				const status = err.status;
				const messages = err.messages;
				return fail(status, { data, messages });
			}
			else {
				throw err;
			}
		}
	}
};

export const prerender = false;
