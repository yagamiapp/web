import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';

import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "$lib/StatusCodes";

const { TWITCH_CLIENT_SECRET } = private_env;
const { PUBLIC_TWITCH_CLIENT_ID } = public_env;

const service = {
  auth_url: 'https://id.twitch.tv/oauth2/token',
  base_url: 'https://api.twitch.tv/helix',
  client_id: PUBLIC_TWITCH_CLIENT_ID,
  client_secret: TWITCH_CLIENT_SECRET
}

export const GET: RequestHandler = async ({ url, cookies }) => {
  // Get oAuth token
  const tokenRequestData = {
    client_id: service.client_id,
    client_secret: service.client_secret,
    code: url.searchParams.get('code'),
    grant_type: 'authorization_code',
    redirect_uri: `${url.origin}/auth/callback/twitch`
  };

  const tokenRequestForm = new URLSearchParams();
  for (const [key, value] of Object.entries(tokenRequestData)) {
    if (!value) continue;
    tokenRequestForm.set(key, `${value}`);
  }

  const tokenRequest = await fetch(service.auth_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/x-www-form-urlencoded'
    },
    body: tokenRequestForm
  });
  const token = await tokenRequest.json();

  if (!token.access_token) {
    console.log(token);
    throw redirect(302, '/profile/settings');
  }

  // Get user from twitch API
  const reqUrl = `${service.base_url}/users`;
  const userRequest = await fetch(reqUrl, {
    headers: {
      'Client-Id': `${service.client_id}`,
      Authorization: `Bearer ${token.access_token}`
    }
  });
  const userData = await userRequest.json();

  const user = await prisma.user.findFirst({
    where: {
      Sessions: {
        some: {
          id: cookies.get('yagami_session')
        }
      }
    }
  });

  if (!user) throw error(StatusCodes.BAD_REQUEST);

  const twitchUser = await prisma.twitchAccount.upsert({
    create: {
      User: {
        connect: {
          id: user.id
        }
      },
      id: parseInt(userData.data[0].id),
      username: userData.data[0].login
    },
    where: {
      id: parseInt(userData.data[0].id)
    },
    update: {
      TwitchToken: {
        update: {
          last_update: new Date()
        }
      }
    }
  });

  await prisma.twitchOauth.upsert({
    where: {
      userId: twitchUser.id
    },
    create: {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: Date.now() + token.expires_in * 1000,
      token_type: token.token_type,
      userId: twitchUser.id
    },
    update: {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: Date.now() + token.expires_in * 1000,
      token_type: token.token_type,
      userId: twitchUser.id
    }
  });

  throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/')
}