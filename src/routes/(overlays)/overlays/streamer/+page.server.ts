import prisma from '../../../../lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const ssr = false;
export const prerender = false;

export const load: PageServerLoad = async function({ url }) {
	const res = url.searchParams.get('res');
	const ws = url.searchParams.get('ws');

	const matchId = url.searchParams.get('match');
	if (!matchId) {
		throw error(400, 'You must give a match argument in the parameters.');
	}

	const match = await prisma.match.findUnique({
		where: {
			id: parseInt(matchId)
		},
		include: {
			Teams: {
				include: {
					Team: {
						include: {
							Members: {
								include: {
									User: true
								}
							}
						}
					},
					Bans: {
						include: {
							Map: {
								include: {
									Map: true
								}
							}
						}
					},
					Picks: {
						include: {
							WonBy: {
								include: {
									Team: true
								}
							},
							Map: {
								include: {
									Map: true
								}
							}
						},
						orderBy: {
							pickTeamNumber: 'asc'
						}
					}
				}
			},
			Round: {
				include: {
					mappool: {
						include: {
							Maps: {
								include: {
									Map: true
								}
							}
						}
					},
					Tournament: true
				}
			}
		}
	});
	if (!match) {
		throw error(404, `No match with id ${matchId} found.`);
	}

	if (ws) {
		const wsCheck = ws.match(/ws:\/\/(\D+):(\d+)/);
		if (!wsCheck) {
			throw error(400, 'websocket url is malformed');
		}
	}

	return { res, match, ws };
}
