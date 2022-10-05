import client from '$lib/client';
import type { RequestHandler } from '@sveltejs/kit';
import { Permission, type MissionPackQueueItem } from '$lib/types';
import { hasPermission } from '$lib/util';

export const load: RequestHandler = async function ({ parent, locals }) {
	const {user} = await parent();
	const users = await client.user.findMany({
		select: {
			id: true,
			avatar: true,
			username: true,
			discordName: hasPermission(user, Permission.RenameUser),
			permissions: true
		}
	});

	return {
		users: users
	};
};
