import { redirect } from '@sveltejs/kit';

export function GET({ url }) {
	throw redirect(302, '/');
}
