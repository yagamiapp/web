import prisma from "../../../../../lib/prisma";
import { redirect } from "@sveltejs/kit";

export async function GET({ params, url, cookies }) {
  let token = cookies.get("yagami_session");

  if (params.service == "twitch") {
    let accountId = parseInt(url.searchParams.get("id"));

    let twitchAccount = await prisma.twitchAccount.findUnique({
      where: {
        id: accountId,
      },
    });

    let userCheck = await prisma.user.findFirst({
      where: {
        TwitchAccounts: {
          some: {
            id: accountId,
          },
        },
      },
    });

    if (!userCheck) {
      throw redirect(302, "/profile/settings");
    }

    await prisma.twitchOauth.delete({
      where: {
        userId: accountId,
      },
    });
    await prisma.twitchAccount.delete({
      where: {
        id: accountId,
      },
    });
  }
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
