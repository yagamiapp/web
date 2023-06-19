import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../../lib/prisma';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ params, url, cookies }) {
	const token = cookies.get('yagami_session');

	if (params.service == 'twitch') {
		const id = url.searchParams.get('id');
		if (!id) throw error(StatusCodes.BAD_REQUEST);
		const accountId = parseInt(id);

		const userCheck = await prisma.user.findFirst({
			where: {
				TwitchAccounts: {
					some: {
						id: accountId
					}
				}
			}
		});

		if (!userCheck) {
			throw redirect(302, '/profile/settings');
		}

		await prisma.twitchOauth.delete({
			where: {
				userId: accountId
			}
		});
		await prisma.twitchAccount.delete({
			where: {
				id: accountId
			}
		});
	}
	if (params.service == 'discord') {
		const accountId = url.searchParams.get('id');

		if (!accountId) throw error(StatusCodes.BAD_REQUEST);

		const discordAccount = await prisma.discordAccount.findUnique({
			where: {
				id: accountId
			}
		});

		if (!discordAccount) throw redirect(302, '/profile/settings');

		const userCheck = await prisma.user.findFirst({
			where: {
				DiscordAccounts: {
					some: {
						id: discordAccount.id
					}
				},
				Sessions: {
					some: {
						id: token
					}
				}
			}
		});

		if (!userCheck) {
			throw redirect(302, '/profile/settings');
		}

		await prisma.discordOauth.delete({
			where: {
				userId: discordAccount.id
			}
		});
		await prisma.discordAccount.delete({
			where: {
				id: discordAccount.id
			}
		});
	}

	throw redirect(302, '/profile/settings');
}
