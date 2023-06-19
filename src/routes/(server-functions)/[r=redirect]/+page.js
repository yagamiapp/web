import redirects from '$lib/assets/redirects.json';
import { redirect } from '@sveltejs/kit';

export function load({ params }) {
	let link = redirects.find((x) => x.path === params.r);
	throw redirect(302, link.dest);
}
