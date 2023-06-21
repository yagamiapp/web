import prisma from '$lib/prisma';
import type { Handle } from '@sveltejs/kit';
import DeviceDetector from 'node-device-detector';

const detector = new DeviceDetector();

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

	return await resolve(event);
};
