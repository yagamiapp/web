import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { StatusCodes } from "$lib/StatusCodes";
import { parseFormData } from "parse-nested-form-data";
import vine, { errors } from "@vinejs/vine";

export const load: PageServerLoad = async () => {
    return {};
}

export const actions: Actions = {
    create_mappool: async ({ params }) => {
        const tournamentId = parseInt(String(params.id));

        // Round:Mappool = 1:1, so create mappool and round together

        const newRound = await prisma.round.create({
            data: {
                acronym: 'NR',
                name: 'New Round',
                Tournament: {
                    connect: {
                        id: tournamentId
                    }
                },
                bans: 1,
                best_of: 9,
                show_mappool: false,
            }
        });

        await prisma.mappool.create({
            data: {
                global: false,
                Round: {
                    connect: {
                        id: newRound.id
                    }
                },
                // tournament and round related attributes will stay null for now (like test data)
                // (this is scuffed)
                Maps: {
                    create: []
                }
            }
        });


        if (newRound) {
            return {
                status: StatusCodes.CREATED,
                message: 'New round created.',
                data: newRound
            }
        }

        return fail(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: 'Something went wrong. Try again later.'
        });    
    },

    delete_mappool: async ({ request }) => {
        const formData = parseFormData(await request.formData());
        const id = parseInt(String(formData.id));

        await prisma.round.delete({
            where: {
                id
            }
        });
    },

    update_mappool: async ({ request }) => {
        const data = parseFormData(await request.formData());

        const schema = vine.object({
            id: vine.number(),
            name: vine.string(),
            acronym: vine.string(),
            bans: vine.number().positive().withoutDecimals(),
            best_of: vine.number().positive().withoutDecimals(),
        });

        try {
			const result = await vine.validate({ schema, data });

			await prisma.round.update({
				where: {
					id: result.id
				},
				data: result
			});
		} catch (err) {
			if (err instanceof errors.E_VALIDATION_ERROR) {
				const status = err.status;
				const messages = err.messages;
				return fail(status, { data, messages });
			}
			else {
				throw err;
			}
		}
    },

    // This approach is significantly more user friendly but impossible due to
    //  MapInPool.Map and .mapId being mandatory attributes
    generate_mappool: async ({ request }) => {
        // Takes the mod pools and number of slots per modpool
        const formData = parseFormData(await request.formData());
        // console.log(JSON.stringify(formData));

        // Generate empty MapInPool entries for each slot
        for (const key in formData) {
            const nOfSlots = Number(formData[key]);
            
            if (!isNaN(nOfSlots)) {
                for (let slot = 1; slot <= nOfSlots; slot++) {
                    await prisma.mapInPool.create({
                        data: {
                            identifier: `${key}${slot}`,
                            mods: key,

                        }
                    });
                }
            }
        }
    }
}

export const prerender = false;