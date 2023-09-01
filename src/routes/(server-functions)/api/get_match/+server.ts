import { StatusCodes } from '$lib/StatusCodes.js';
import prisma from '$lib/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// I hate javascript
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(StatusCodes.BAD_REQUEST, 'Missing Required Parameter: ID');
	}

	const match = await prisma.match.findUnique({
		where: {
			id: parseInt(id)
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
		throw error(StatusCodes.NOT_FOUND, `No match with id ${id} found.`);
	}
	return json(match);
}
