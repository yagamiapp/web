import type { LayoutServerLoad } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../lib/prisma';
import { error } from '@sveltejs/kit';

export const prerender = 'auto';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const tournamentId = parseInt(params.id);

	// Retrieved tournament data should correspond to type db.FullyPopulatedTournament
	const tournamentRaw = await prisma.tournament.findUnique({
		where: {
			id: tournamentId
		},
		include: {
			Hosts: {
				include: {
					User: true
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
									Team: {
										include: {
											Members: {
												include: {
													User: true
												}
											}
										}
									}
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
					},
					InBracketMatches: {
						include: {
							Match: {
								include: {
									Teams: {
										include: {
											Bans: true,
											Picks: true,
											Wins: true,
											Team: {
												include: {
													Members: {
														include: {
															User: true
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	if (!tournamentRaw) {
		throw error(StatusCodes.NOT_FOUND, "Tournament not found.");
	}

	const tournament: db.FullyPopulatedTournament = tournamentRaw;

	let editPerms = false;
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

	let sessionUserTeam = null;

	if (!user) {
		return { tournament, editPerms, sessionUserTeam };
	}

	// Get the session user's team
	sessionUserTeam = tournament.Teams?.find((team) =>
		team.Members.find((member) => member.osuId === user.id)
	);

	const hosts = tournament.Hosts.map((x) => x.userId);
	if (hosts.includes(user.id)) {
		editPerms = true;
	}

	return { tournament, editPerms, sessionUserTeam };
}
