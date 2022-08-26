import client from '$lib/client';
import OAuth, { scope } from '$lib/oauth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { TokenRequestResult } from 'discord-oauth2';

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

	return await login(result);
};

export const post: RequestHandler = async ({ request }) => {
	const { result, username } = await request.json();

	return await login(JSON.parse(result), username);
};

async function login(result: TokenRequestResult, username: string | null = null) {
	try {
		const user = await OAuth.getUser(result.access_token);

		// .avatar should never be null or undefined.
		if (user.avatar == null) throw 'No avatar, this should never happen.';

		await client.user.upsert({
			where: {
				id: user.id
			},
			create: {
				id: user.id,
				username: username ?? user.username,
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				avatar: user.avatar
			},
			update: {
				username: username ?? user.username,
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				avatar: user.avatar
			}
		});
	} catch (e) {
		if (!(e instanceof PrismaClientKnownRequestError && e.code === 'P2002')) {
			throw e;
		}

		// Conflict happened on username, the user needs to pick another.
		const user = await OAuth.getUser(result.access_token);
		const users = await client.user.findMany({ select: { username: true } });
		return {
			body: {
				username: user.username,
				takenUsernames: users.map((user) => user.username),
				result: JSON.stringify(result)
			}
		};
	}

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
}
