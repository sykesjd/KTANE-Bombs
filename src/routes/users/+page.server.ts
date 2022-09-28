throw new Error("@migration task: Update +page.server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");

import client from '$lib/client';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function () {
	const users = await client.user.findMany({
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	return {
		body: {
			users
		}
	};
};
