import prisma from "../../../../../lib/prisma";
import { redirect } from "@sveltejs/kit";

export async function GET({ params, url, cookies }) {
	let token = cookies.get("yagami_session");

	if (params.service == "discord") {
		let accountId = url.searchParams.get("id");
		let discordAccount = await prisma.discordAccount.findUnique({
			where: {
				id: accountId,
			},
		});

		let userCheck = await prisma.user.findFirst({
			where: {
				DiscordAccounts: {
					some: {
						id: discordAccount.id,
					},
				},
				Sessions: {
					some: {
						id: token,
					},
				},
			},
		});

		if (!userCheck) {
			throw redirect(302, "/profile/settings");
		}

		await prisma.discordOauth.delete({
			where: {
				userId: discordAccount.id,
			},
		});
		await prisma.discordAccount.delete({
			where: {
				id: discordAccount.id,
			},
		});
	}

	throw redirect(302, "/profile/settings");
}
