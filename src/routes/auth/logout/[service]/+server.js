import prisma from "../../../../lib/prisma";
import { redirect } from "@sveltejs/kit";

export async function GET({ params, url }) {
	if (params.service == "discord") {
		await prisma.discordAccount.delete({
			where: {
				id: url.searchParams.get("id"),
			},
		});
	}

	throw redirect(302, "/profile/settings");
}
