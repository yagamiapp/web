import type { User } from '@prisma/client';
import prisma from '../../lib/prisma';

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load({ cookies, url }) {
	const data: { origin: string; user?: User } = { origin: url.origin };
	const session = cookies.get('yagami_session');

	if (!session) return data;

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
		return data;
	}


	data.user = user;

	return data;
}
