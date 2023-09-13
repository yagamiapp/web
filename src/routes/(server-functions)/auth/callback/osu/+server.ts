import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';
import { StatusCodes } from '$lib/StatusCodes';
import { error } from 'console';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
const { OSU_CLIENT_SECRET, } = private_env;
const { PUBLIC_OSU_CLIENT_ID, } = public_env;

const service =
{
  auth_url: 'https://osu.ppy.sh/oauth/token',
  base_url: 'https://osu.ppy.sh/api/v2',
  client_id: parseInt(PUBLIC_OSU_CLIENT_ID),
  client_secret: OSU_CLIENT_SECRET
}

export const GET: RequestHandler = async ({ url, cookies }) => {
  const tokenRequestData = {
    client_id: service.client_id,
    client_secret: service.client_secret,
    code: url.searchParams.get('code'),
    grant_type: 'authorization_code',
    redirect_uri: `${url.origin}/auth/callback/osu`
  };
  const tokenRequest = await fetch(service.auth_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(tokenRequestData)
  });
  const token = await tokenRequest.json();

  if (token.error) {
    throw error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong while logging in to osu!'
    );
  }

  // Get user from osu API
  const reqUrl = `${service.base_url}/me`;
  const userRequest = await fetch(reqUrl, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      Accept: 'application/json'
    }
  });
  const userData = await userRequest.json();

  if (userData.authentication == 'basic') {
    throw error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong while fetching osu user data'
    );
  }

  const { id, username, country_code, cover_url } = userData;
  const country_name = userData.country.name;
  const {
    ranked_score,
    play_count,
    total_score,
    global_rank: pp_rank,
    hit_accuracy,
    pp
  } = userData.statistics;
  const { current: level, progress: level_progress } = userData.statistics.level;

  let user = await prisma.user.findUnique({
    where: {
      id: userData.id
    }
  });

  user = await prisma.user.upsert({
    where: {
      id: id
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
      pp
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
      level_progress
    }
  });

  const { access_token, expires_in, refresh_token, token_type } = token;

  await prisma.osuOauth.upsert({
    where: {
      userId: user.id
    },
    create: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
      User: {
        connect: {
          id: user.id
        }
      }
    },
    update: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
      last_update: new Date()
    }
  });

  const session = await prisma.userSession.create({
    data: {
      User: {
        connect: {
          id: userData.id
        }
      },
      id: crypto.randomUUID()
    }
  });
  cookies.set('yagami_session', session.id, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  throw redirect(302, '/');
}