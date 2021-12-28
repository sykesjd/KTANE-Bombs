import type { Load } from '@sveltejs/kit';

export function authLoad(load: Load): Load {
	const innerLoad: Load = async (input) => {
		if (!input.session.user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}

		return load(input);
	};

	return innerLoad;
}
