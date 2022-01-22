import client from '$lib/client';
import type { GetSession, Handle } from '@sveltejs/kit/types/hooks';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') ?? '');
	const token = cookies.token;
	event.locals.user = token
		? await client.user.findFirst({
				where: {
					accessToken: token
				},
				select: {
					id: true,
					username: true,
					avatar: true,
					permissions: true
				}
		  })
		: null;

	return await resolve(event);
};

export const getSession: GetSession = ({ locals }) => {
	return {
		user: locals.user
	};
};
