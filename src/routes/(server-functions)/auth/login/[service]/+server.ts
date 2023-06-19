import {
	PUBLIC_DISCORD_CLIENT_ID,
	PUBLIC_OSU_CLIENT_ID,
	PUBLIC_TWITCH_CLIENT_ID
} from '$env/static/public';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

type Service = {
	login_url: string;
	client_id: string | number;
	scope: string;
	args?: string;
};

const clientIds: { [key: string]: Service } = {
	osu: {
		login_url: 'https://osu.ppy.sh/oauth/authorize',
		client_id: parseInt(PUBLIC_OSU_CLIENT_ID),
		scope: 'identify'
	},
	// OAuth URL https://discord.com/oauth2/authorize?client_id=956030276050493441&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fdiscord&response_type=code&scope=identify%20guilds.join%20guilds
	discord: {
		login_url: 'https://discord.com/oauth2/authorize',
		client_id: PUBLIC_DISCORD_CLIENT_ID,
		scope: 'guilds.join guilds'
	},
	// OAuth URL https://id.twitch.tv/oauth2/authorize?client_id=3x4h9ud5bqjsh164ifxywll9wao6oe&redirect_uri=http://localhost:4000/auth/twitch&response_type=code&scope=user_read&force_verify=true
	twitch: {
		login_url: 'https://id.twitch.tv/oauth2/authorize',
		client_id: PUBLIC_TWITCH_CLIENT_ID,
		scope: 'user_read',
		args: 'force_verify=true'
	}
};

export const GET: RequestHandler = async ({ url, params }) => {
	const serviceName = params.service;
	const service = clientIds[serviceName];

	if (!service) {
		throw error(StatusCodes.NOT_FOUND);
	}

	const requestParams = new URLSearchParams();
	requestParams.set('client_id', `${service.client_id}`);
	requestParams.set('response_type', 'code');
	requestParams.set('scope', service.scope);
	requestParams.set('redirect_uri', `${url.origin}/auth/callback/${serviceName}`);

	const redirectUrl = `${service.login_url}?${requestParams.toString()}${
		service.args ? '&' + service.args : ''
	}`;

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, redirectUrl);
};
