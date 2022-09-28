throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

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

	return {
		status: 200
	};
};
