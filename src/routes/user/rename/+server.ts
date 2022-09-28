import client from '$lib/client';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async function ({ locals, request }) {
	if (!hasPermission(locals.user, Permission.RenameUser)) forbidden(locals);

	const { oldUsername, username } = await request.json();

	const completions = await client.completion.findMany({
		where: {
			team: {
				has: oldUsername
			}
		}
	});

	const missions = await client.mission.findMany({
		where: {
			authors: {
				has: oldUsername
			}
		}
	});

	const queries = [
		// User
		client.user.update({
			where: {
				username: oldUsername
			},
			data: {
				username
			}
		}),
		// Mission
		...missions.map((mission) =>
			client.mission.update({
				where: {
					id: mission.id
				},
				data: {
					authors: mission.authors.map((name) => (name === oldUsername ? username : name))
				}
			})
		),
		// Completions
		...completions.map((completion) =>
			client.completion.update({
				where: {
					id: completion.id
				},
				data: {
					team: completion.team.map((name) => (name === oldUsername ? username : name))
				}
			})
		)
	];

	await client.$transaction(queries);

	return new Response("");
};
