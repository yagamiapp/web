import { StatusCodes } from "$lib/StatusCodes";
import prisma from "$lib/prisma";

export const releaseMappool = async (roundId: number) => {
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
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'Mappool not completed.'
        }
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
        message: !round.show_mappool ? 'Mappool released.' : 'Mappool unreleased.',
    }
}