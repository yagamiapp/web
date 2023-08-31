import { StatusCodes } from '$lib/StatusCodes';
import prisma from '../../../../../lib/prisma';
import { fail, error, type Actions } from '@sveltejs/kit';
import vine, { errors } from '@vinejs/vine';
import { parseFormData } from 'parse-nested-form-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user, perms } = locals;
	const { tournament } = await parent();

	if (!user) {
		throw error(StatusCodes.UNAUTHORIZED, 'You are not signed in.');
	}

	if (!perms.edit) {
		throw error(StatusCodes.UNAUTHORIZED, 'You do not have permission.');
	}

	return { tournament };
}

export const actions: Actions = {
	save: async ({ locals, request, params }) => {
		const tournamentId = parseInt(params.id ?? '-1');
		if (locals.perms.edit) throw error(StatusCodes.UNAUTHORIZED);

		const data = parseFormData(await request.formData());

		const schema = vine.object({
			acronym: vine.string(),
			name: vine.string(),
			color: vine.string().regex(new RegExp(/#([a-f0-9]{6})/g)),
			description: vine.string(),
			force_nf: vine.boolean(),
			score_mode: vine.number().range([0, 3]),
			team_mode: vine.number().range([0, 3]),
			team_size: vine.number().range([1, 16]),
			x_v_x_mode: vine.number().range([1, 16]),
			allow_registrations: vine.boolean(),
			fm_mods: vine.number(),
			double_pick: vine.number().range([0, 2]),
			double_ban: vine.number().range([0, 2]),
			private: vine.boolean()
		});


		try {
			const result = await vine.validate({ schema, data });

			// Yeah this should probably validate if the data is staying the same before
			//  querying the database, but I'm sure I'll come back to this page eventually
			await prisma.tournament.update({
				where: {
					id: tournamentId
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
	}
};

export const prerender = false;
