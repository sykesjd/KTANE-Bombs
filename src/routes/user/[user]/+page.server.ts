
import client from '$lib/client';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';
import {error} from '@sveltejs/kit'

export const load: RequestHandler = async function ({ params }) {
	const user = await client.user.findFirst({
		where: {
			username: params.user
		},
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	const completions = await client.completion.findMany({
		select: {
			team: true,
			solo: true,
			mission: {
				select: {
					name: true
				}
			}
		},
		where: {
			team: {
				has: params.user
			}
		}
	});

	if (user === null && completions.length === 0) {
		throw error(404)
	}
	return {
			username: params.user,
			shownUser : user,
			completions
	};
};

export const PATCH: RequestHandler<Record<string, never>> = async function ({
	locals,
	params,
	request
}) {
	if (!hasPermission(locals.user, Permission.ModifyPermissions)) {
		return forbidden(locals);
	}

	const body: Permission[] = await request.json();
	await client.user.update({
		where: {
			id: params.user
		},
		data: {
			permissions: body
		}
	});

	return {
		status: 200
	};
};
