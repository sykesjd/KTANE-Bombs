import client from '$lib/client';
import type { Mission } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function post({ body }: ServerRequest<unknown, Mission[]>): Promise<EndpointOutput> {
	for (const mission of body) {
		await client.mission.create({
			data: {
				name: mission.name,
				bombs: {
					create: mission.bombs.map((bomb) => {
						return {
							...bomb,
							pools: JSON.parse(JSON.stringify(bomb.pools))
						};
					})
				},
				verified: false
			}
		});
	}

	return {
		status: 200
	};
}
