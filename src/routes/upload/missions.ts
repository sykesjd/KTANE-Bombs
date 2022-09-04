import client from '$lib/client';
import type { Mission } from '$lib/types';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

export async function post({ request }: RequestEvent): Promise<RequestHandlerOutput> {
	const missions: Mission[] = await request.json();
	for (const mission of missions) {
		await client.mission.create({
			data: {
				name: mission.name,
				author: mission.author,
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
