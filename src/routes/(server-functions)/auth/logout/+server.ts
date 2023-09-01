import prisma from '$lib/prisma';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ cookies }) => {
	const session = cookies.get('yagami_session');

	await prisma.userSession.deleteMany({
		where: {
			id: session
		}
	});

	cookies.delete('yagami_session', { path: '/' });

	return new Response();
}
