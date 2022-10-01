import client from '$lib/client';
import { getData } from '$lib/repo';
import type { RequestHandler } from '@sveltejs/kit';

export async function load(): Promise<RequestHandler> {
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
