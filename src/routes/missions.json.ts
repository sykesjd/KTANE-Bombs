import client from '$lib/client';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const missions = await client.mission.findMany({
		select: {
			name: true,
			bombs: true
		}
	});

	return {
		body: missions
	};
}
