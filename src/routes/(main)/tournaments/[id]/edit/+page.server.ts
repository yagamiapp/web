import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../../lib/prisma';
import { error, type Actions } from '@sveltejs/kit';
import type { Action } from './$types.js';
import { request } from 'http';

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
		const tournamentId = parseInt(params.id ?? "-1");
		if (!hasEditPermission(tournamentId, locals.user.id)) throw error(StatusCodes.UNAUTHORIZED)

		const data = await request.formData()

		if (data.get("name")) {
			const name = `${data.get("name")}`;

			await prisma.tournament.update({
				where: {
					id: tournamentId
				},
				"data": {
					name
				}
			})
		}



	}
}

const hasEditPermission = async (tournament: number, user: number) => {
	// Check edit permissions
	const permissionCheck = await prisma.tournament.findFirst({
		where: {
			id: tournament,
			"Hosts": {
				"some": {
					"userId": user
				}
			}
		}
	})

	return permissionCheck != null;
}