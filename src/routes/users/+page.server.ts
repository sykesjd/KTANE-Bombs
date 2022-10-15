import client from '$lib/client';

export const load = async function () {
	const users = await client.user.findMany({
		select: {
			id: true,
			avatar: true,
			username: true,
			permissions: true
		}
	});

	return {
		users: users
	};
};
