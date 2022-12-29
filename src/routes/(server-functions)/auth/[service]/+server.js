import { env as private_env } from "$env/dynamic/private";
import { env as public_env } from "$env/dynamic/public";
const { OSU_CLIENT_SECRET, DISCORD_CLIENT_SECRET, TWITCH_CLIENT_SECRET } =
  private_env;
const {
  PUBLIC_OSU_CLIENT_ID,
  PUBLIC_DISCORD_CLIENT_ID,
  PUBLIC_TWITCH_CLIENT_ID,
} = public_env;

import prisma from "../../../../lib/prisma";
import { redirect } from "@sveltejs/kit";

let services = {
  osu: {
    auth_url: "https://osu.ppy.sh/oauth/token",
    base_url: "https://osu.ppy.sh/api/v2",
    client_id: PUBLIC_OSU_CLIENT_ID,
    client_secret: OSU_CLIENT_SECRET,
  },
  // OAuth URL https://discord.com/oauth2/authorize?client_id=956030276050493441&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fdiscord&response_type=code&scope=identify%20guilds.join%20guilds
  discord: {
    auth_url: "https://discord.com/api/oauth2/token",
    base_url: "https://discord.com/api/v10",
    client_id: PUBLIC_DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
  },
  // OAuth URL https://id.twitch.tv/oauth2/authorize?client_id=3x4h9ud5bqjsh164ifxywll9wao6oe&redirect_uri=http://localhost:4000/auth/twitch&response_type=code&scope=user_read&force_verify=true
  twitch: {
    auth_url: "https://id.twitch.tv/oauth2/token",
    base_url: "https://api.twitch.tv/helix",
    client_id: PUBLIC_TWITCH_CLIENT_ID,
    client_secret: TWITCH_CLIENT_SECRET,
  },
};

export async function GET({ url, params, cookies }) {
  let service = services[params.service];
  if (!service) {
    throw redirect(302, "/");
  }

  if (params.service == "osu") {
    let tokenRequest = {
      client_id: service.client_id,
      client_secret: service.client_secret,
      code: url.searchParams.get("code"),
      grant_type: "authorization_code",
      redirect_uri: `${url.origin}/auth/osu`,
    };
    let response = await fetch(service.auth_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(tokenRequest),
    });
    response = await response.json();
    // Get user from osu API
    let reqUrl = `${service.base_url}/me`;
    let userResponse = await fetch(reqUrl, {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
        Accept: "application/json",
      },
    });
    userResponse = await userResponse.json();

    let { id, username, country_code, cover_url } = userResponse;
    let country_name = userResponse.country.name;
    let {
      ranked_score,
      play_count,
      total_score,
      global_rank: pp_rank,
      hit_accuracy,
      pp,
    } = userResponse.statistics;
    let { current: level, progress: level_progress } =
      userResponse.statistics.level;

    let user = await prisma.user.findUnique({
      where: {
        id: userResponse.id,
      },
    });

    user = await prisma.user.upsert({
      where: {
        id: id,
      },
      create: {
        id,
        username,
        country_code,
        country_name,
        cover_url,
        ranked_score,
        play_count,
        total_score,
        pp_rank,
        hit_accuracy,
        level,
        level_progress,
        pp,
      },
      update: {
        username,
        cover_url,
        ranked_score,
        play_count,
        total_score,
        pp,
        pp_rank,
        hit_accuracy,
        level,
        level_progress,
      },
    });

    let { access_token, expires_in, refresh_token, token_type } = response;

    await prisma.osuOauth.upsert({
      where: {
        userId: user.id,
      },
      create: {
        access_token,
        expires_in,
        refresh_token,
        token_type,
        userId: user.id,
      },
      update: {
        access_token,
        expires_in,
        refresh_token,
        token_type,
        last_update: new Date(),
      },
    });

    let session = await prisma.userSession.create({
      data: {
        osuId: user.id,
        id: crypto.randomUUID(),
      },
    });
    cookies.set("yagami_session", session.id, { path: "/" });
    throw redirect(302, "/");
  }

  if (params.service == "discord") {
    // Get oAuth token
    let tokenRequest = {
      client_id: service.client_id,
      client_secret: service.client_secret,
      code: url.searchParams.get("code"),
      grant_type: "authorization_code",
      redirect_uri: `${url.origin}/auth/discord`,
    };

    let tokenRequestForm = new URLSearchParams(
      Object.entries(tokenRequest)
    ).toString();

    let response = await fetch(service.auth_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/x-www-form-urlencoded",
      },
      body: tokenRequestForm,
    });
    response = await response.json();

    // Get user from discord API
    let reqUrl = `${service.base_url}/users/@me`;
    let userResponse = await fetch(reqUrl, {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    });
    userResponse = await userResponse.json();

    let user = await prisma.user.findFirst({
      where: {
        Sessions: {
          some: {
            id: cookies.get("yagami_session"),
          },
        },
      },
      include: {
        DiscordAccounts: {
          select: {
            id: true,
          },
        },
      },
    });
    let accountTest = user.DiscordAccounts.map((x) => x.id);

    let { id, username, avatar, discriminator, flags } = userResponse;

    if (!accountTest || !accountTest.includes(id)) {
      let { access_token, expires_in, refresh_token, token_type, scope } =
        response;

      await prisma.discordAccount.create({
        data: {
          id,
          username,
          avatar,
          discriminator,
          flags,
          User: {
            connect: {
              id: user.id,
            },
          },
          DiscordToken: {
            create: {
              access_token,
              expires_in,
              refresh_token,
              token_type,
              scope,
              last_update: new Date(),
            },
          },
        },
      });
    }

    throw redirect(302, "/profile/settings");
  }

  if (params.service == "twitch") {
    // Get oAuth token
    let tokenRequest = {
      client_id: service.client_id,
      client_secret: service.client_secret,
      code: url.searchParams.get("code"),
      grant_type: "authorization_code",
      redirect_uri: `${url.origin}/auth/twitch`,
    };
    let tokenRequestForm = new URLSearchParams(
      Object.entries(tokenRequest)
    ).toString();
    let response = await fetch(service.auth_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/x-www-form-urlencoded",
      },
      body: tokenRequestForm,
    });
    response = await response.json();

    if (!response.access_token) {
      console.log(response);
      throw new redirect(302, "/profile/settings");
    }

    // Get user from discord API
    let reqUrl = `${service.base_url}/users`;
    let userResponse = await fetch(reqUrl, {
      headers: {
        "Client-Id": service.client_id,
        Authorization: `Bearer ${response.access_token}`,
      },
    });
    userResponse = await userResponse.json();

    let user = await prisma.user.findFirst({
      where: {
        Sessions: {
          some: {
            id: cookies.get("yagami_session"),
          },
        },
      },
    });

    let twitchUser = await prisma.twitchAccount.upsert({
      create: {
        User: {
          connect: {
            id: user.id,
          },
        },
        id: parseInt(userResponse.data[0].id),
        username: userResponse.data[0].login,
      },
      where: {
        id: parseInt(userResponse.data[0].id),
      },
      update: {
        TwitchToken: {
          update: {
            last_update: new Date(),
          },
        },
      },
    });

    let twitchOauth = await prisma.twitchOauth.upsert({
      where: {
        userId: twitchUser.id,
      },
      create: {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: Date.now() + response.expires_in * 1000,
        token_type: response.token_type,
        userId: twitchUser.id,
      },
      update: {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: Date.now() + response.expires_in * 1000,
        token_type: response.token_type,
        userId: twitchUser.id,
      },
    });
  }

  throw new redirect(302, "/profile/settings");
}
