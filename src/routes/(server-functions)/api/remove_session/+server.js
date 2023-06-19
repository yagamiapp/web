import prisma from '../../../../lib/prisma';
import { error } from '@sveltejs/kit';

export async function DELETE({ cookies, request }) {
	let { sessionCreationDate } = await request.json();

	if (!sessionCreationDate) {
		throw error(400);
	}

	let session = cookies.get('yagami_session');

	if (!session) {
		throw error(401);
	}

	let sessionToDelete = await prisma.userSession.findFirst({
		where: {
			createdAt: sessionCreationDate,
			User: {
				Sessions: {
					some: {
						id: session
					}
				}
			}
		}
	});

	if (!sessionToDelete) {
		throw error(401, 'Unauthorized.');
	}

	await prisma.userSession.delete({
		where: {
			id: sessionToDelete.id
		}
	});

	if (sessionToDelete.id == session) {
		cookies.delete('yagami_session');
	}

	return new Response('Deleted!');
}
