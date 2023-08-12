import prisma from '$lib/prisma';
import { error, fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import vine, { errors } from '@vinejs/vine';
import { parseFormData } from 'parse-nested-form-data';
import { StatusCodes } from '$lib/StatusCodes';

export const load: PageServerLoad = async ({ parent }) => {
	const { tournament, user, editPerms } = await parent();
	// If user isn't logged in
	if (!user) {
		throw error(StatusCodes.UNAUTHORIZED, 'You must log in with osu! to register.');
	}

	// Check if the user has staff permissions for this tournament
	if (editPerms) {
		throw error(StatusCodes.BAD_REQUEST, 'You can\'t sign up for your own tournament.');
	}

	// Check if this user is already in a team in this tournament
	const isInTeam = tournament?.Teams?.find((team) =>
		team.Members.some((member) => member.osuId === user?.id)
	);
	if (isInTeam) {
		throw error(StatusCodes.BAD_REQUEST, 'You are already registered in this tournament.');
	}

	// Handle solo registrations automatically
	if (tournament.team_size == 1) {
		try {
			// Create new team for the user
			const team = await prisma.team.create({
				data: {
					name: user.username,
					icon_url: `https://a.ppy.sh/${user.id}`,
					color: tournament.color,
					scrim: false,
					Tournament: {
						connect: {
							id: tournament.id
						}
					},
					Members: {
						create: {
							osuId: user.id,
							member_order: 0
						}
					}
				}
			});

			return {
				feedback: `'${team.name}' has been registered for ${tournament.name}.`,
				tournament
			};
		} catch (error) {
			return {
				feedback: `There was an error registering you for ${tournament.name}. Please try again later, or contact the tournament host(s).`,
				tournament
			};
		}
	} else {
		// Retrieve received invites before loading page
		const invites = await prisma.teamInvite.findMany({
			where: {
				inviteeUserId: user.id
			},
			include: {
				Team: {
					include: {
						Members: {
							include: {
								User: true
							}
						}
					}
				}
			}
		});

		return { tournament, invites };
	}
};

export const actions: Actions = {
	create_team: async ({ locals, request, params }) => {
		const data = parseFormData(await request.formData());

		const schema = vine.object({
			name: vine.string(),
			color: vine.string().regex(new RegExp(/#([a-f0-9]{6})/g))
		});

		let redirectURL = '/tournaments/' + params.id + '/teams/';

		try {
			const result = await vine.validate({ schema, data });

			const team = await prisma.team.create({
				data: {
					name: result.name,
					icon_url: `https://a.ppy.sh/${locals.user.id}`,
					color: result.color,
					Tournament: {
						connect: {
							id: Number(params.id)
						}
					},
					Members: {
						create: {
							osuId: locals.user.id
						}
					}
				}
			});

			redirectURL += `${team.id}`;
		} catch (err) {
			console.log('Error: ' + err);
			if (err instanceof errors.E_VALIDATION_ERROR) {
				const status = err.status;
				const messages = err.messages;
				console.log(messages);
				return fail(status, { data, messages });
			}
		}

		throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectURL);
	},

	accept_invite: async ({ locals, request, params }) => {
		const formData = await request.formData();
		const teamId = String(formData.get('team_id'));

		if (!/^[0-9]+$/.test(teamId)) {
			return fail(StatusCodes.NOT_ACCEPTABLE, { message: 'Invalid team ID somehow.' });
		}

		const team = await prisma.team.findUnique({
			where: {
				id: parseInt(teamId)
			},
			include: {
				Members: {
					include: {
						User: true
					}
				}
			}
		});

		if (!team) {
			return fail(StatusCodes.NOT_FOUND, {
				message: 'Team not found. This team may have been deleted.'
			});
		}

		// Add user to team
		const member_order = team.Members.length;
		const newUserInTeam = await prisma.userInTeam.create({
			data: {
				User: {
					connect: {
						id: locals.user.id
					}
				},
				Team: {
					connect: {
						id: parseInt(teamId)
					}
				},
				member_order: member_order
			}
		});

		if (!newUserInTeam) {
			return fail(StatusCodes.INTERNAL_SERVER_ERROR, {
				message: 'Something went wrong. Try again later.'
			});
		}

		// Delete other unaccepted invites for this tournament
		const unacceptedInvites = await prisma.teamInvite.findMany({
			where: {
				inviteeUserId: locals.user.id
			},
			include: {
				Team: {
					select: {
						id: true,
						tournamentId: true
					}
				}
			}
		});

		for (const unacceptedInvite of unacceptedInvites) {
			if (unacceptedInvite.Team.tournamentId == Number(params.id)) {
				await prisma.teamInvite.delete({
					where: {
						inviteeUserId_teamId: {
							inviteeUserId: locals.user.id,
							teamId: unacceptedInvite.Team.id
						}
					}
				});
			}
		}

		throw redirect(
			StatusCodes.MOVED_PERMANENTLY,
			'/tournaments/' + team.tournamentId + '/teams/' + teamId
		);
	},

	reject_invite: async ({ locals, request }) => {
		const formData = await request.formData();
		const teamId = String(formData.get('team_id'));

		if (!/^[0-9]+$/.test(teamId)) {
			return fail(StatusCodes.NOT_ACCEPTABLE, { message: 'Invalid team ID somehow.' });
		}

		await prisma.teamInvite.delete({
			where: {
				inviteeUserId_teamId: {
					inviteeUserId: locals.user.id,
					teamId: parseInt(teamId)
				}
			}
		});
	}
};

// Set prerender to false to prevent "Error: Cannot prerender pages with actions"
// (this error prevented the page from being opened in a new tab)
export const prerender = false;
