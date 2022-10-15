import type { ServerLoadEvent } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ cookies, request, locals }: ServerLoadEvent) => {
	return { user: locals.user };
};
