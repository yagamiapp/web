import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const session = cookies.get('yagami_session');

	if (!session) {
		throw redirect(302, '/');
	}

	const user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: session
				}
			}
		}
	});

	if (!user) {
		cookies.delete('yagami_session');
		throw redirect(302, '/');
	}

	throw redirect(302, `/u/${user.id}`);
}
