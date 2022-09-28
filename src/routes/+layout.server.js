import prisma from "../lib/prisma";

export async function load({ cookies, url }) {
	let session = cookies.get("yagami_session");

	let user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: session,
				},
			},
		},
	});

	if (!user) {
		cookies.delete("yagami_session");
		return { origin: url.origin };
	}

	delete user.access_token;
	delete user.refresh_token;
	delete user.expires_in;
	delete user.type;

	return {
		user,
		origin: url.origin,
	};
}
