
import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';
import { StatusCodes } from '$lib/StatusCodes';
import { error } from 'console';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
const { DISCORD_CLIENT_SECRET } = private_env;
const { PUBLIC_DISCORD_CLIENT_ID } = public_env;

const service = {
  auth_url: 'https://discord.com/api/oauth2/token',
  base_url: 'https://discord.com/api/v10',
  client_id: PUBLIC_DISCORD_CLIENT_ID,
  client_secret: DISCORD_CLIENT_SECRET
}


export const GET: RequestHandler = async ({ url, cookies }) => {

  // Get oAuth token
  const tokenRequestData = {
    client_id: service.client_id,
    client_secret: service.client_secret,
    code: url.searchParams.get('code'),
    grant_type: 'authorization_code',
    redirect_uri: `${url.origin}/auth/callback/discord`
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
    body: tokenRequestForm.toString()
  });
  const token = await tokenRequest.json();

  if (token.error) {
    console.log('token: ' + JSON.stringify(token));
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong talking to Discord.');
  }

  // Get user from discord API
  const reqUrl = `${service.base_url}/users/@me`;
  const userRequest = await fetch(reqUrl, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  const userData = await userRequest.json();

  if (!userData.id) {
    console.log('userDate: ' + JSON.stringify(userData));
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong talking to Discord.');
  }

  const user = await prisma.user.findFirst({
    where: {
      Sessions: {
        some: {
          id: cookies.get('yagami_session')
        }
      }
    },
    include: {
      DiscordAccounts: {
        select: {
          id: true
        }
      }
    }
  });

  if (!user) throw error(StatusCodes.BAD_REQUEST, 'There is no user logged in');

  const accountTest = user.DiscordAccounts.map((x) => x.id);

  const { id, username, avatar, discriminator, flags } = userData;

  if (!accountTest || !accountTest.includes(id)) {
    const { access_token, expires_in, refresh_token, token_type, scope } = token;

    await prisma.discordAccount.create({
      data: {
        id,
        username,
        avatar,
        discriminator,
        flags,
        User: {
          connect: {
            id: user.id
          }
        },
        DiscordToken: {
          create: {
            access_token,
            expires_in,
            refresh_token,
            token_type,
            scope,
            last_update: new Date()
          }
        }
      }
    });
  }

  throw redirect(302, '/profile/settings');
}