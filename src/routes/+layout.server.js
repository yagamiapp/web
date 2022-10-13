import prisma from "../lib/prisma";
import DeviceDetector from "node-device-detector";
import DeviceHelper from "node-device-detector/helper";
const detector = new DeviceDetector();

/** @type {import("@sveltejs/kit").ServerLoad} */
export async function load({ cookies, url, request }) {
	let data = { origin: url.origin };
	let session = cookies.get("yagami_session");

	if (session) {
		let user = await prisma.user.findFirst({
			where: {
				Sessions: {
					some: {
						id: session,
					},
				},
			},
		});

		if (!user) {
			cookies.delete("yagami_session");
			return data;
		}

		let userAgent = request.headers.get("user-agent");
		let result = detector.detect(userAgent);

		await prisma.userSession.update({
			where: {
				id: session,
			},
			data: {
				device: result.device.type,
				browser: result.client.name,
				lastUsed: new Date(),
			},
		});

		delete user.access_token;
		delete user.refresh_token;
		delete user.expires_in;
		delete user.type;

		data.user = user;
	}

	return data;
}
