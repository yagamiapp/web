import prisma from '../../../../lib/prisma';
import { error } from '@sveltejs/kit';

export const ssr = false;
export const prerender = false;

export async function load({ url }) {
	let res = url.searchParams.get('res');
	let ws = url.searchParams.get('ws');

	let matchId = url.searchParams.get('match');
	if (!matchId) {
		throw new error(400, 'You must give a match argument in the parameters.');
	}

	let match = await prisma.match.findUnique({
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
		throw new error(404, `No match with id ${matchId} found.`);
	}

	if (ws) {
		let wsCheck = ws.match(/ws:\/\/(\D+):(\d+)/);
		if (!wsCheck) {
			throw new error(400, 'websocket url is malformed');
		}
	}

	return { res, match, ws };
}
