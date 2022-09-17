import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";

// export const prerender = true;

export async function load({ params }) {
	let tournamentId = parseInt(params.id);

	if (!tournamentId) {
		throw error(404, "Not found");
	}

	let tournament = await prisma.tournament.findUnique({
		where: {
			id: tournamentId,
		},
	});

	if (!tournament) {
		throw error(404, "Not found");
	}

	let rounds = await prisma.round.findMany({
		where: {
			tournamentId: tournament.id,
		},
	});

	if (rounds.length > 0) {
		for (let i = 0; i < rounds.length; i++) {
			let round = rounds[i];

			let pool = await prisma.mappool.findUnique({
				where: {
					id: round.mappoolId,
				},
			});

			if (pool) {
				let maps = await prisma.mapInPool.findMany({
					where: {
						mappoolId: pool.id,
					},
					orderBy: {
						modPriority: "asc",
					},
				});

				for (let j = 0; j < maps.length; j++) {
					let map = await prisma.map.findUnique({
						where: {
							beatmap_id: maps[j].mapId,
						},
					});

					maps[j].map = map;
				}
				pool.maps = maps;
				rounds[i].mappool = pool;
			}
		}
	}
	return { tournament, rounds };
}
