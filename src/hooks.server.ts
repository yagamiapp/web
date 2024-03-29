import { env as private_env } from '$env/dynamic/private';
import { env as public_env } from '$env/dynamic/public';
import prisma from '$lib/prisma';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import DeviceDetector from 'node-device-detector';

const { PUBLIC_OSU_CLIENT_ID } = public_env;
const { OSU_CLIENT_SECRET } = private_env;

const detector = new DeviceDetector();

// I hate javascript
// @ts-expect-error Add json functionality to BigInt type
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('yagami_session');

	if (!sessionId) return await resolve(event);

	const user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: sessionId
				}
			}
		}
	});

	if (!user) {
		event.cookies.delete('yagami_session', { path: '/' });
		return await resolve(event);
	}

	event.locals.user = user;

	const userAgent = event.request.headers.get('user-agent') ?? '';
	const result = detector.detect(userAgent);

	await prisma.userSession.update({
		where: {
			id: sessionId
		},
		data: {
			device: result.device.type,
			browser: result.client.name,
			os: result.os.name,
			lastUsed: new Date()
		}
	});

	// Add user permissions to locals based on tournament being viewed.

	// Default permissions
	const perms: App.Perms = {
		edit: false,
		playing: false
	};

	const tournamentId = event.params.id ?? null;
	if (tournamentId) {
		const tournament = await prisma.tournament.findUnique({
			where: {
				id: parseInt(tournamentId)
			},
			include: {
				Hosts: {
					select: {
						userId: true
					}
				},
				Teams: {
					include: {
						Members: {
							select: {
								osuId: true
							}
						}
					}
				}
			}
		});

		if (tournament) {
			// Check if user is a host
			const hostIds = tournament.Hosts.map((x) => x.userId);
			if (hostIds.includes(user.id)) {
				perms.edit = true;
			}

			// Check if user is playing in tournament
			const players = tournament.Teams.map((team) => team.Members.map((player) => player.osuId));
			if (players.find((playerIds) => playerIds.includes(user.id))) {
				perms.playing = true;
			}
		}
	}

	event.locals.perms = perms;

	return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	// For osu!api requests...
	if (request.url.startsWith('https://osu.ppy.sh/api/v2/')) {
		// Retrieve session user's token
		const sessionId = event.cookies.get('yagami_session');
		const user = await prisma.user.findFirst({
			where: {
				Sessions: {
					some: {
						id: sessionId
					}
				}
			},
			include: {
				OsuToken: true
			}
		});
		console.log('Request made to osu!api: ' + request.url);

		if (user?.OsuToken) {
			let { OsuToken } = user;

			// Validate the token is still valid
			const secondsSinceLastUpdate = (new Date().valueOf() - OsuToken.last_update.valueOf()) / 1000;
			if (secondsSinceLastUpdate >= OsuToken.expires_in) {
				// The token has expired. Refresh token.
				console.log('Refreshing token (user: ' + OsuToken.userId + ')...');
				const refreshURL = 'https://osu.ppy.sh/oauth/token';
				const refreshBody = {
					client_id: PUBLIC_OSU_CLIENT_ID,
					client_secret: OSU_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: OsuToken.refresh_token
				};
				const refreshHeaders = {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				};

				let refreshResponse;
				try {
					refreshResponse = await fetch(refreshURL, {
						method: 'POST',
						headers: refreshHeaders,
						body: JSON.stringify(refreshBody)
					});
				} catch (error) {
					console.log(error);
					throw error;
				}

				const updatedToken = await refreshResponse.json();
				if (refreshResponse.ok) {
					OsuToken = await prisma.osuOauth.update({
						where: {
							userId: OsuToken.userId
						},
						data: {
							token_type: updatedToken.token_type,
							refresh_token: updatedToken.refresh_token,
							expires_in: updatedToken.expires_in,
							access_token: updatedToken.access_token,
							last_update: new Date()
						}
					});
					console.log('Token successfully refreshed.');
				} else {
					console.log(
						'Something went wrong refreshing the token for user ' +
						user.id +
						' (' +
						user.username +
						'): '
					);
					console.log(updatedToken);
				}
			}

			request.headers.set('Content-Type', 'application/json');
			request.headers.set('Accept', 'application/json');
			request.headers.set('Authorization', OsuToken.token_type + ' ' + OsuToken.access_token);

			return fetch(request);
		}
	}

	return fetch(request);
};
