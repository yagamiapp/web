export function GET({ url }) {
	console.log(url);
	return new Response("hi");
}
