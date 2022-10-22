import type { ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, request, locals }: ServerLoadEvent) => {
	return { user: locals.user };
};
