import { fetchBeatmap } from "$lib/osu/FetchBeatmap";
import { StatusCodes } from "$lib/StatusCodes";
import prisma from "$lib/prisma";
import type { Map } from "@prisma/client";

export const assignMap = async (roundId: number, localId: string, beatmapId: string) => {
    if (isNaN(roundId)) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'No map ID provided.'
        }
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
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'Mappool not found.'
        }
    }

    if (!beatmapId.match(/^\d+$/g)) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'Invalid beatmap ID provided.'
        }
    }

    let beatmap: Map;
    try {
        beatmap = await fetchBeatmap(beatmapId);
    } catch (error) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'Failed to fetch beatmap. Double check the beatmap ID.'
        }
    }

    // Connect beatmap to MapInPool
    const mapInPool = await prisma.mapInPool.update({
        where: {
            identifier_mappoolId: {
                identifier: localId,
                mappoolId: Number(mappoolId)
            }
        },
        data: {
            Map: {
                connect: {
                    beatmap_id: beatmap.beatmap_id,
                }
            }
        }
    });

    if (!mapInPool) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'Mappool slot not found.'
        }
    }

    return {
        status: StatusCodes.OK
    }
}