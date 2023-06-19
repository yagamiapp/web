import prisma from '$lib/prisma';

export async function POST({ cookies }) {
	const session = cookies.get('yagami_session');

	await prisma.userSession.deleteMany({
		where: {
			id: session
		}
	});

	cookies.delete('yagami_session', { path: "/" });

	return new Response();
}
