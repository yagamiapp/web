import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

// export const ssr = true;

export const load: PageServerLoad = async () => {
	const mappools = await prisma.mappool.findMany({
		where: {
			global: true
		},
		include: {
			Maps: {
				include: {
					Map: true
				},
				orderBy: {
					modPriority: 'asc'
				}
			},
			Round: {
				include: {
					Tournament: true
				}
			}
		}
	});

	return { mappools };
}
