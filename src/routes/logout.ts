import * as cookie from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = function get() {
	return {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': cookie.serialize('token', '', {
				secure: true,
				httpOnly: true,
				maxAge: 0
			})
		}
	};
};
