import client from '$lib/client';
export const load = async ({ cookies, request, resolve, locals }) => {
	const token = cookies.get("token");
  const conflict = cookies.get("usernameConflict")

	locals.token = token ?? null;
	if (!conflict) {
		locals.user = token
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
	}
  return {user : locals.user}
}
