import prisma from "../../../lib/prisma";
import { error } from "@sveltejs/kit";

export const prerender = true;
export const ssr = true;

export async function load({ params, cookies }) {
	let tournamentId = parseInt(params.id);

	if (!tournamentId) {
		throw error(404, "Not found");
	}

	let tournament = await prisma.tournament.findUnique({
		where: {
			id: tournamentId,
		},
		include: {
			Hosts: {
				include: {
					User: {
						select: {
							username: true,
							country_code: true,
						},
					},
				},
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
									Team: true,
								},
							},
						},
					},
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

	let editPerms = false;
	let session = cookies.get("yagami_session");
	let user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: session,
				},
			},
		},
	});

	let hosts = tournament.Hosts.map((x) => x.userId);
	if (hosts.includes(user?.id)) {
		editPerms = true;
	}

	if (!tournament) {
		throw error(404, "Not found");
	}

	return { tournament, editPerms };
}
