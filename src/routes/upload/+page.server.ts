
import client from '$lib/client';
import type { RequestHandler } from '@sveltejs/kit';

export const load: RequestHandler = async function () {
	const names = (
		await client.mission.findMany({
			select: {
				name: true
			},
			where: {
				verified: true
			}
		})
	).map((mission) => mission.name);

	const packs = await client.missionPack.findMany({
		select: {
			name: true
		}
	});

	return {
			missionNames: names,
			packs
	};
};
