import { type Actions, redirect, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { StatusCodes } from "$lib/StatusCodes";

export const actions: Actions = {
    // create_mappool
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
            throw redirect(StatusCodes.PERMANENT_REDIRECT, `/tournaments/${tournamentId}/staff-dashboard/mappools/${newRound.id}?/new_mappool`);
            // This redirect always looks for an action on the redirected page for some reason.
            // I can't figure out why or how to prevent it so it just calls to an empty action called ?/new_mappool for now
        }

        throw error(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: 'Something went wrong. Try again later.'
        });
    },
}

export const prerender = false;