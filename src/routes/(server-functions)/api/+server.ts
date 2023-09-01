import { StatusCodes } from '$lib/StatusCodes';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = function() {
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
}
