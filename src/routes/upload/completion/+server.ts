import client from '$lib/client';
import type { Completion } from '$lib/types';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { completion, missionName }: { completion: Completion; missionName: string } =
		await request.json();

	const mission = await client.mission.findFirst({
		where: { name: missionName },
		select: {
			id: true
		}
	});

	if (mission === null || (completion.team.length != 1 && completion.solo)) {
		return new Response(undefined, { status: 406 });
	}

	await client.completion.create({
		data: {
			...completion,
			mission: {
				connect: {
					id: mission.id
				}
			},
			first: false, // This will be set to the correct value once the completion is verified.
			verified: false
		}
	});

	return new Response(undefined);
}
