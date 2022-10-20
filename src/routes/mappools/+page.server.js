import prisma from "../../lib/prisma";

// export const ssr = true;

export async function load() {
	let mappools = await prisma.mappool.findMany({
		where: {
			global: true,
		},
		include: {
			Maps: {
				include: {
					Map: true,
				},
				orderBy: {
					modPriority: "asc",
				},
			},
			Round: {
				include: {
					Tournament: true,
				},
			},
		},
	});

	return { mappools };
}
