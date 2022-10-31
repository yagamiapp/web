import prisma from "../../../../../lib/prisma";
import { error, redirect } from "@sveltejs/kit";

export const prerender = "auto";

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

	if (!tournament) {
		throw error(404, "Not found");
	}

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
	if (!hosts.includes(user?.id)) {
		throw redirect(302, "./");
	}

	return { tournament };
}
