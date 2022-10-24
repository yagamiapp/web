import prisma from "../../../lib/prisma";

export async function load({ params }) {
	const tournaments = await prisma.tournament.findMany({
		where: {
			private: false,
		},
	});

	return { tournaments };
}
