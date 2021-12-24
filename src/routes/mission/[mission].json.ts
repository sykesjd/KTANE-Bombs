import client from '$lib/client';
import { getSlugValue } from '$lib/util';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get({ params }: { params: { mission: string } }): Promise<EndpointOutput> {
	const { mission } = params;
	const missionNames = (
		await client.mission.findMany({
			select: {
				name: true
			}
		})
	).map((a) => a.name);

	for (const name of missionNames) {
		if (getSlugValue(name) === mission) {
			const mission = await client.mission.findFirst({
				where: {
					name: name
				},
				include: {
					bombs: true,
					completions: true
				}
			});

			return {
				body: JSON.stringify(mission)
			};
		}
	}
}
