import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load(req) {
	const session = req.cookies.get('yagami_session');

	if (!session) {
		throw redirect(302, '/');
	}

	const sessionCheck = await prisma.userSession.findUnique({
		where: {
			id: session
		}
	});

	if (!sessionCheck) {
		throw redirect(302, '/');
	}

	const discordAccounts = await prisma.discordAccount.findMany({
		where: {
			User: {
				Sessions: {
					some: {
						id: session
					}
				}
			}
		},
		select: {
			id: true,
			username: true,
			avatar: true,
			discriminator: true
		}
	});

	const twitchAccounts = await prisma.twitchAccount.findMany({
		where: {
			User: {
				Sessions: {
					some: {
						id: session
					}
				}
			}
		}
	});

	const sessions = await prisma.userSession.findMany({
		where: {
			User: {
				Sessions: {
					some: {
						id: session
					}
				}
			}
		},
		select: {
			os: true,
			device: true,
			browser: true,
			lastUsed: true,
			createdAt: true
		}
	});

	sessions.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
	sessions[0].current = true;

	return { discordAccounts, twitchAccounts, sessions };
}
