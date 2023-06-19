import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../../lib/prisma';
import { error } from '@sveltejs/kit';

export const prerender = 'auto';

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
