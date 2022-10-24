import prisma from "../../../../lib/prisma";
import { redirect } from "@sveltejs/kit";

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load(req) {
	let session = req.cookies.get("yagami_session");

	if (!session) {
		throw redirect(302, "/");
	}

	let sessionCheck = await prisma.userSession.findUnique({
		where: {
			id: session,
		},
	});

	if (!sessionCheck) {
		throw redirect(302, "/");
	}

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

	let sessions = await prisma.userSession.findMany({
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
			os: true,
			device: true,
			browser: true,
			lastUsed: true,
			createdAt: true,
		},
	});

	sessions.sort((a, b) => b.lastUsed - a.lastUsed);
	sessions[0].current = true;

	return { discordAccounts, sessions };
}
