import client from '$lib/client';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const missions = await client.mission.findMany({
		where: {
			verified: true
		},
		select: {
			name: true,
			bombs: true,
			tpSolve: true,
			factory: true,
			completions: true
		}
	});

	return {
		body: JSON.stringify(missions)
	};
}
