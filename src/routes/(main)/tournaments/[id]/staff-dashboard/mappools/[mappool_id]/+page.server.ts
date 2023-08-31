import prisma from "$lib/prisma";
import { error, type Actions, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";
import { parseFormData } from "parse-nested-form-data";
import vine, { errors } from "@vinejs/vine";
import { ModInGameNames, ModList, Mods } from "$lib/ModEnums";
import { deleteMappool } from "./ActionDeleteMapoool";
import { assignMap } from "./ActionAssignMap";
import { releaseMappool } from "./ActionReleaseMappool";

export const load: PageServerLoad = async ({ params, parent }) => {
    // Because rounds and mappools are 1:1 for now, retrieve the round data
    const roundId = Number(params.mappool_id);

    if (isNaN(roundId)) {
        throw error(StatusCodes.NOT_FOUND, "Mappool/Round not found.");
    }

    const { tournament } = await parent();
    const { rounds } = tournament;
    const round: db.RoundWithEverything | undefined = rounds.find((r) => r.id == roundId);
    
    if (!round) {
        throw error(StatusCodes.NOT_FOUND, "Mappool/Round not found.");
    }

    // Create the mappool object for the round if it doesn't exist already
    if (!round.mappool) {
        await prisma.mappool.create({
            data: {
                global: false,
                Round: {
                    connect: {
                        id: round.id
                    }
                },
                // tournament and round related attributes will stay null for now (like test data)
                // (this is scuffed)
                Maps: {
                    create: []
                }
            }
        });
    }

    return { round };
}


export const actions: Actions = {
    delete_mappool: async ({ params }) => {
        const roundId = Number(params.mappool_id);
        if (isNaN(roundId) || !roundId) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Mappool/Round not found."
            }
        }

        const result = await deleteMappool(roundId);

        if (result.status == StatusCodes.OK) {
            throw redirect(StatusCodes.PERMANENT_REDIRECT, `/tournaments/${params.id}/staff-dashboard/mappools`);
        }
        else {
            throw error(result.status, result.message);
        }
    },

    update_mappool: async ({ request, params }) => {
        const data = parseFormData(await request.formData());
        const roundId = Number(params.mappool_id);

        if (isNaN(roundId) || !roundId) {
            throw error(StatusCodes.NOT_FOUND, "Mappool/Round not found.");
        }

        const schema = vine.object({
            name: vine.string(),
            acronym: vine.string(),
            bans: vine.number().positive().withoutDecimals(),
            best_of: vine.number().positive().withoutDecimals(),
        });

        try {
			const result = await vine.validate({ schema, data });

			await prisma.round.update({
				where: {
					id: roundId
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

    generate_mappool: async ({ request, params }) => {
        // Takes the mod pools and number of slots per modpool
        const formData = parseFormData(await request.formData());
        const roundId = Number(params.mappool_id);

        if (isNaN(roundId) || !roundId) {
            return fail(StatusCodes.BAD_REQUEST, {
                message: 'Invalid round ID provided.'
            });
        }

        // Find mappool through round
        const round = await prisma.round.findUnique({
            where: {
                id: roundId
            },
            select: {
                mappoolId: true
            }
        });

        const mappoolId = round?.mappoolId;
        if (!mappoolId) {
            throw error(StatusCodes.BAD_REQUEST, {
                message: 'Mappool does not exist.'
            })
        }

        // Generate empty MapInPool entries for each slot
        const mapIds: string[] = [];
        for (const key in formData) {
            let nOfSlots = Number(formData[key]);
            if (isNaN(nOfSlots)) {
                nOfSlots = 0;
            }
            
            // Validate the key is a valid mod
            const modPriority = ModList.indexOf(key as Mods);
            if (modPriority == -1) {
                return fail(StatusCodes.BAD_REQUEST, {
                    message: 'Invalid mod provided.'
                });
            }

            for (let slot = 1; slot <= nOfSlots; slot++) {
                const identifier = `${key}${slot}`;
                mapIds.push(identifier);

                await prisma.mapInPool.upsert({
                    create: {
                        identifier,
                        mods: ModInGameNames[key],
                        modPriority: ModList.indexOf(key as Mods),
                        Mappool: {
                            connect: {
                                id: mappoolId
                            }
                        },
                        InMatches: {
                            create: []
                        }
                    },
                    update: {},
                    where: {
                        identifier_mappoolId: {
                            identifier,
                            mappoolId
                        },
                    }
                });
            }
        }

        // Delete all maps from the mappool that were not generated/updated by this action
        const allMapsInPool = await prisma.mapInPool.findMany({
            where: {
                mappoolId
            },
            select: {
                identifier: true,
                mappoolId: true
            }
        });

        for (const mapInPool of allMapsInPool) {
            if (!mapIds.some(m => m == mapInPool.identifier)) {
                await prisma.mapInPool.delete({
                    where: {
                        identifier_mappoolId: {
                            identifier: mapInPool.identifier,
                            mappoolId: mapInPool.mappoolId
                        }
                    }
                });
            }
        }

        return {
            status: StatusCodes.CREATED,
            message: 'Mappool generated.',
        }
    },

    assign_map: async ({ request, params }) => {
        const formData = parseFormData(await request.formData());
        const roundId = Number(params.mappool_id);

        const result = await assignMap(roundId, String(formData.local_id), String(formData.id));

        if (result.status == StatusCodes.OK) {
            return result
        }
        else {
            // Create return error message object
            const mapSearchError: { slot: string, message: string } = {
                slot: String(formData.local_id),
                message: result.message ?? ''
            };

            return fail(result.status, { mapSearchError });
        }
    },

    release_mappool: async ({ params }) => {
        const roundId = Number(params.mappool_id);

        if (isNaN(roundId) || !roundId) {
            return fail(StatusCodes.BAD_REQUEST, {
                releasePoolResponse: 'Invalid mappool ID provided.'
            });
        }

        const result = await releaseMappool(roundId);

        if (result.status == StatusCodes.OK) {
            return {
                status: StatusCodes.OK,
                releasePoolResponse: result.message
            }
        }
        else {
            return fail(result.status, { releasePoolResponse: result.message });
        }
    }
}

export const prerender = false;