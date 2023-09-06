import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';
import { StatusCodes } from '$lib/StatusCodes';
const { OSU_CLIENT_SECRET, DISCORD_CLIENT_SECRET, TWITCH_CLIENT_SECRET } = private_env;
const { PUBLIC_OSU_CLIENT_ID, PUBLIC_DISCORD_CLIENT_ID, PUBLIC_TWITCH_CLIENT_ID } = public_env;

import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type Service = {
	auth_url: string;
	base_url: string;
	client_id: string | number;
	client_secret: string | number;
};

const services: { [key: string]: Service } = {
	osu: {
		auth_url: 'https://osu.ppy.sh/oauth/token',
		base_url: 'https://osu.ppy.sh/api/v2',
		client_id: parseInt(PUBLIC_OSU_CLIENT_ID),
		client_secret: OSU_CLIENT_SECRET
	},
	// OAuth URL https://discord.com/oauth2/authorize?client_id=956030276050493441&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fdiscord&response_type=code&scope=identify%20guilds.join%20guilds
	discord: {
		auth_url: 'https://discord.com/api/oauth2/token',
		base_url: 'https://discord.com/api/v10',
		client_id: PUBLIC_DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET
	},
	// OAuth URL https://id.twitch.tv/oauth2/authorize?client_id=3x4h9ud5bqjsh164ifxywll9wao6oe&redirect_uri=http://localhost:4000/auth/twitch&response_type=code&scope=user_read&force_verify=true
	twitch: {
		auth_url: 'https://id.twitch.tv/oauth2/token',
		base_url: 'https://api.twitch.tv/helix',
		client_id: PUBLIC_TWITCH_CLIENT_ID,
		client_secret: TWITCH_CLIENT_SECRET
	}
};

export const GET: RequestHandler = async ({ url, params, cookies, fetch }) => {
	const service = services[params.service];
	if (!service) {
		throw redirect(302, '/');
	}

	if (params.service == 'osu') {
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
				userId: user.id
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
				osuId: user.id,
				id: crypto.randomUUID()
			}
		});
		cookies.set('yagami_session', session.id, { path: '/', maxAge: 60 * 60 * 24 * 365 });
		throw redirect(302, '/');
	}

	if (params.service == 'discord') {
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
			console.log("token: " + JSON.stringify(token));
			throw error(
				StatusCodes.INTERNAL_SERVER_ERROR,
				"Something went wrong talking to Discord."	
			)
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
			console.log("userDate: " + JSON.stringify(userData));
			throw error(
				StatusCodes.INTERNAL_SERVER_ERROR,
				"Something went wrong talking to Discord."
			)
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

	if (params.service == 'twitch') {
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
	}

	throw redirect(302, '/profile/settings');
}
