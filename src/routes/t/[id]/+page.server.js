import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";

export const prerender = true;

export async function load({ params }) {
	let tournamentId = parseInt(params.id);

	if (!tournamentId) {
		throw error(404, "Not found");
	}

	let tournament = await prisma.tournament.findUnique({
		where: {
			id: tournamentId,
		},
	});

	let rounds = await prisma.round.findMany({
		where: {
			tournamentId: tournament.id,
		},
	});

	if (!tournament) {
		throw error(404, "Not found");
	}

	return { tournament, rounds };
}
