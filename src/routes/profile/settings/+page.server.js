import prisma from "../../../lib/prisma";

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load(req) {
	let session = req.cookies.get("yagami_session");

	let discordAccounts = await prisma.discordAccount.findMany({
		where: {
			User: {
				Sessions: {
					some: {
						id: session,
					},
				},
			},
		},
		select: {
			id: true,
			username: true,
			avatar: true,
			discriminator: true,
		},
	});

	return { discordAccounts };
}
