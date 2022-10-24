import prisma from "../../lib/prisma";
import DeviceDetector from "node-device-detector";
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
			include: {
				OsuToken: true,
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
				os: result.os.name,
				lastUsed: new Date(),
			},
		});

		delete user.OsuToken;

		data.user = user;
	}

	return data;
}
