import prisma from "../../../../lib/prisma";
import { error } from "@sveltejs/kit";

export const ssr = false;
export const prerender = false;

export async function load({ url }) {
	let res = url.searchParams.get("res");

	let matchId = url.searchParams.get("match");
	if (!matchId) {
		throw new error(
			400,
			"You must give a match argument in the parameters."
		);
	}

	let match = await prisma.match.findUnique({
		where: {
			id: parseInt(matchId),
		},
		include: {
			Teams: {
				include: {
					Team: true,
					Bans: true,
					Picks: true,
					Wins: true,
				},
			},
			Round: {
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
					Tournament: true,
				},
			},
		},
	});
	if (!match) {
		throw new error(404, `No match with id ${matchId} found.`);
	}

	return { res, match };
}
