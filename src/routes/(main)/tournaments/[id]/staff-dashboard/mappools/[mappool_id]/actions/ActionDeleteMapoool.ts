import { StatusCodes } from "$lib/StatusCodes";
import prisma from "$lib/prisma";

export const deleteMappool = async (roundId: number) => {
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
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'This round does not exist.'
        }
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

    return {
        status: StatusCodes.OK
    }
}