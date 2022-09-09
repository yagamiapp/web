import redirects from "../assets/redirects.json";

export function match(param) {
	let paths = redirects.map((x) => x.path);
	console.log(paths.includes(param));
	return true;
}
