import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {

    const { user } = await parent();
    // If user isn't logged in
    if (!user) {
        throw error(401, "You must log in with osu! to register.");
    }
    
    // Check if this user is already in a team in this tournament
    const tournament = await prisma.tournament.findUnique({
        where: {
            id: parseInt(params.id)
        },
        include: {
            Hosts: {
                include: {
                    User: {
                        select: {
                            username: true,
                            country_code: true
                        }
                    }
                }
            },
            Teams: {
                include: {
                    Members: {
                        select: {
                            osuId: true
                        }
                    }
                }
            }
        }
    });

    if (!tournament) {
        throw error(404, "Tournament not found.");
    }

    const isInTeam = tournament?.Teams?.find(team => team.Members.some(member => member.osuId === user?.id));
    if (isInTeam) {
        throw error(403, "You are already registered in this tournament.");
    }

    // Handle solo registrations
    if (tournament.team_size == 1) {
        // Create new team for the user
        const team = await prisma.team.create({
            data: {
                name: user.username,
                icon_url: `https://a.ppy.sh/${user.id}`,
                color: tournament.color,
                Tournament: {
                    connect: {
                        id: tournament.id
                    }
                },
                Members: {
                    create: {
                        osuId: user.id
                    }
                }
            }
        });

        return {
            success: `You've been registered for ${tournament.name}.`,
            tournament
        };
    }

    return { tournament };
}
