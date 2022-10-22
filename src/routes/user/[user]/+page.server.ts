import client from '$lib/client';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load : PageServerLoad = async function ({ params }: ServerLoadEvent) {
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
		throw error(404);
	}
	return {
		username: params.user,
		shownUser: user,
		completions
	};
};

export const actions : Actions = {
	editPermissions: async ({ locals, request }: RequestEvent) => {
		if (!hasPermission(locals.user, Permission.ModifyPermissions)) {
			return forbidden(locals);
		}
		const fData = await request.formData();
		const body: Permission[] = JSON.parse(fData.get('perms')?.toString() ?? '');
		const user = fData.get('user')?.toString();
		if (user === null || user === undefined) {
			throw error(400);
		}
		await client.user.update({
			where: {
				id: user
			},
			data: {
				permissions: body
			}
		});

		return {};
	}
};
