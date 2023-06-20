import prisma from '$lib/prisma';
import type { Handle } from '@sveltejs/kit';
import DeviceDetector from 'node-device-detector';

const detector = new DeviceDetector();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('yagami_session');
	const user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: sessionId
				}
			}
		}
	});

	if (user) {
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
	}

	const response = await resolve(event);
	return response;
};
