

import client from '$lib/client';
import type { RequestHandler } from '@sveltejs/kit';

export const load: RequestHandler = async function () {
	const users = await client.user.findMany({
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	return {
			users : users
	};
};
