import prisma from "../../../../lib/prisma";
import { error, json } from "@sveltejs/kit";

// I hate javascript
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export async function GET({ url }) {
	let id = url.searchParams.get("id");

	if (!id) {
		throw new error(401, "Missing Required Parameter: ID");
	}

	let match = await prisma.match.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			Teams: {
				include: {
					Team: {
						include: {
							Members: {
								include: {
									User: true,
								},
							},
						},
					},
					Bans: {
						include: {
							Map: {
								include: {
									Map: true,
								},
							},
						},
					},
					Picks: {
						include: {
							WonBy: {
								include: {
									Team: true,
								},
							},
							Map: {
								include: {
									Map: true,
								},
							},
						},
						orderBy: {
							pickTeamNumber: "asc",
						},
					},
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
		throw new error(404, `No match with id ${id} found.`);
	}
	return json(match);
}
