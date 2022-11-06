import client from '$lib/client';
import type { MissionWithPack } from '$lib/types';
import { error, type RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const missions: MissionWithPack[] = await request.json();
	if (missions.some(m => m.missionPack === null)) {
		throw error(400, 'Mission pack is required');
	}

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
				missionPackId: mission.missionPack?.id,
				verified: false
			}
		});
	}

	return new Response(undefined);
}
