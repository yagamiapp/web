import type { Team } from '@prisma/client';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { MatchStates } from '$lib/MatchStates';
import { StatusCodes } from '$lib/StatusCodes';
import { parseFormData } from 'parse-nested-form-data';

export const load: PageServerLoad = async ({ parent, depends }) => {
    depends('rounds');
    const parentData = await parent();
    const tournament: db.FullyPopulatedTournament = parentData.tournament;

    // Retrieve this tournament's teams
    const teams = tournament.Teams.filter((team: Team) => {
        return team.tournamentId == tournament.id;
    });

    return { 
        tournamentName: tournament.name, 
        teams, 
        rounds: tournament.rounds 
    };
}

export const actions: Actions = {
    create_match: async ({ request }) => {
        const formData = parseFormData(await request.formData());
        const roundId = parseInt(String(formData.rounds));
        const matchupId = String(formData.matchup_id);
        // Extract team IDs (matchup ID format = "[team 1 id]vs[team 2 id]")
        const teamIds = matchupId.split('vs');
        const team1Id = parseInt(teamIds[0]);
        const team2Id = parseInt(teamIds[1]);

        // Create new match record
        const match = await prisma.match.create({
            data: {
                Teams: {
                    create: [
                        {
                            Team: {
                                connect: {
                                    id: team2Id
                                }
                            },
                            score: 0,
                            aborts: 0,
                            faults: 0,
                            warmed_up: false
                        },
                        {
                            Team: {
                                connect: {
                                    id: team1Id
                                }
                            },
                            score: 0,
                            aborts: 0,
                            faults: 0,
                            warmed_up: false
                        }
                    ]
                },
                state: MatchStates.NOT_STARTED,
                scrim: false,
                Round: {
                    connect: {
                        id: roundId
                    }
                }
            },
            include: {
                Teams: {
                    include: {
                        Team: {
                            include: {
                                Members: {
                                    include: {
                                        User: true
                                    }
                                }
                            }
                        },
                        Bans: true,
                        Picks: true,
                        Wins: true
                    }
                }
            }
        });

        if (match) {

            return {
                status: StatusCodes.OK,
                message: "Match " + match.id + " (" + 
                    match.Teams[0].Team.name + " vs " + match.Teams[1].Team.name + ") created",
                match
            }
        }

        return { 
            status: StatusCodes.INTERNAL_SERVER_ERROR, 
            message: "Failed to create match. Try again later." 
        };
    }
}

export const prerender = false;