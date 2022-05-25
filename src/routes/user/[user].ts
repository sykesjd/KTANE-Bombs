import client from '$lib/client';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function ({ locals, params }) {
	if (!hasPermission(locals.user, Permission.ModifyPermissions)) {
		return forbidden(locals);
	}

	const user = await client.user.findFirst({
		where: {
			id: params.user
		},
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	if (user === null) {
		return {
			status: 404
		};
	}

	return {
		body: {
			user
		}
	};
};

export const patch: RequestHandler<Record<string, never>> = async function ({
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
