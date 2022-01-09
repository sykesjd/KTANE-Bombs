import client from '$lib/client';
import { Permission } from '$lib/types';
import { hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function ({ locals }) {
	if (!hasPermission(locals.user, Permission.ModifyPermissions)) {
		return {
			status: 403
		};
	}

	const users = await client.user.findMany({
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	return {
		body: users
	};
};
