import client from '$lib/client';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async function ({ locals, request }) {
	if (!hasPermission(locals.user, Permission.RenameUser)) return forbidden(locals);

	const { oldUsername, username } = await request.json();

	const completions = await client.completion.findMany({
		where: {
			team: {
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
		client.mission.updateMany({
			where: {
				author: oldUsername
			},
			data: {
				author: username
			}
		}),
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

	return {
		status: 200
	};
};
