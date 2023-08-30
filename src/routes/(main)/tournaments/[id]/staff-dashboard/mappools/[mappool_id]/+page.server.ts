import prisma from "$lib/prisma";
import { error, type Actions, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";
import { parseFormData } from "parse-nested-form-data";
import vine, { errors } from "@vinejs/vine";
import { ModInGameNames, ModList, Mods } from "$lib/ModEnums";

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
    new_mappool: () => {
        return {};
    },

    delete_mappool: async ({ params }) => {
        const roundId = Number(params.mappool_id);

        if (isNaN(roundId) || !roundId) {
            throw error(StatusCodes.NOT_FOUND, "Mappool/Round not found.");
        }

        // Retrieve round before deletion
        const round = await prisma.round.findFirst({
            where: {
                id: roundId
            },
            select: {
                id: true,
                mappoolId: true,
                tournamentId: true
            }
        });

        if (!round) {
            throw error(StatusCodes.BAD_REQUEST, {
                message: 'This round does not exist.'
            })
        }

        // Validate the tournament ID is correct
        if (parseInt(String(params.id)) != round.tournamentId) {
            throw error(StatusCodes.BAD_REQUEST, {
                message: 'Invalid tournament ID.'
            });
        }

        // Delete the round's mappool
        await prisma.mappool.delete({
            where: {
                id: round.mappoolId ?? undefined
            }
        });

        // Finally, detele the round
        await prisma.round.delete({
            where: {
                id: roundId
            }
        });

        throw redirect(StatusCodes.PERMANENT_REDIRECT, `/tournaments/${params.id}/staff-dashboard/mappools`);
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

    search_map: async ({ request, params }) => {
        const formData = parseFormData(await request.formData());
        const roundId = Number(params.mappool_id);

        // Create return error message object
        const mapSearchError: { slot: string, message: string } = {
            slot: String(formData.local_id),
            message: ''
        };

        if (isNaN(roundId)) {
            mapSearchError.message = 'No map ID provided.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        // Retrieve mappool ID through round
        // This is slower than just having mappool ID in the form
        // But this prevents a mappool not tied to the round from being edited
        const round = await prisma.round.findUnique({
            where: {
                id: roundId
            },
            select: {
                mappool: {
                    select: {
                        id: true
                    }
                }
            }
        });
        const mappoolId = round?.mappool?.id;

        if (!mappoolId) {
            mapSearchError.message = 'Mappool not found.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        const beatmapId = String(formData.id);

        if (!beatmapId.match(/^\d+$/g)) {
            mapSearchError.message = 'Invalid beatmap ID provided.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        let beatmap;

        // Lookup beatmap in DB
        beatmap = await prisma.map.findUnique({
            where: {
                beatmap_id: beatmapId
            }
        });
        
        if (!beatmap) {
            // Lookup beatmap in osu!web API
            // OMG the test DB data used v1 API lmao
            // const apiResponse = await fetch('https://osu.ppy.sh/api/v2/beatmaps/' + formData.id);
            // const beatmapData = await apiResponse.json();
            
            beatmap = await prisma.map.create({
                data: {
                    beatmap_id: beatmapId
                }
            });
        }

        // Connect beatmap to MapInPool
        const mapInPool = await prisma.mapInPool.update({
            where: {
                identifier_mappoolId: {
                    identifier: String(formData.local_id),
                    mappoolId: Number(mappoolId)
                }
            },
            data: {
                Map: {
                    connect: {
                        beatmap_id: beatmapId,
                    }
                }
            }
        });

        if (!mapInPool) {
            mapSearchError.message = 'Mappool slot not found.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        return {
            status: StatusCodes.OK,
        }
    },

    release_mappool: async ({ params }) => {
        const roundId = Number(params.mappool_id);

        if (isNaN(roundId) || !roundId) {
            return fail(StatusCodes.BAD_REQUEST, {
                releasePoolError: 'Invalid mappool ID provided.'
            });
        }

        // Validate all mappool slots have been filled
        const round = await prisma.round.findUnique({
            where: {
                id: roundId
            },
            select: {
                mappool: {
                    select: {
                        Maps: {
                            select: {
                                mapId: true
                            }
                        }
                    }
                },
                show_mappool: true
            }
        });

        if (!round || round.mappool?.Maps.some((map) => !map.mapId)) {
            return fail(StatusCodes.BAD_REQUEST, {
                releasePoolResponse: 'Mappool not completed.'
            });
        }

        // Toggle show_mappool
        await prisma.round.update({
            where: {
                id: roundId
            },
            data: {
                show_mappool: !round.show_mappool
            }
        });

        return {
            status: StatusCodes.OK,
            releasePoolResponse: !round.show_mappool ? 'Mappool released.' : 'Mappool unreleased.',
        }
    }
}

export const prerender = false;