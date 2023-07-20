import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../../lib/prisma';
import { fail, error, type Actions } from '@sveltejs/kit';
import vine, { errors } from '@vinejs/vine';
import { parseFormData } from 'parse-nested-form-data';

export async function load({ params, cookies }) {
	const tournamentId = parseInt(params.id);

	const tournament = await prisma.tournament.findUnique({
		where: {
			id: tournamentId
		},
		include: {
			Hosts: {
				include: {
					User: {
						select: {
							username: true,
							country_code: true
						}
					}
				}
			},
			rounds: {
				include: {
					Match: {
						include: {
							Teams: {
								include: {
									Bans: true,
									Picks: true,
									Wins: true,
									Team: true
								}
							}
						}
					},
					mappool: {
						include: {
							Maps: {
								include: {
									Map: true
								}
							}
						}
					}
				}
			},
			Teams: {
				include: {
					Members: {
						include: {
							User: true
						}
					}
				}
			}
		}
	});

	if (!tournament) {
		throw error(StatusCodes.NOT_FOUND, 'Tournament not found');
	}

	const session = cookies.get('yagami_session');
	const user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: session
				}
			}
		}
	});

	if (!user) {
		throw error(StatusCodes.UNAUTHORIZED);
	}

	const hosts = tournament.Hosts.map((x) => x.userId);
	if (!hosts.includes(user.id)) {
		throw error(StatusCodes.UNAUTHORIZED, './');
	}

	return { tournament };
}

export const actions: Actions = {
	save: async ({ locals, request, params }) => {
		const tournamentId = parseInt(params.id ?? '-1');
		if (!hasEditPermission(tournamentId, locals.user.id)) throw error(StatusCodes.UNAUTHORIZED);

		const data = parseFormData(await request.formData());

		const schema = vine.object({
			acronym: vine.string(),
			name: vine.string(),
			color: vine.string().regex(new RegExp(/#([a-f0-9]{6})/g)),
			description: vine.string(),
			force_nf: vine.boolean(),
			score_mode: vine.number().range([0, 3]),
			team_mode: vine.number().range([0, 3]),
			team_size: vine.number().range([1, 16]),
			x_v_x_mode: vine.number().range([1, 16]),
			allow_registrations: vine.boolean(),
			fm_mods: vine.number(),
			double_pick: vine.number().range([0, 2]),
			double_ban: vine.number().range([0, 2]),
			private: vine.boolean()
		});

		try {
			const result = await vine.validate({ schema, data });

			// Yeah this should probably validate if the data is staying the same before
			//  querying the database, but I'm sure I'll come back to this page eventually
			await prisma.tournament.update({
				where: {
					id: tournamentId
				},
				data: result
			});
		} catch (err) {
			if (err instanceof errors.E_VALIDATION_ERROR) {
				const status = err.status;
				const messages = err.messages;
				return fail(status, { data, messages });
			}
		}
	}
};

const hasEditPermission = async (tournament: number, user: number) => {
	// Check edit permissions
	const permissionCheck = await prisma.tournament.findFirst({
		where: {
			id: tournament,
			Hosts: {
				some: {
					userId: user
				}
			}
		}
	});

	return permissionCheck != null;
};

export const prerender = false;
