import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let user = await prisma.user.findUnique({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!user) {
		throw error(404, 'Not found');
	}

	return { user };
}
