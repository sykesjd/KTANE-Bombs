import client from '$lib/client';
import { onlyUnique } from '$lib/util';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	const missions = await client.mission.findMany({
		select: {
			name: true,
			completions: true
		},
		where: {
			verified: true
		}
	});

	const packs = await client.missionPack.findMany({
		select: {
			id: true,
			name: true
		}
	});

	return {
		missionNames: missions.map(mission => mission.name).sort(),
		solverNames: missions
			.map(mission => mission.completions.map(comp => comp.team))
			.flat(2)
			.filter(onlyUnique),
		packs: packs.sort((a, b) => {
			return a.name.localeCompare(b.name);
		})
	};
};
