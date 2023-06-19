import prisma from '../../../lib/prisma';
import { redirect } from '@sveltejs/kit';
export async function GET({ cookies }) {
	let session = cookies.get('yagami_session');

	if (!session) {
		throw redirect(302, '/');
	}

	let user = await prisma.user.findFirst({
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
