import client from '$lib/client';
import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function get({ params }: ServerRequest): Promise<EndpointOutput> {
	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		include: {
			bombs: true,
			completions: true
		}
	});

	return {
		body: missionResult
	};
}
