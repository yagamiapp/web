import { StatusCodes } from '$lib/StatusCodes';
import { redirect } from '@sveltejs/kit';

export function GET() {
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
}
