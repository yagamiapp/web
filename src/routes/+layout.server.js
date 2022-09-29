import prisma from "../lib/prisma";

export async function load({ cookies, url }) {
	let data = { origin: url.origin };
	let session = cookies.get("yagami_session");

	if (session) {
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
			return data;
		}

		delete user.access_token;
		delete user.refresh_token;
		delete user.expires_in;
		delete user.type;

		data.user = user;
	}

	return data;
}
