import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { StatusCodes } from "$lib/StatusCodes";
import { parseFormData } from "parse-nested-form-data";
import vine, { errors } from "@vinejs/vine";
import { ModInGameNames, ModList, Mods } from "$lib/ModEnums";

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
                roundId: newRound.id
            }
        }

        return fail(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: 'Something went wrong. Try again later.'
        });    
    },

    delete_mappool: async ({ request, params }) => {
        const formData = parseFormData(await request.formData());
        const id = parseInt(String(formData.id));

        // Retrieve round before deletion
        const round = await prisma.round.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                mappoolId: true,
                tournamentId: true
            }
        });

        if (!round) {
            return fail(StatusCodes.BAD_REQUEST, {
                message: 'This round does not exist.'
            })
        }

        // Validate the tournament ID is correct
        // (prevents the changing of round ID on the client-side being able to delete another tournament's round)
        if (parseInt(String(params.id)) != round.tournamentId) {
            return fail(StatusCodes.BAD_REQUEST, {
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
                id
            }
        })
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


    generate_mappool: async ({ request }) => {
        // Takes the mod pools and number of slots per modpool
        const formData = parseFormData(await request.formData());
        let roundId = formData.round_id;
        
        if (roundId == null || roundId == undefined) {
            return fail(StatusCodes.BAD_REQUEST, {
                message: 'No mappool id provided.'
            });
            // Could alternatively create a new mappool but this could be abused
        }

        roundId = Number(roundId);
        if (isNaN(roundId)) {
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

        let mappoolId = round?.mappoolId;

        if (!mappoolId) {
            // Create a blank mappool for this round
            const newMappool = await prisma.mappool.create({
                data: {
                    global: false,
                    Round: {
                        connect: {
                            id: roundId
                        }
                    },
                    // tournament and round related attributes will stay null for now (like test data)
                    // (this is scuffed)
                    Maps: {
                        create: []
                    }
                }
            });

            mappoolId = newMappool.id;
        }

        // Generate empty MapInPool entries for each slot
        const mapIds: string[] = [];
        for (const key in formData) {
            if (key == "round_id") {
                continue;
            }

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

        allMapsInPool.forEach(async mapInPool =>{
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
        });


        return {
            status: StatusCodes.CREATED,
            message: 'Mappool generated.',
            roundId: roundId
        }
    },

    search_map: async ({ request, params }) => {
        const formData = parseFormData(await request.formData());

        // Create return error message object
        const mapSearchError: { slot: string, message: string } = {
            slot: String(formData.local_id),
            message: ''
        };

        if (!formData.id) {
            mapSearchError.message = 'No map ID provided.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        // Retrieve mappool
        const mappool = await prisma.mappool.findUnique({
            where: {
                id: Number(formData.mappool_id)
            },
            select: {
                Round: {
                    select: {
                        id: true,
                        tournamentId: true
                    }
                }
            }
        });

        // Validate mappool and round are linked/exist
        // (it should not be possible for the mappool not to be linked to a round at this point)
        if (!mappool?.Round) {
            mapSearchError.message = 'Mappool not found.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        // Validate this mappool/round are from this tournament
        if (mappool.Round.tournamentId != Number(params.id)) {
            mapSearchError.message = 'Invalid mappool ID.';
            return fail(StatusCodes.BAD_REQUEST, { mapSearchError });
        }

        const beatmapId = String(formData.id);
        let beatmap;

        // Lookup beatmap in DB
        beatmap = await prisma.map.findUnique({
            where: {
                beatmap_id: beatmapId
            }
        });
        // console.log(beatmap);
        
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
                    mappoolId: Number(formData.mappool_id)
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
            roundId: mappool.Round.id
        }
    },

    release_mappool: async ({ request }) => {
        const mappoolId = Number((await request.formData()).get('mappool_id'));

        if (isNaN(mappoolId)) {
            return fail(StatusCodes.BAD_REQUEST, {
                message: 'Invalid mappool ID provided.'
            });
        }

        const mappool = await prisma.mappool.findUnique({
            where: {
                id: mappoolId
            },
            select: {
                Round: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!mappool?.Round) {
            return fail(StatusCodes.BAD_REQUEST, {
                message: 'Mappool not found.'
            });
        }

        const roundId = mappool.Round.id;

        await prisma.round.update({
            where: {
                id: roundId
            },
            data: {
                show_mappool: true
            }
        });

        return {
            status: StatusCodes.OK,
            message: 'Mappool released.',
        }
    }
}

export const prerender = false;