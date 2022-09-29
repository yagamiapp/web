import prisma from "../../../lib/prisma";
import { error } from "@sveltejs/kit";

export const prerender = true;
export const ssr = true;

export async function load({ params }) {
	let tournamentId = parseInt(params.id);

	if (!tournamentId) {
		throw error(404, "Not found");
	}

	let tournament = await prisma.tournament.findUnique({
		where: {
			id: tournamentId,
		},
		include: {
			rounds: {
				include: {
					mappool: {
						include: {
							Maps: {
								include: {
									Map: true,
								},
							},
						},
					},
				},
			},
			Teams: {
				include: {
					Members: {
						include: {
							User: true,
						},
					},
				},
			},
		},
	});

	if (!tournament) {
		throw error(404, "Not found");
	}

	return { tournament };
}
