import client from '$lib/client';
import OAuth, { scope } from '$lib/oauth';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const get: RequestHandler = async function get({ url }) {
	const code = url.searchParams.get('code');
	if (code === null)
		return {
			status: 406
		};

	const result = await OAuth.tokenRequest({
		code,
		grantType: 'authorization_code',
		scope: scope
	});

	const user = await OAuth.getUser(result.access_token);

	// .avatar should never be null or undefined.
	if (user.avatar == null)
		return {
			status: 500
		};

	await client.user.upsert({
		where: {
			id: user.id
		},
		create: {
			id: user.id,
			username: user.username,
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			avatar: user.avatar
		},
		update: {
			username: user.username,
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			avatar: user.avatar
		}
	});

	return {
		status: 302,
		headers: {
			Location: '/',
			'Set-Cookie': cookie.serialize('token', result.access_token, {
				secure: true,
				httpOnly: true,
				maxAge: 2629800
			})
		}
	};
};
