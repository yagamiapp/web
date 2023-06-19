import type { User } from '@prisma/client';
import prisma from '../../lib/prisma';
import DeviceDetector from 'node-device-detector';
const detector = new DeviceDetector();

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load({ cookies, url, request }) {
	const data: { origin: string, user?: User } = { origin: url.origin };
	const session = cookies.get('yagami_session');

	if (!session) return data;

	const user = await prisma.user.findFirst({
		where: {
			Sessions: {
				some: {
					id: session
				}
			}
		},
	});

	if (!user) {
		cookies.delete('yagami_session');
		return data;
	}

	const userAgent = request.headers.get('user-agent') ?? "";
	const result = detector.detect(userAgent);

	await prisma.userSession.update({
		where: {
			id: session
		},
		data: {
			device: result.device.type,
			browser: result.client.name,
			os: result.os.name,
			lastUsed: new Date()
		}
	});

	data.user = user;
}
