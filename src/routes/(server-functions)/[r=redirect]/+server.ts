import redirects from '$lib/assets/redirects.json';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const GET = (async ({ params }) => {
	const link = redirects.find((x) => x.path === params.r);
	if (!link) throw error(StatusCodes.INTERNAL_SERVER_ERROR);
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, link.dest);
}) satisfies RequestHandler;
