import client from '$lib/client';
import { getData } from '$lib/repo';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const missions = await client.mission.findMany({
		where: {
			verified: true
		},
		select: {
			name: true,
			authors: true,
			bombs: true,
			tpSolve: true,
			factory: true,
			completions: true
		}
	});

	return {
		missions,
		modules: await getData()
	};
}
