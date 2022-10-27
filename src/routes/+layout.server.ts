export const load = async ({ cookies, request, resolve, locals }: any) => {
	return { user: locals.user };
};
