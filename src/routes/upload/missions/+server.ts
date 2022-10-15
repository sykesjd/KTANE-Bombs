import client from '$lib/client';
import type { Mission } from '$lib/types';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const missions: Mission[] = await request.json();
	for (const mission of missions) {
		await client.mission.create({
			data: {
				name: mission.name,
				authors: mission.authors,
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

	return new Response(undefined);
}
