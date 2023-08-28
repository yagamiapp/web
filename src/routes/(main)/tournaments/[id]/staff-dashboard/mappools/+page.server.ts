import { type Actions, redirect, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { StatusCodes } from "$lib/StatusCodes";

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
            return redirect(StatusCodes.PERMANENT_REDIRECT, `/tournaments/${tournamentId}/staff-dashboard/mappools/${newRound.id}`);
        }

        throw error(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: 'Something went wrong. Try again later.'
        });
    },
}

export const prerender = false;