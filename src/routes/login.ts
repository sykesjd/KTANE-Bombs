import OAuth, { scope } from '$lib/oauth';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = function get() {
	const url = OAuth.generateAuthUrl({
		scope: scope
	});

	return {
		status: 302,
		headers: {
			Location: url
		}
	};
};
