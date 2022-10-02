
import client from '$lib/client';
import OAuth, { scope } from '$lib/oauth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { TokenRequestResult } from 'discord-oauth2';
import {redirect, error} from '@sveltejs/kit'
import { setContext, getContext } from 'svelte';

export const load: RequestHandler = async function load({ url, cookies }) {
	const code = url.searchParams.get('code');
	if (code === null)
		throw error(406)

	const result = await OAuth.tokenRequest({
		code,
		grantType: 'authorization_code',
		scope: scope
	});

	return await login(result, cookies);
};

export const actions = {
	default: async ({ request, cookies }) => {
		const result = getContext('oauthRequest')
		const values = await request.formData();
		const username = values.get('username');
		return await login(result, cookies, username);
	}
}


async function login(result: TokenRequestResult, cookies,  username: string | null = null) {
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
		setContext('oauthRequest', result)
		return {
				username: user.username,
				takenUsernames: users.map((user) => user.username),
				result: result
		};
	}
	cookies.set("token", result.access_token, {
		secure: true,
		httpOnly: true,
		maxAge: 2629800
	})
	throw redirect(302, "/")
}
