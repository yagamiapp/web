import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function POST({ cookies, params }) {
	let session = cookies.get('yagami_session');

	await prisma.userSession.deleteMany({
		where: {
			id: session
		}
	});

	cookies.delete('yagami_session');

	return new Response();
}
