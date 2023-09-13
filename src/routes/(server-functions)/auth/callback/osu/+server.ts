import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';
import { StatusCodes } from '$lib/StatusCodes';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { OsuOauth, User, UserSession } from '@prisma/client';
const { OSU_CLIENT_SECRET, } = private_env;
const { PUBLIC_OSU_CLIENT_ID, } = public_env;
import DeviceDetector, { type DetectResult } from 'node-device-detector';

type OsuToken = {
  token_type: string,
  expires_in: number,
  access_token: string,
  refresh_token: string
}

const service =
{
  auth_url: 'https://osu.ppy.sh/oauth/token',
  base_url: 'https://osu.ppy.sh/api/v2',
  client_id: parseInt(PUBLIC_OSU_CLIENT_ID),
  client_secret: OSU_CLIENT_SECRET
}

const detector = new DeviceDetector();

export const GET: RequestHandler = async ({ url, cookies, request }) => {
  const code = url.searchParams.get('code');

  if (!code) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');

  const token = await exchangeCode(code, url.origin);
  if (!isToken(token)) {
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong trying to contact the osu! authorization server')
  }

  const userData = await getUserInfo(token);
  if (!userData.id) {
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong trying to fetch osu! user information')
  }
  console.log(`Log in event from ${userData.username} (${userData.id})`)

  let user: (User & {
    Sessions?: UserSession[] | null,
    OsuToken?: OsuOauth | null
  }) | null = await getDBUser(userData.id);

  const sessionId = crypto.randomUUID();
  const userAgent = request.headers.get('user-agent') ?? '';
  const result = detector.detect(userAgent);

  if (!user) {
    user = await createNewUser(userData, token, result, sessionId)
  } else {
    user = await updateUser(userData, token, result, sessionId)
  }

  // Verify session was set correctly:
  if (!user?.Sessions?.map(x => x.id).includes(sessionId)) {
    console.log({ sessionId, userData });
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong assigning the token.')
  }
  cookies.set('yagami_session', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 365 })

  throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
}

const exchangeCode = async (code: string, origin: string): Promise<unknown> => {
  const body = {
    'client_id': PUBLIC_OSU_CLIENT_ID,
    'client_secret': OSU_CLIENT_SECRET,
    'code': code,
    'grant_type': 'authorization_code',
    'redirect_uri': `${origin}/auth/callback/osu`
  }

  const tokenRequest = await fetch(service.auth_url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'applicatin/json'
    },
    body: JSON.stringify(body)
  })

  return tokenRequest.json();
}

const getUserInfo = async (token: OsuToken): Promise<any> => {
  const requestUrl = `${service.base_url}/me/osu`

  const userRequest = await fetch(requestUrl, {
    headers: {
      'Authorization': `${token.token_type} ${token.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return userRequest.json();
}

const updateUser = async (userData: any, token: OsuToken, result: DetectResult, sessionToken: string) => {

  const {
    id,
    cover_url,
    country: {
      code: country_code,
      name: country_name
    },
    statistics: {
      pp,
      global_rank: pp_rank,
      ranked_score,
      hit_accuracy,
      play_count,
      total_score,
      level: {
        current: level,
        progress: level_progress
      }
    }
  } = userData;

  const { access_token, expires_in, refresh_token, token_type } = token;


  // Update data
  prisma.user.update({
    where: {
      id
    },
    data: {
      country_code,
      country_name,
      cover_url,
      ranked_score,
      play_count,
      total_score,
      pp,
      pp_rank,
      level,
      level_progress,
      hit_accuracy,
      Sessions: {
        "create": {
          id: sessionToken,
          device: result.device.type,
          browser: result.client.name,
          os: result.os.name,
          lastUsed: new Date(),
        }
      }
    }
  })

  // Update token
  await prisma.osuOauth.upsert({
    where: {
      userId: id
    },
    update: {
      access_token,
      expires_in,
      refresh_token,
      token_type,
      last_update: new Date()
    },
    create: {
      User: {
        connect: {
          id
        }
      },
      access_token,
      expires_in,
      refresh_token,
      token_type,
      last_update: new Date()
    }
  })

  return prisma.user.findUnique({
    where: {
      id
    },
    include: {
      OsuToken: true,
      Sessions: true,
    }
  })
}

const createNewUser = async (userData: any, token: OsuToken, result: DetectResult, sessionToken: string) => {

  const {
    id,
    username,
    cover_url,
    country: {
      code: country_code,
      name: country_name
    },
    statistics: {
      pp,
      global_rank: pp_rank,
      ranked_score,
      hit_accuracy,
      play_count,
      total_score,
      level: {
        current: level,
        progress: level_progress
      }
    }
  } = userData;

  const { access_token, expires_in, refresh_token, token_type } = token;

  return await prisma.user.create({
    include: {
      OsuToken: true,
      Sessions: true,
    },
    data: {
      id,
      username,
      country_code,
      country_name,
      cover_url,
      ranked_score,
      play_count,
      total_score,
      pp,
      pp_rank,
      level,
      level_progress,
      hit_accuracy,
      OsuToken: {
        "create": {
          access_token,
          expires_in,
          token_type,
          refresh_token
        }
      },
      Sessions: {
        "create": {
          id: sessionToken,
          device: result.device.type,
          browser: result.client.name,
          os: result.os.name,
          lastUsed: new Date(),
        }
      }
    }
  })
}


const getDBUser = async (id: number) => {
  return prisma.user.findUnique({ where: { id: id } })
}

const isToken = (token: unknown): token is OsuToken => {
  return (<OsuToken>token).access_token != undefined;
};
