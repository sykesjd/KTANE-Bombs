import client from '$lib/client';
import { Permission } from '$lib/types';
import { hasPermission } from '$lib/util';
import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function get({ params, locals }: ServerRequest): Promise<EndpointOutput> {
	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		select: {
			name: true,
			verified: true,
			bombs: true,
			completions: true
		}
	});

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		return {
			status: 403
		};
	}

	return {
		body: missionResult
	};
}
