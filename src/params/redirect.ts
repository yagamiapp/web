import redirects from '$lib/assets/redirects.json';

export function match(param) {
	const paths = redirects.map((x) => x.path);
	return paths.includes(param);
}
